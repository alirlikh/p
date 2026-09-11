import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { CreateExperienceSchema } from '@/lib/validations/portfolio';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        duties: true,
      },
    });
    return NextResponse.json(experiences);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

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

    const experience = await prisma.experience.create({
      data: {
        ...experienceData,
        duties: {
          create: duties.map((duty: any) => ({
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
  } catch (error: any) {
    logger.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
