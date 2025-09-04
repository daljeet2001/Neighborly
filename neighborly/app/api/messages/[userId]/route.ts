import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params; // ✅ no await

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: (session as any).user.id, receiverId: userId },
        { senderId: userId, receiverId: (session as any).user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  return Response.json(messages);
}
