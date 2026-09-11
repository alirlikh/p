'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import Input from './Input';
import Select from './Select';

interface BlogFilterBarProps {
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
}

export default function BlogFilterBar({ categories, tags }: BlogFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');

  const updateFilters = useCallback((newQuery: string, newCategory: string, newTag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery) params.set('q', newQuery);
    else params.delete('q');

    if (newCategory) params.set('category', newCategory);
    else params.delete('category');

    if (newTag) params.set('tag', newTag);
    else params.delete('tag');

    params.set('page', '1'); // Reset page to 1
    router.push(`/blog?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
            placeholder="Search posts..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                updateFilters(e.target.value, category, tag);
            }}
        />
        <Select
            name="category"
            options={[{value: '', label: 'All Categories'}, ...categories.map(c => ({value: c.slug, label: c.name}))]}
            value={category}
            onChange={(e) => {
                setCategory(e.target.value);
                updateFilters(query, e.target.value, tag);
            }}
        />
        <Select
            name="tag"
            options={[{value: '', label: 'All Tags'}, ...tags.map(t => ({value: t.slug, label: t.name}))]}
            value={tag}
            onChange={(e) => {
                setTag(e.target.value);
                updateFilters(query, category, e.target.value);
            }}
        />
    </div>
  );
}
