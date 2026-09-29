import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminRequiredResponse, requireAdmin } from '@/lib/requireAdmin';
import { CreateEducationSchema } from '@/lib/validations/portfolio';

export async function GET() {
  try {
    const educations = await prisma.education.findMany();
    return NextResponse.json(educations);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return adminRequiredResponse();

    const body = await request.json();
    const validationResult = CreateEducationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: validationResult.data,
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    logger.error('Error creating education entry:', error);
    return NextResponse.json(
      { error: 'Failed to create education entry' },
      { status: 500 }
    );
  }
}
