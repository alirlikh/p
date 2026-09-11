import { PrismaClient } from '@prisma/client';
import { projects } from '@/data/static/project';
import { experiences } from '@/data/static/experience';
import { educations } from '@/data/static/education';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration...');

  // Migrate Projects
  console.log('Migrating projects...');
  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: String(project.id) }, // Note: In static it's number, in DB it's cuid.
      // Since static IDs are numbers and DB IDs are cuids,
      // for a seed script we can just use create if we want fresh IDs,
      // or use a unique field like name for upsert.
      update: {
        name: project.name,
        image: project.image,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
      },
      create: {
        name: project.name,
        image: project.image,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
      },
    });
  }

  // Migrate Education
  console.log('Migrating education...');
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

  // Migrate Experience
  console.log('Migrating experiences...');
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

  console.log('Migration completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
