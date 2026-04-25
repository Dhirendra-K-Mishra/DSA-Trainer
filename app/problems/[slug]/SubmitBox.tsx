"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";

type Props = {
  problemSlug: string;
};

const defaultCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
  python: `# Write your code here

`
};

export default function SubmitBox({ problemSlug }: Props) {
  const [language, setLanguage] = useState<"cpp" | "python">("cpp");
  const [code, setCode] = useState(defaultCode.cpp);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemSlug,
          language,
          code,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setResult(json.message || "Submission failed");
      } else {
        setResult(json.data.status);
      }
    } catch (err) {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ marginTop: "32px" }}>
      <h2>Submit Solution</h2>

      <label>
        Language:
        <select
          value={language}
          onChange={(e) => {
            const lang = e.target.value as "cpp" | "python";
            setLanguage(lang);
            setCode(defaultCode[lang]);   // 🔥 auto-fill template
          }}
          style={{ marginLeft: "8px" }}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>
      </label>

      <div style={{ marginTop: "12px", border: "1px solid #ccc" }}>
        <Editor
          height="300px"
          language={language === "cpp" ? "cpp" : "python"}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !code}
        style={{ marginTop: "12px" }}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {result && (
        <p
          style={{
            marginTop: "12px",
            fontWeight: "bold",
            color:
              result === "ACCEPTED"
                ? "green"
                : result === "WRONG_ANSWER"
                ? "red"
                : "orange",
          }}
        >
          Result: {result}
        </p>
      )}
    </section>
  );
}
