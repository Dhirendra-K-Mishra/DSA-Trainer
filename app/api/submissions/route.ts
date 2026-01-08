import { runJudge } from "@/lib/judge";
import { prisma } from "@/lib/prisma";
import {success, failure} from "@/lib/apiResponse";
import { TEMP_USER_ID } from "@/lib/user";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { problemSlug, language, code } = body;

    if (!problemSlug || !language || !code) {
      return failure("Bad request", 400);
    }

    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
      include: { testcases: true }
    });

    if (!problem) {
      return failure("Problem not found", 404);
    }

    const submission = await prisma.submission.create({
      data: {
        problemId: problem.id,
        userId: TEMP_USER_ID,
        language,
        code,
        status: "pending"
      }
    });

    const result = await runJudge(language, code, problem.testcases);

    const updated = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: result.status,
        runtimeMs: result.runtimeMs || null
      }
    });
    if(updated.status === "ACCEPTED") {
      await prisma.progress.upsert({
        where: {
          userId_problemId: {
            userId: TEMP_USER_ID,
            problemId: problem.id
          }
        },
        update: {},
        create: {
          userId: TEMP_USER_ID,
          problemId: problem.id
        }
      });
    }
    return success(updated);

  } catch (error) {
    console.error("SUBMISSION ERROR:", error);
    return failure("Failed to create submission", 500);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const problemSlug = searchParams.get("problem");

    const submissions = await prisma.submission.findMany({
      where: {
        userId: TEMP_USER_ID,
        ...(problemSlug
          ? {
              problem: {
                slug: problemSlug
              }
            }
          : {})
      },
      select: {
        id: true,
        language: true,
        code: true,
        status: true,
        runtimeMs: true,
        memoryKb: true,
        createdAt: true,
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return success(submissions);
  } catch (error) {
    return failure("Failed to fetch submissions",500);
  }
}
