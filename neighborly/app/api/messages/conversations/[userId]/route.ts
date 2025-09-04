// /api/messages/conversations/[userId]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: any) {
  const { userId } = params;

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  const conversations: Record<string, any> = {};
  for (const msg of messages) {
    const partner = msg.senderId === userId ? msg.receiver : msg.sender;

    if (!conversations[partner.id]) {
      conversations[partner.id] = {
        user: partner,
        lastMessage: msg.content,
        lastAt: msg.createdAt,
      };
    }
  }

  return Response.json(Object.values(conversations));
}

