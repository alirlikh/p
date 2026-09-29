import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { UpdateEducationSchema } from '@/lib/validations/portfolio';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

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
  } catch (error) {
    logger.error('Error updating education entry:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update education entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    logger.error('Error deleting education entry:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete education entry' }, { status: 500 });
  }
}
