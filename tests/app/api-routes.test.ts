import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as authGet, POST as authPost } from '@/app/api/auth/[...nextauth]/route';
import * as education from '@/app/api/education/route';
import * as educationById from '@/app/api/education/[id]/route';
import * as experience from '@/app/api/experience/route';
import * as experienceById from '@/app/api/experience/[id]/route';
import * as project from '@/app/api/project/route';
import * as projectById from '@/app/api/project/[id]/route';
import * as blog from '@/app/api/blog/route';
import * as blogPost from '@/app/api/blog/[slug]/route';
import * as categories from '@/app/api/blog/categories/route';
import * as category from '@/app/api/blog/categories/[id]/route';
import * as tags from '@/app/api/blog/tags/route';
import * as tag from '@/app/api/blog/tags/[id]/route';
import { GET as technologyGet } from '@/app/api/technology/route';

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  loggerError: vi.fn(),
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    education: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    experience: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    experienceDuty: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/prisma', () => ({ default: mocks.prisma }));
vi.mock('@/lib/requireAdmin', () => ({
  requireAdmin: mocks.requireAdmin,
  adminRequiredResponse: () =>
    Response.json({ error: 'Unauthorized - Admin access required' }, { status: 401 }),
}));
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
  handlers: mocks.handlers,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: mocks.loggerError } }));

const adminRequest = (payload: unknown = {}) =>
  new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

const idParams = { params: Promise.resolve({ id: 'record-1' }) };
const postParams = { params: Promise.resolve({ slug: 'hello-world' }) };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireAdmin.mockResolvedValue(null);
  mocks.prisma.post.findMany.mockResolvedValue([]);
  mocks.prisma.post.findUnique.mockResolvedValue(null);
  mocks.prisma.post.count.mockResolvedValue(0);
  mocks.prisma.category.findMany.mockResolvedValue([]);
  mocks.prisma.category.findUnique.mockResolvedValue(null);
  mocks.prisma.tag.findMany.mockResolvedValue([]);
  mocks.prisma.tag.findUnique.mockResolvedValue(null);
  mocks.prisma.education.findMany.mockResolvedValue([]);
  mocks.prisma.experience.findMany.mockResolvedValue([]);
  mocks.prisma.project.findMany.mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('public API route handlers', () => {
  it.each([
    ['education collection', () => education.GET()],
    ['experience collection', () => experience.GET()],
    ['project collection', () => project.GET()],
    ['blog collection', () => blog.GET(new Request('http://localhost/api/blog'))],
    ['blog categories collection', () => categories.GET()],
    ['blog tags collection', () => tags.GET()],
    ['technology collection', () => technologyGet()],
  ])('responds successfully from the %s GET route', async (_name, invoke) => {
    const response = await invoke();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeDefined();
  });

  it.each([
    ['blog post detail', () => blogPost.GET(new Request('http://localhost/api/blog/hello-world'), postParams)],
    ['category detail', () => category.GET(new Request('http://localhost/api/blog/categories/record-1'), idParams)],
    ['tag detail', () => tag.GET(new Request('http://localhost/api/blog/tags/record-1'), idParams)],
  ])('returns not-found for a missing %s', async (_name, invoke) => {
    const response = await invoke();
    expect(response.status).toBe(404);
  });

  it('applies blog pagination and search filters to the query', async () => {
    await blog.GET(new Request('http://localhost/api/blog?page=2&limit=5&q=react&category=web&tag=next'));

    expect(mocks.prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          published: true,
          OR: [
            { title: { contains: 'react', mode: 'insensitive' } },
            { excerpt: { contains: 'react', mode: 'insensitive' } },
          ],
          categories: { some: { slug: 'web' } },
          tags: { some: { slug: 'next' } },
        }),
        skip: 5,
        take: 5,
      })
    );
  });
});

describe('admin-only API mutations', () => {
  const protectedHandlers: Array<[string, () => Promise<Response>]> = [
    ['education POST', () => education.POST(adminRequest())],
    ['experience POST', () => experience.POST(adminRequest())],
    ['project POST', () => project.POST(adminRequest())],
    ['blog POST', () => blog.POST(adminRequest())],
    ['category POST', () => categories.POST(adminRequest())],
    ['tag POST', () => tags.POST(adminRequest())],
    ['education PATCH', () => educationById.PATCH(adminRequest(), idParams)],
    ['education DELETE', () => educationById.DELETE(adminRequest(), idParams)],
    ['experience PATCH', () => experienceById.PATCH(adminRequest(), idParams)],
    ['experience DELETE', () => experienceById.DELETE(adminRequest(), idParams)],
    ['project PATCH', () => projectById.PATCH(adminRequest(), idParams)],
    ['project DELETE', () => projectById.DELETE(adminRequest(), idParams)],
    ['blog post PATCH', () => blogPost.PATCH(adminRequest(), postParams)],
    ['blog post DELETE', () => blogPost.DELETE(adminRequest(), postParams)],
    ['category PATCH', () => category.PATCH(adminRequest(), idParams)],
    ['category DELETE', () => category.DELETE(adminRequest(), idParams)],
    ['tag PATCH', () => tag.PATCH(adminRequest(), idParams)],
    ['tag DELETE', () => tag.DELETE(adminRequest(), idParams)],
  ];

  it.each(protectedHandlers)('rejects unauthenticated %s', async (_name, invoke) => {
    const response = await invoke();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: 'Unauthorized - Admin access required',
    });
  });

  it('rejects invalid education input before creating a record', async () => {
    mocks.requireAdmin.mockResolvedValue({ user: { id: 'admin-1', isAdmin: true } });

    const response = await education.POST(adminRequest({ degree: '' }));

    expect(response.status).toBe(400);
    expect(mocks.prisma.education.create).not.toHaveBeenCalled();
  });

  it('returns paginated blog response shape', async () => {
    const response = await blog.GET(new Request('http://localhost/api/blog?page=2&limit=4'));

    await expect(response.json()).resolves.toMatchObject({
      posts: [],
      pagination: {
        page: 2,
        limit: 4,
        totalCount: 0,
        totalPages: 0,
      },
    });
  });

  it('exports the NextAuth GET and POST handlers', () => {
    expect(authGet).toBe(mocks.handlers.GET);
    expect(authPost).toBe(mocks.handlers.POST);
  });
});
