import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    const prisma = new PrismaClient();
    const result = await prisma.post.updateMany({
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });
    await prisma.$disconnect();
    return NextResponse.json({ message: `Successfully published ${result.count} posts` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
