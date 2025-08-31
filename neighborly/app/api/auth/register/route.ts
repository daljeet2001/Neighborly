import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;
  if (!email || !password) return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return new Response(JSON.stringify({ error: 'User exists' }), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return new Response(JSON.stringify({ id: user.id, email: user.email }), { status: 201 });
}

