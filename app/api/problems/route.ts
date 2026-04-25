import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/apiResponse";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicSlug = searchParams.get("topic");

    const problems = await prisma.problem.findMany({
      where: topicSlug
        ? {
            topic: {
              slug: topicSlug
            }
          }
        : {},
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topic: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });

    return success(problems);
  } catch (error) {
    return failure("Failed to fetch problems" ,500);
  }
}
