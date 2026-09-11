'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Textarea from '@/components/materials/form/Textarea';
import Button from '@/components/materials/form/Button';
import ConfirmDialog from '@/components/materials/modal/ConfirmDialog';

interface EditPostFormProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    publishedAt: Date | null;
    categories: Array<{ id: string; name: string }>;
    tags: Array<{ id: string; name: string }>;
  };
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    coverImage: post.coverImage || '',
    published: post.published,
    categoryIds: post.categories.map((c) => c.id),
    tagIds: post.tags.map((t) => t.id),
  });

  // Fetch all categories and tags
  useEffect(() => {
    Promise.all([
      fetch('/api/blog/categories').then((res) => res.json()),
      fetch('/api/blog/tags').then((res) => res.json()),
    ])
      .then(([categoriesData, tagsData]) => {
        setCategories(categoriesData);
        setTags(tagsData);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        publishedAt: formData.published && !post.publishedAt ? new Date().toISOString() : undefined,
      };

      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
          setErrors({ submit: data.error || 'Failed to update post' });
        }
        return;
      }

      router.push('/admin/posts');
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
      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to delete post' });
        setShowDeleteConfirm(false);
        return;
      }

      router.push('/admin/posts');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Edit Post</h1>
        <Button variant="secondary" size="small" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8 space-y-6">
        {errors.submit && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-500">
            {errors.submit}
          </div>
        )}

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          required
          error={errors.title}
        />

        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="url-friendly-slug"
          required
          error={errors.slug}
        />

        <Textarea
          label="Excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Short description (optional)"
          rows={3}
          error={errors.excerpt}
        />

        <Textarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content in Markdown..."
          rows={15}
          required
          error={errors.content}
        />

        <Input
          label="Cover Image URL"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          type="url"
          error={errors.coverImage}
        />

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Categories</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all ${
                    formData.categoryIds.includes(category.id)
                      ? 'bg-purple-300/20 text-purple-300 border-purple-300'
                      : 'bg-gray-850 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="hidden"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Tags</label>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-blue-300/20 text-blue-300 border-blue-300'
                      : 'bg-gray-850 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="hidden"
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-700 bg-gray-850 text-purple-300 focus:ring-purple-300"
          />
          <label htmlFor="published" className="text-sm font-medium cursor-pointer">
            Published
          </label>
        </div>

        {/* Actions */}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
