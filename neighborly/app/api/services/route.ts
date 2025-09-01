import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
  const { title, description, price, neighborhoodId, lat, lng } = body;
  if (!title || !neighborhoodId) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

  const service = await prisma.service.create({
    data: {
      title,
      description,
      price: price ? Number(price) : undefined,
      neighborhoodId,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      userId: (session as any).user.id,
    },
    include: { user: true },
  });

  return NextResponse.json(service);
}

