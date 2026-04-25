import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {success, failure} from "@/lib/apiResponse";
import { TEMP_USER_ID } from "@/lib/user";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { problemSlug } = body;

        if(!problemSlug){
            return failure("Bad request", 400);
        }

        const problem = await prisma.problem.findUnique({
            where: { slug: problemSlug }
        });

        if(!problem) {
            return failure("Problem not found" , 404);
        }

        const progress = await prisma.progress.upsert({
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
        return success(progress);
    } catch (error){
        return failure("Failed to mark progress",500);
    }
}
export async function GET() {
  try {
    const progress = await prisma.progress.findMany({
      where: {
        userId: TEMP_USER_ID
      },
      select: {
        solvedAt: true,
        problem: {
          select: {
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
        }
      },
      orderBy: {
        solvedAt: "desc"
      }
    });

    return success(progress);
  } catch (error) {
    return failure("Failed to fetch progress" ,500);
  }
}