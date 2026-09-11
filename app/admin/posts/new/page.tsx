'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/materials/form/Input';
import Textarea from '@/components/materials/form/Textarea';
import Button from '@/components/materials/form/Button';
import { slugify } from '@/lib/utils/slugify';

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false,
    categoryIds: [] as string[],
    tagIds: [] as string[],
  });

  // Fetch categories and tags
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

  // Auto-generate slug from title
  // Removed useEffect as it was causing cascading render issues.
  // Slug is now generated in handleChange.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === 'title' && !updated.slug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    // Clear error when user types
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
        publishedAt: formData.published ? new Date().toISOString() : undefined,
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Zod validation errors
          const fieldErrors: Record<string, string> = {};
          Object.entries(data.details.fieldErrors).forEach(([key, value]) => {
            fieldErrors[key] = (value as string[])[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: data.error || 'Failed to create post' });
        }
        return;
      }

      // Success - redirect to posts list
      router.push('/admin/posts');
      router.refresh();
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Create New Post</h1>
        <Button
          variant="secondary"
          size="small"
          onClick={() => router.back()}
        >
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

        {/* Title */}
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          required
          error={errors.title}
        />

        {/* Slug */}
        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="url-friendly-slug"
          required
          error={errors.slug}
        />

        {/* Excerpt */}
        <Textarea
          label="Excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Short description (optional, max 500 characters)"
          rows={3}
          error={errors.excerpt}
        />

        {/* Content */}
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

        {/* Cover Image */}
        <Input
          label="Cover Image URL"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg (optional)"
          type="url"
          error={errors.coverImage}
        />

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Categories
            </label>
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

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Tags
            </label>
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

        {/* Published Toggle */}
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
            Publish immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="large"
            isLoading={isLoading}
            className="flex-1"
          >
            {formData.published ? '🚀 Publish Post' : '💾 Save as Draft'}
          </Button>
        </div>
      </form>
    </div>
  );
}
