import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { failure, success } from "@/lib/apiResponse";

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { order: "asc" },
      select: {
        title: true,
        slug: true,
        order: true
      }
    });

    return success(topics);
  } catch (error) {
    return failure("Failed to fetch topics",500);
  }
}
