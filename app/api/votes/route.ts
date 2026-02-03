import { NextRequest, NextResponse } from "next/server";
import { syncCurrentUser } from "@/lib/sync-user";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const dbUser = await syncCurrentUser();

    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // check if vote already exists
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: dbUser.id,
        postId: postId,
      },
    });

    if (existingVote) {
      // remove vote (toggle off)
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      return NextResponse.json({ voted: false });
    }

    // add vote (toggle on)
    await prisma.vote.create({
      data: {
        userId: dbUser.id,
        postId: postId,
      },
    });
    return NextResponse.json({ voted: true });

  }

  catch (error) {
    console.error("Error togelling vote :", error); 
    return NextResponse.json( 
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
