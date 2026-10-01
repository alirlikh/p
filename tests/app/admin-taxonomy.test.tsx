import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CategoriesPage from '@/app/(routes)/(admin)/admin/categories/page';
import TagsPage from '@/app/(routes)/(admin)/admin/tags/page';

vi.mock('@/lib/logger', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { logger: { error: getAppMocks().loggerError } };
});

afterEach(() => cleanup());

describe('categories page', () => {
  it('renders the category form and empty list', async () => {
    render(<CategoriesPage />);

    expect(await screen.findByRole('heading', { name: /All Categories/ })).toBeInTheDocument();
  });
});

describe('tags page', () => {
  it('renders the tag form and empty list', async () => {
    render(<TagsPage />);

    expect(await screen.findByRole('heading', { name: /All Tags/ })).toBeInTheDocument();
  });
});
