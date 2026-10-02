'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';
import FileUploader from '@/components/materials/uploader/FileUploader';

export default function CreateEducationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    degree: '',
    degreeTitle: '',
    college: '',
    startTime: '',
    graduateTime: '',
    certificate: '',
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
      const response = await fetch('/api/education', {
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
          setErrors({ submit: data.error || 'Failed to create education entry' });
        }
        return;
      }

      router.push('/admin/education');
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
        <h1 className="text-4xl font-bold">Add Education</h1>
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
          label="Degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="e.g. Bachelor of Science"
          required
          error={errors.degree}
        />

        <Input
          label="Degree Title"
          name="degreeTitle"
          value={formData.degreeTitle}
          onChange={handleChange}
          placeholder="e.g. Computer Science"
          required
          error={errors.degreeTitle}
        />

        <Input
          label="College / University"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="University of Example"
          required
          error={errors.college}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            placeholder="e.g. Sep 2018"
            required
            error={errors.startTime}
          />
          <Input
            label="Graduate Time"
            name="graduateTime"
            value={formData.graduateTime}
            onChange={handleChange}
            placeholder="e.g. Jun 2022"
            required
            error={errors.graduateTime}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Certificate</label>
          <FileUploader
            folder="certificates"
            onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, certificate: url }))}
          />
          <Input
            label="Certificate URL"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            placeholder="https://example.com/cert.pdf"
            type="url"
            error={errors.certificate}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" size="large" isLoading={isLoading} className="flex-1">
            💾 Save Education
          </Button>
        </div>
      </form>
    </div>
  );
}
