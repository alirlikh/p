import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateTagSchema } from '@/lib/validations/blog';
import { logger } from '@/lib/logger';

// GET /api/blog/tags - List all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    logger.error('Error fetching tags', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST /api/blog/tags - Create new tag (admin only)
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Validate request body
    const body = await request.json();
    const validationResult = CreateTagSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Check if tag with same slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug: validationResult.data.slug },
    });

    if (existingTag) {
      return NextResponse.json({ error: 'A tag with this slug already exists' }, { status: 409 });
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: validationResult.data,
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: unknown) {
    logger.error('Error creating tag', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if ((error as { code: string }).code === 'P2002') {
        return NextResponse.json({ error: 'A tag with this slug already exists' }, { status: 409 });
      }
    }

    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
