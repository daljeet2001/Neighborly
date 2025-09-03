import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const neighborhoodId = url.searchParams.get('neighborhoodId') ?? undefined;
  const posts = await prisma.post.findMany({
    where: neighborhoodId ? { neighborhoodId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response(null, { status: 401 });

  const body = await req.json();
  const { postbody, photo, neighborhoodId, lat, lng } = body;

  if (!postbody  || !neighborhoodId) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      body:postbody,
      photo,
      neighborhoodId,
      userId: (session as any).user.id,
    },
    include: { user: true },
  });

  // Return the created post; clients should notify WS server to broadcast.
  return NextResponse.json(post);
}

export async function PATCH(req: Request) {
  // update status (e.g., close a post)
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response(null, { status: 401 });

  const body = await req.json();
  const { postId, status } = body;
  if (!postId || !status) return new Response(JSON.stringify({ error: 'Missing postId/status' }), { status: 400 });

  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return new Response(null, { status: 404 });
  // Only owner can update status
  if (existing.userId !== (session as any).user.id) return new Response(null, { status: 403 });

  const post = await prisma.post.update({ where: { id: postId }, data: {  } });
  return NextResponse.json(post);
}

