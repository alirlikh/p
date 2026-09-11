import Link from 'next/link';
import prisma from '@/lib/prisma';
import Button from '@/components/materials/form/Button';
import DeleteProjectClient from './DeleteProjectClient';

async function ProjectList() {
  const projects = await prisma.project.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Projects</h1>
        <Link href="/admin/project/new">
          <Button variant="primary" size="medium">
            ➕ Add Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-700 rounded-3xl text-gray-500">
            No projects found. Start by adding one!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-700 bg-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800/50">
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Project Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400">Image</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{project.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-xs">{project.image}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/project/${project.id}/edit`}
                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteProjectClient id={project.id} name={project.name} />
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

export default ProjectList;
