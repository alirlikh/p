import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateCategorySchema } from '@/lib/validations/blog';

// GET /api/blog/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create new category (admin only)
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Validate request body
    const body = await request.json();
    const validationResult = CreateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Create category
    const category = await prisma.category.create({
      data: validationResult.data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating category:', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if ((error as { code: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'A category with this name or slug already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
