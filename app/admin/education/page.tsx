import Link from 'next/link';
import { Education } from '.prisma/client';
import prisma from '@/lib/prisma';
import Button from '@/components/materials/form/Button';
import DeleteEducationClient from './DeleteEducationClient';

async function EducationList() {
  const educations = await prisma.education.findMany({
    orderBy: { startTime: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Education</h1>
        <Link href="/admin/education/new">
          <Button variant="primary" size="medium">
            ➕ Add Education
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {educations.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-700 rounded-3xl text-gray-500">
            No education entries found. Start by adding one!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-700 bg-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800/50">
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Degree / Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">College</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Period</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {educations.map((edu: Education) => (
                  <tr key={edu.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{edu.degreeTitle}</div>
                      <div className="text-sm text-gray-400">{edu.degree}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{edu.college}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {edu.startTime} - {edu.graduateTime}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/education/${edu.id}/edit`}
                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteEducationClient id={edu.id} name={edu.degreeTitle} />
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

export default EducationList;
