const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting migration...');
    // I'll use require for static files since this is a plain node script
    const { projects } = require('./data/static/project');
    const { experiences } = require('./data/static/experience');
    const { educations } = require('./data/static/education');

    await prisma.experienceDuty.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.project.deleteMany();

    for (const p of projects) {
      await prisma.project.create({ data: { name: p.name, image: p.image, githubUrl: p.githubUrl, demoUrl: p.demoUrl } });
    }
    for (const e of educations) {
      await prisma.education.create({ data: { degree: e.degree, degreeTitle: e.degreeTitle, college: e.college, startTime: e.startTime, graduateTime: e.GraduateTime, certificate: e.certifcate } });
    }
    for (const ex of experiences) {
      const created = await prisma.experience.create({ data: { jobTitle: ex.jobTitle, companyName: ex.companyName, type: ex.type, startTime: ex.startTime, endTime: ex.endTime, location: ex.location } });
      for (const d of ex.dutyDesc) {
        await prisma.experienceDuty.create({ data: { experienceId: created.id, name: d.name, duties: d.duty } });
      }
    }
    console.log('Success!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    prisma.$disconnect();
  }
}
main();
