import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateTagSchema } from '@/lib/validations/blog';

// GET /api/blog/tags/[id] - Get single tag
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/tags/[id] - Update tag (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (validationResult.data.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validationResult.data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update tag
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: validationResult.data,
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error: unknown) {
    console.error('Error updating tag:', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if ((error as { code: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/tags/[id] - Delete tag (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if tag has posts
    if (existingTag._count.posts > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete tag with posts',
          details: `This tag has ${existingTag._count.posts} post(s). Remove the tag from all posts before deleting.`,
        },
        { status: 409 }
      );
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
