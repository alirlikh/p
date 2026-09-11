import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UpdateEducationSchema } from '@/lib/validations/portfolio';

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
    const validationResult = UpdateEducationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const education = await prisma.education.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json(education);
  } catch (error: any) {
    logger.error('Error updating education entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Education entry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update education entry' },
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

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Education entry deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting education entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Education entry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete education entry' },
      { status: 500 }
    );
  }
}
