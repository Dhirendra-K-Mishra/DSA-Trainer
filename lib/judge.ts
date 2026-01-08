import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";

export type JudgeResult = {
  status: "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR" | "TIME_LIMIT_EXCEEDED";
  runtimeMs?: number;
};

function runWithTimeout(command: string, input: string, timeoutMs = 2000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) return reject("TIME_LIMIT");
        return reject(stderr || "RUNTIME_ERROR");
      }
      resolve(stdout.trim());
    });

    child.stdin?.write(input);
    child.stdin?.end();
  });
}

export async function runJudge(language: string, code: string, testcases: { input: string; output: string }[]): Promise<JudgeResult> {
  const folder = path.join(process.cwd(), "temp");
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const filename =
    language === "cpp"
      ? path.join(folder, "solution.cpp")
      : path.join(folder, "solution.py");

  fs.writeFileSync(filename, code);

  try {
    if (language === "cpp") {
      execSync(`g++ "${filename}" -o "${folder}/solution.exe"`);
    }

    const start = Date.now();

    for (const tc of testcases) {
      let output = "";

      try {
        if (language === "cpp") {
          output = await runWithTimeout(`${folder}/solution.exe`, tc.input);
        } else {
          output = await runWithTimeout(`python "${filename}"`, tc.input);
        }
      } catch (err) {
        if (err === "TIME_LIMIT") return { status: "TIME_LIMIT_EXCEEDED" };
        return { status: "RUNTIME_ERROR" };
      }

      if (output.trim() !== tc.output.trim()) {
        return { status: "WRONG_ANSWER" };
      }
    }

    return { status: "ACCEPTED", runtimeMs: Date.now() - start };
  } catch {
    return { status: "RUNTIME_ERROR" };
  }
}
