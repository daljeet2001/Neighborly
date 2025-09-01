import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const neighborhood = await prisma.neighborhood.upsert({
    where: { name: 'Default Neighborhood' },
    update: {},
    create: { name: 'Default Neighborhood', city: 'Local City', pincode: '000000' },
  });

  const hashed = await bcrypt.hash('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@neigh.app' },
    update: {},
    create: { name: 'Demo User', email: 'demo@neigh.app', password: hashed, neighborhoodId: neighborhood.id },
  });

  await prisma.post.create({
    data: {
      title: 'Need help moving a table',
      description: 'Looking for someone tomorrow morning.',
      category: 'help',
      userId: user.id,
      neighborhoodId: neighborhood.id,
    },
  });

  console.log('seed completed');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

