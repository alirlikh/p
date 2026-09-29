import Link from 'next/link';
import prisma from '@/lib/prisma';
import Button from '@/components/materials/form/Button';
import DeleteExperienceClient from './DeleteExperienceClient';

async function ExperienceList() {
  const experiences = await prisma.experience.findMany({
    include: {
      duties: true,
    },
    orderBy: { startTime: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Experience</h1>
        <Link href="/admin/experience/new">
          <Button variant="primary" size="medium">
            ➕ Add Experience
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {experiences.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-700 rounded-3xl text-gray-500">
            No experience entries found. Start by adding one!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-700 bg-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800/50">
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Job Title / Company</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Type / Location</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Period</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {experiences.map((exp: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <tr key={exp.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{exp.jobTitle}</div>
                      <div className="text-sm text-gray-400">{exp.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <div>{exp.type}</div>
                      <div className="text-xs opacity-70">{exp.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {exp.startTime} - {exp.endTime}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/experience/${exp.id}/edit`}
                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteExperienceClient id={exp.id} name={exp.jobTitle} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExperienceList;
