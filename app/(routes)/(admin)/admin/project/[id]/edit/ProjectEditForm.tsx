'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';
import ConfirmDialog from '@/components/materials/modal/ConfirmDialog';

interface ProjectEditFormProps {
  project: {
    id: string;
    name: string;
    image: string;
    githubUrl: string | null;
    demoUrl: string | null;
  };
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: project.name,
    image: project.image,
    githubUrl: project.githubUrl || '',
    demoUrl: project.demoUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`/api/project/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details.fieldErrors).forEach(([key, value]) => {
            fieldErrors[key] = (value as string[])[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: data.error || 'Failed to update project' });
        }
        return;
      }

      router.push('/admin/project');
      router.refresh();
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/project/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to delete project' });
        setShowDeleteConfirm(false);
        return;
      }

      router.push('/admin/project');
      router.refresh();
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Edit Project</h1>
        <Button variant="secondary" size="small" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8 space-y-6">
        {errors.submit && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-500">
            {errors.submit}
          </div>
        )}

        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Awesome Project"
          required
          error={errors.name}
        />

        <Input
          label="Image URL"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.png"
          type="url"
          required
          error={errors.image}
        />

        <Input
          label="GitHub URL"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/user/repo"
          type="url"
          error={errors.githubUrl}
        />

        <Input
          label="Demo URL"
          name="demoUrl"
          value={formData.demoUrl}
          onChange={handleChange}
          placeholder="https://demo.example.com"
          type="url"
          error={errors.demoUrl}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" size="large" isLoading={isLoading} className="flex-1">
            💾 Save Changes
          </Button>
          <Button
            type="button"
            variant="danger"
            size="large"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
          >
            🗑️ Delete
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Project?"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
