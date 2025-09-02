import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const session = await getServerSession(authOptions as any);

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
      receiver: { select: { id: true, name: true, email: true } }
    },
  });
  console.log(messages);

  return Response.json(messages);
}
