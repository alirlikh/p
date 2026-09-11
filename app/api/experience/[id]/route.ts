import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UpdateExperienceSchema } from '@/lib/validations/portfolio';

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

    const experience = await prisma.experience.update({
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
              create: duty.duties.map((d: any) => ({ duty: d })),
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
  } catch (error: any) {
    logger.error('Error updating experience:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update experience' },
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

    await prisma.experience.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting experience:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
