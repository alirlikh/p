'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/materials/form/Input';
import Button from '@/components/materials/form/Button';
import LoadingSpinner from '@/components/materials/feedback/LoadingSpinner';
import EmptyState from '@/components/materials/feedback/EmptyState';
import ConfirmDialog from '@/components/materials/modal/ConfirmDialog';
import { slugify } from '@/lib/utils/slugify';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !editingId) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [formData.name, editingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = editingId ? `/api/blog/categories/${editingId}` : '/api/blog/categories';
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
          setErrors({ submit: data.error || 'Failed to save category' });
        }
        return;
      }

      // Reset form and refresh list
      setFormData({ name: '', slug: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
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
      const response = await fetch(`/api/blog/categories/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to delete category' });
        setDeleteId(null);
        return;
      }

      setDeleteId(null);
      fetchCategories();
    } catch (error) {
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
        <h1 className="text-4xl font-bold mb-2">Categories</h1>
        <p className="text-gray-400">Manage blog categories</p>
      </div>

      {/* Create/Edit Form */}
      <form onSubmit={handleSubmit} className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8 space-y-6">
        <h2 className="text-2xl font-bold">{editingId ? 'Edit Category' : 'Add New Category'}</h2>

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
            placeholder="e.g., Web Development"
            required
            error={errors.name}
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g., web-development"
            required
            error={errors.slug}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" size="large" isLoading={isSubmitting}>
            {editingId ? '💾 Update Category' : '➕ Add Category'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" size="large" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Categories List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8">
            <EmptyState
              emoji="📁"
              title="No categories yet"
              message="Create your first category to organize your blog posts!"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`rounded-[40px] bg-gray-800 border-2 p-6 transition-all ${
                  editingId === category.id
                    ? 'border-purple-300'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>/{category.slug}</span>
                      {category._count && (
                        <>
                          <span>•</span>
                          <span>{category._count.posts} posts</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEdit(category)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeleteId(category.id)}
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
        title="Delete Category?"
        message="Are you sure you want to delete this category? Posts using this category will not be deleted."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
