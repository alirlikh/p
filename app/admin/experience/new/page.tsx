'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';

interface DutyForm {
  name: string;
  duties: string[];
}

export default function CreateExperienceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    type: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [duties, setDuties] = useState<DutyForm[]>([
    { name: '', duties: [''] },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDutyNameChange = (index: number, value: string) => {
    const newDuties = [...duties];
    newDuties[index].name = value;
    setDuties(newDuties);
  };

  const handleDutyItemChange = (dutyIndex: number, itemIndex: number, value: string) => {
    const newDuties = [...duties];
    const currentItems = [...newDuties[dutyIndex].duties];
    currentItems[itemIndex] = value;
    newDuties[dutyIndex].duties = currentItems;
    setDuties(newDuties);
  };

  const addDutyItem = (dutyIndex: number) => {
    const newDuties = [...duties];
    newDuties[dutyIndex].duties.push('');
    setDuties(newDuties);
  };

  const removeDutyItem = (dutyIndex: number, itemIndex: number) => {
    const newDuties = [...duties];
    newDuties[dutyIndex].duties = newDuties[dutyIndex].duties.filter((_, i) => i !== itemIndex);
    setDuties(newDuties);
  };

  const addDutyBlock = () => {
    setDuties([...duties, { name: '', duties: [''] }]);
  };

  const removeDutyBlock = (index: number) => {
    setDuties(duties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, duties }),
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
          setErrors({ submit: data.error || 'Failed to create experience' });
        }
        return;
      }

      router.push('/admin/experience');
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
        <h1 className="text-4xl font-bold">Add Experience</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="Frontend Developer"
            required
            error={errors.jobTitle}
          />
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Tech Corp"
            required
            error={errors.companyName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Full-time / Freelance"
            required
            error={errors.type}
          />
          <Input
            label="Start Time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            placeholder="e.g. Jan 2020"
            required
            error={errors.startTime}
          />
          <Input
            label="End Time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            placeholder="e.g. Present"
            required
            error={errors.endTime}
          />
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Remote / New York, NY"
          required
          error={errors.location}
        />

        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Duties & Responsibilities</h3>
            <Button type="button" variant="secondary" size="small" onClick={addDutyBlock}>
              ➕ Add Responsibility Block
            </Button>
          </div>

          {duties.map((duty, dutyIndex) => (
            <div key={dutyIndex} className="p-6 rounded-2xl bg-gray-900 border border-gray-700 space-y-4 relative">
              <Button
                type="button"
                variant="danger"
                size="small"
                className="absolute top-4 right-4"
                onClick={() => removeDutyBlock(dutyIndex)}
              >
                Remove Block
              </Button>

              <Input
                label="Responsibility Title"
                name={`duty-name-${dutyIndex}`}
                value={duty.name}
                onChange={(e) => handleDutyNameChange(dutyIndex, e.target.value)}
                placeholder="e.g. Core Development"
                required
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-400">Details</label>
                {duty.duties.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleDutyItemChange(dutyIndex, itemIndex, e.target.value)}
                      placeholder="Describe what you did..."
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      onClick={() => removeDutyItem(dutyIndex, itemIndex)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => addDutyItem(dutyIndex)}
                  className="text-xs"
                >
                  ➕ Add Detail
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" size="large" isLoading={isLoading} className="flex-1">
            💾 Save Experience
          </Button>
        </div>
      </form>
    </div>
  );
}
