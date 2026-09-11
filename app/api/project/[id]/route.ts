import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UpdateProjectSchema } from '@/lib/validations/portfolio';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(project);
  } catch (error: unknown) {
    logger.error('Error updating project:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: unknown) {
    logger.error('Error deleting project:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
