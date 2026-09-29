import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { UpdatePostSchema } from '@/lib/validations/blog';

// GET /api/blog/[slug] - Get single post
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await auth();
    const isAdmin = session?.user?.isAdmin;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Only show unpublished posts to admins
    if (!post.published && !isAdmin) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count (only for published posts)
    if (post.published) {
      await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PATCH /api/blog/[slug] - Update post (admin only)
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Validate request body
    const body = await request.json();
    const validationResult = UpdatePostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { categoryIds, tagIds, ...updateData } = validationResult.data;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        ...updateData,
        ...(categoryIds && {
          categories: {
            set: categoryIds.map((id: string) => ({ id })),
          },
        }),
        ...(tagIds && {
          tags: {
            set: tagIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error: unknown) {
    console.error('Error updating post:', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error) {
      if ((error as { code: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/blog/[slug] - Delete post (admin only)
export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    // Check authentication
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete post (categories and tags will be automatically disconnected)
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
