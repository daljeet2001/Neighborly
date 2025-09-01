import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, pincode, city } = body;

    if (!email || !password || !pincode) {
      return new Response(
        JSON.stringify({ error: 'Missing fields' }),
        { status: 400 }
      );
    }

    // check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    // check if neighborhood exists by pincode
    let neighborhood = await prisma.neighborhood.findUnique({
      where: { pincode },
    });

    // if not, create neighborhood
    if (!neighborhood) {
      neighborhood = await prisma.neighborhood.create({
        data: {
          name: city || `Neighborhood-${pincode}`,
          city,
          pincode,
        },
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        neighborhoodId: neighborhood.id,
      },
    });

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        neighborhoodId: user.neighborhoodId,
      }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
