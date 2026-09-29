import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { UpdateExperienceSchema } from '@/lib/validations/portfolio';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    const body = await request.json();
    const validationResult = UpdateExperienceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { duties, ...experienceData } = validationResult.data;

    await prisma.experience.update({
      where: { id },
      data: {
        ...experienceData,
      },
    });

    if (duties) {
      await prisma.experienceDuty.deleteMany({
        where: { experienceId: id },
      });

      for (const duty of duties) {
        await prisma.experienceDuty.create({
          data: {
            name: duty.name,
            experienceId: id,
            duties: {
              create: duty.duties.map((d: any) => ({ duty: d })), // eslint-disable-line @typescript-eslint/no-explicit-any
            },
          },
        });
      }
    }

    const finalExperience = await prisma.experience.findUnique({
      where: { id },
      include: {
        duties: {
          include: {
            duties: true,
          },
        },
      },
    });

    return NextResponse.json(finalExperience);
  } catch (error) {
    logger.error('Error updating experience:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    logger.error('Error deleting experience:', error);
    if (error instanceof Error && (error as unknown as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
