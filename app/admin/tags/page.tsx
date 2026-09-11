'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';
import LoadingSpinner from '@/components/materials/feedback/LoadingSpinner';
import EmptyState from '@/components/materials/feedback/EmptyState';
import ConfirmDialog from '@/components/materials/modal/ConfirmDialog';
import { slugify } from '@/lib/utils/slugify';

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  // Fetch tags
  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blog/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTags();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-generate slug from name
  // Removed useEffect as it was causing cascading render issues.
  // Slug is now generated in handleChange.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !editingId) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = editingId ? `/api/blog/tags/${editingId}` : '/api/blog/tags';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
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
          setErrors({ submit: data.error || 'Failed to save tag' });
        }
        return;
      }

      // Reset form and refresh list
      setFormData({ name: '', slug: '' });
      setEditingId(null);
      fetchTags();
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setFormData({ name: tag.name, slug: tag.slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    setErrors({});
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/tags/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to delete tag' });
        setDeleteId(null);
        return;
      }

      setDeleteId(null);
      fetchTags();
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Tags</h1>
        <p className="text-gray-400">Manage blog tags</p>
      </div>

      {/* Create/Edit Form */}
      <form onSubmit={handleSubmit} className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8 space-y-6">
        <h2 className="text-2xl font-bold">{editingId ? 'Edit Tag' : 'Add New Tag'}</h2>

        {errors.submit && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-500">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., React"
            required
            error={errors.name}
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g., react"
            required
            error={errors.slug}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" size="large" isLoading={isSubmitting}>
            {editingId ? '💾 Update Tag' : '➕ Add Tag'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" size="large" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Tags List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Tags ({tags.length})</h2>

        {tags.length === 0 ? (
          <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8">
            <EmptyState
              emoji="🏷️"
              title="No tags yet"
              message="Create your first tag to label your blog posts!"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`rounded-[40px] bg-gray-800 border-2 p-6 transition-all ${
                  editingId === tag.id
                    ? 'border-purple-300'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{tag.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>/{tag.slug}</span>
                      {tag._count && (
                        <>
                          <span>•</span>
                          <span>{tag._count.posts} posts</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEdit(tag)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeleteId(tag.id)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Tag?"
        message="Are you sure you want to delete this tag? Posts using this tag will not be deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
