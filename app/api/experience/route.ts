import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateExperienceSchema } from '@/lib/validations/portfolio';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        duties: true,
      },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    const body = await request.json();
    const validationResult = CreateExperienceSchema.safeParse(body);

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

    interface DutyInput {
      name: string;
      duties: string[];
    }

    const experience = await prisma.experience.create({
      data: {
        ...experienceData,
        duties: {
          create: duties.map((duty: DutyInput) => ({
            name: duty.name,
            duties: duty.duties,
          })),
        },
      },
      include: {
        duties: true,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    logger.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
