'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';

export default function CreateProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    githubUrl: '',
    demoUrl: '',
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
      const response = await fetch('/api/project', {
        method: 'POST',
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
          setErrors({ submit: data.error || 'Failed to create project' });
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Add Project</h1>
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
            💾 Save Project
          </Button>
        </div>
      </form>
    </div>
  );
}
