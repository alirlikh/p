import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateCategorySchema } from '@/lib/validations/blog';
import { logger } from '@/lib/logger';

// GET /api/blog/categories/[id] - Get single category
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    logger.error('Error fetching category', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PATCH /api/blog/categories/[id] - Update category (admin only)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (validationResult.data.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validationResult.data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validationResult.data,
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: unknown) {
    logger.error('Error updating category', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if ((error as { code: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/blog/categories/[id] - Delete category (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with posts',
          details: `This category has ${existingCategory._count.posts} post(s). Remove the category from all posts before deleting.`,
        },
        { status: 409 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    logger.error('Error deleting category', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
