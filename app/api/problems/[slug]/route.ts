import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/apiResponse";
import { TEMP_USER_ID } from "@/lib/user";


export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const problem = await prisma.problem.findUnique({
      where: { slug },
      select: {
        title: true,
        statement: true,
        difficulty: true,
        topic: {
          select: {
            title: true,
            slug: true
          }
        },
        testcases: {
          where: { isSample: true },
          select: {
            input: true,
            output: true
          }
        }
      }
    });

    if (!problem) {
      return failure("Problem not found", 404);
    }

    return success(problem);
  } catch (error) {
    return failure( "Failed to fetch problem",500);
  }
}
