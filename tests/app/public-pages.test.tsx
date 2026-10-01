import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppMocks, mockFetch } from './app-test-mocks';
import EducationPage from '@/app/(routes)/(main)/education/page';
import ExperiencePage from '@/app/(routes)/(main)/experience/page';
import ProjectPage from '@/app/(routes)/(main)/project/page';
import BlogPage, {
  generateMetadata as generateBlogMetadata,
} from '@/app/(routes)/(main)/blog/page';
import BlogPostPage, {
  generateMetadata as generateBlogPostMetadata,
} from '@/app/(routes)/(main)/blog/[slug]/page';

vi.mock('@/lib/prisma', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { default: getAppMocks().prisma };
});
vi.mock('@/lib/logger', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { logger: { error: getAppMocks().loggerError } };
});
vi.mock('next/navigation', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return {
    useRouter: () => getAppMocks().router,
    redirect: getAppMocks().redirect,
    notFound: getAppMocks().notFound,
  };
});
vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/components/templates/educationPageView/EducationPage.view', () => ({
  default: () => <div data-testid="education-page-view" />,
}));
vi.mock('@/components/templates/experiencePageView/ExperiencePage.view', () => ({
  default: () => <div data-testid="experience-page-view" />,
}));
vi.mock('@/components/templates/projectPageView/ProjectPage.view', () => ({
  default: () => <div data-testid="project-page-view" />,
}));
vi.mock('@/components/templates/blogListSection/BlogListSection', () => ({
  default: () => <div data-testid="blog-list-section" />,
}));
vi.mock('@/components/materials/form/BlogFilterBar', () => ({
  default: () => <div data-testid="blog-filter-bar" />,
}));
vi.mock('@/components/materials/blogContent/BlogPostContent', () => ({
  default: () => <div data-testid="blog-post-content" />,
}));
vi.mock('@/components/materials/blogContent/ShareButton', () => ({
  default: () => <button type="button">Share</button>,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const appMocks = getAppMocks();

describe('education page', () => {
  it('renders the education page view', () => {
    render(<EducationPage />);
    expect(screen.getByTestId('education-page-view')).toBeInTheDocument();
  });
});

describe('experience page', () => {
  it('renders the experience page view', () => {
    render(<ExperiencePage />);
    expect(screen.getByTestId('experience-page-view')).toBeInTheDocument();
  });
});

describe('project page', () => {
  it('renders the lazily loaded project view', async () => {
    render(<ProjectPage />);
    expect(await screen.findByTestId('project-page-view')).toBeInTheDocument();
  });
});

describe('blog page', () => {
  it('renders the blog heading, filters, and post list', async () => {
    render(await BlogPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole('heading', { name: 'Blog' })).toBeInTheDocument();
    expect(screen.getByTestId('blog-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('blog-list-section')).toBeInTheDocument();
  });

  it('sets noindex metadata when filters are active', async () => {
    await expect(
      generateBlogMetadata({ searchParams: Promise.resolve({ q: 'react' }) })
    ).resolves.toMatchObject({ robots: { index: false, follow: true } });
  });
});

describe('blog post page', () => {
  it('renders the article details and content', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'post-1',
        slug: 'hello-world',
        title: 'Hello World',
        excerpt: 'An introduction',
        content: 'This is a blog post.',
        coverImage: null,
        published: true,
        publishedAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
        views: 4,
        author: { name: 'Author', image: null },
        categories: [{ id: 'category-1', name: 'News' }],
        tags: [{ id: 'tag-1', name: 'Next.js' }],
      }),
    });

    render(await BlogPostPage({ params: Promise.resolve({ slug: 'hello-world' }) }));

    expect(screen.getByRole('heading', { name: 'Hello World' })).toBeInTheDocument();
    expect(screen.getByTestId('blog-post-content')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('#Next.js')).toBeInTheDocument();
  });

  it('returns fallback metadata when a post is missing', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(
      generateBlogPostMetadata({ params: Promise.resolve({ slug: 'missing' }) })
    ).resolves.toMatchObject({ title: 'Post Not Found' });
  });

  it('uses the not-found route for a missing post', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: 'missing' }) })
    ).rejects.toThrow('not-found');
    expect(appMocks.notFound).toHaveBeenCalledOnce();
  });
});
