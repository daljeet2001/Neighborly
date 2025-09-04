import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const neighborhoodId = url.searchParams.get('neighborhoodId') ?? undefined;
  const services = await prisma.service.findMany({
    where: neighborhoodId ? { neighborhoodId } : undefined,
    include: { user: true },
  });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return new Response(null, { status: 401 });

  const body = await req.json();
  const { servicebody,photo, neighborhoodId, lat, lng } = body;
  if (!servicebody || !neighborhoodId) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  const service = await prisma.service.create({
    data: {
      body:servicebody,
      photo,
      neighborhoodId,
      userId: (session as any).user.id,
    },
    include: { user: true },
  });

  return NextResponse.json(service);
}

