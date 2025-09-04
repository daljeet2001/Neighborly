import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { receiverId, content } = body;

  if (!receiverId || !content) return new Response("Invalid data", { status: 400 });

  const message = await prisma.message.create({
    data: {
      senderId: (session as any).user.id,
      receiverId,
      content,
    },
  });

  return new Response(JSON.stringify(message));
}

