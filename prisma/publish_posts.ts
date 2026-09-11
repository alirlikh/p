import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Marking all posts as published...');
  const result = await prisma.post.updateMany({
    data: {
      published: true,
      publishedAt: new Date(),
    },
  });
  console.log(`Successfully updated ${result.count} posts.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
