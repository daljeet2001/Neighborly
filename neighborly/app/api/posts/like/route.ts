import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; 

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    const post = await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
      select: { id: true, likesCount: true },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error("Error liking post", err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

// export async function DELETE(req: Request) {
//   try {
//     const { postId } = await req.json();

//     const post = await prisma.post.update({
//       where: { id: postId },
//       data: { likesCount: { decrement: 1 } },
//       select: { id: true, likesCount: true },
//     });

//     return NextResponse.json(post);
//   } catch (err) {
//     console.error("Error unliking post", err);
//     return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 });
//   }
// }
