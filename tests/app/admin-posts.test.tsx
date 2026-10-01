import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppMocks } from './app-test-mocks';
import AdminDashboard from '@/app/(routes)/(admin)/admin/page';
import AdminLayout from '@/app/(routes)/(admin)/admin/layout';
import PostsPage from '@/app/(routes)/(admin)/admin/posts/page';
import NewPostPage from '@/app/(routes)/(admin)/admin/posts/new/page';
import EditPostPage from '@/app/(routes)/(admin)/admin/posts/[slug]/edit/page';
import EditPostForm from '@/app/(routes)/(admin)/admin/posts/[slug]/edit/EditPostForm';

vi.mock('@/lib/auth', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { auth: getAppMocks().auth };
});
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
vi.mock('@/components/materials/header/header', () => ({
  default: () => <div data-testid="header" />,
}));

afterEach(() => cleanup());

const appMocks = getAppMocks();

describe('admin layout', () => {
  it('redirects unauthenticated users to sign-in', async () => {
    await expect(AdminLayout({ children: <p>Admin</p> })).rejects.toThrow(
      'redirect:/api/auth/signin'
    );
  });

  it('renders navigation and children for administrators', async () => {
    appMocks.auth.mockResolvedValue({ user: { isAdmin: true, name: 'Admin User' } });

    render(await AdminLayout({ children: <p>Admin dashboard</p> }));

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Education/ })).toHaveAttribute(
      'href',
      '/admin/education'
    );
  });
});

describe('admin dashboard', () => {
  it('renders post statistics and the empty recent posts state', async () => {
    appMocks.auth.mockResolvedValue({ user: { name: 'Riley Admin' } });
    appMocks.prisma.post.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);
    appMocks.prisma.post.aggregate.mockResolvedValue({ _sum: { views: 18 } });

    render(await AdminDashboard());

    expect(screen.getByText(/Welcome back, Riley/)).toBeInTheDocument();
    expect(screen.getByText('Total Posts')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText(/No posts yet/)).toBeInTheDocument();
  });
});

describe('admin posts page', () => {
  it('renders the empty posts state with a create link', async () => {
    render(await PostsPage());

    expect(screen.getByText('No posts yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create First Post' })).toHaveAttribute(
      'href',
      '/admin/posts/new'
    );
  });
});

describe('new post form', () => {
  it('renders the create-post form', () => {
    render(<NewPostPage />);
    expect(screen.getByRole('heading', { name: /Create New Post/ })).toBeInTheDocument();
  });
});

describe('edit post form', () => {
  it('renders the current post values', () => {
    render(
      <EditPostForm
        post={{
          id: 'post-1',
          title: 'Existing article',
          slug: 'existing-article',
          excerpt: 'An excerpt',
          content: 'Content',
          coverImage: null,
          published: false,
          publishedAt: null,
          categories: [],
          tags: [],
        }}
      />
    );

    expect(screen.getByDisplayValue('Existing article')).toBeInTheDocument();
  });
});

describe('edit post page', () => {
  it('loads the post by slug and renders its editor', async () => {
    appMocks.prisma.post.findUnique.mockResolvedValue({
      id: 'post-1',
      title: 'Article',
      slug: 'article',
      excerpt: null,
      content: 'Body',
      coverImage: null,
      published: false,
      publishedAt: null,
      categories: [],
      tags: [],
    });

    expect(
      await EditPostPage({ params: Promise.resolve({ slug: 'article' }) })
    ).toBeTruthy();
  });

  it('signals not-found when the post does not exist', async () => {
    await expect(
      EditPostPage({ params: Promise.resolve({ slug: 'missing' }) })
    ).rejects.toThrow('not-found');
  });
});
