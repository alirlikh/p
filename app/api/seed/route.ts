import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { projects } from '@/data/static/project';
import { experiences } from '@/data/static/experience';
import { educations } from '@/data/static/education';

export async function GET() {
  try {
    // Instantiate inside the handler to ensure a fresh client and avoid singleton issues in API routes
    const prisma = new PrismaClient();

    console.log('Starting data migration via API...');

    // Clear existing data
    await prisma.experienceDuty.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.project.deleteMany();

    // Migrate projects
    for (const project of projects) {
      await prisma.project.create({
        data: {
          name: project.name,
          image: project.image,
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl,
        },
      });
    }

    // Migrate education
    for (const edu of educations) {
      await prisma.education.create({
        data: {
          degree: edu.degree,
          degreeTitle: edu.degreeTitle,
          college: edu.college,
          startTime: edu.startTime,
          graduateTime: edu.GraduateTime,
          certificate: edu.certifcate,
        },
      });
    }

    // Migrate experience
    for (const exp of experiences) {
      const createdExp = await prisma.experience.create({
        data: {
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          type: exp.type,
          startTime: exp.startTime,
          endTime: exp.endTime,
          location: exp.location,
        },
      });

      for (const duty of exp.dutyDesc) {
        await prisma.experienceDuty.create({
          data: {
            experienceId: createdExp.id,
            name: duty.name,
            duties: duty.duty,
          },
        });
      }
    }

    await prisma.$disconnect();
    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (e: any) {
    console.error('Migration error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}