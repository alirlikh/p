import { beforeEach, vi } from 'vitest';

const appMocks = {
  auth: vi.fn(),
  redirect: vi.fn(),
  notFound: vi.fn(),
  signIn: vi.fn(),
  loggerError: vi.fn(),
  router: {
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  },
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
    category: { findMany: vi.fn() },
    tag: { findMany: vi.fn() },
    education: { findMany: vi.fn(), findUnique: vi.fn() },
    experience: { findMany: vi.fn(), findUnique: vi.fn() },
    project: { findMany: vi.fn(), findUnique: vi.fn() },
  },
};

export const mockFetch = vi.fn();

export function getAppMocks() {
  return appMocks;
}

export function resetAppMocks() {
  vi.clearAllMocks();
  appMocks.auth.mockResolvedValue(null);
  appMocks.redirect.mockImplementation((path: string) => {
    throw new Error(`redirect:${path}`);
  });
  appMocks.notFound.mockImplementation(() => {
    throw new Error('not-found');
  });
  appMocks.signIn.mockResolvedValue(undefined);
  appMocks.prisma.post.findMany.mockResolvedValue([]);
  appMocks.prisma.post.findUnique.mockResolvedValue(null);
  appMocks.prisma.post.count.mockResolvedValue(0);
  appMocks.prisma.post.aggregate.mockResolvedValue({ _sum: { views: 0 } });
  appMocks.prisma.category.findMany.mockResolvedValue([]);
  appMocks.prisma.tag.findMany.mockResolvedValue([]);
  appMocks.prisma.education.findMany.mockResolvedValue([]);
  appMocks.prisma.education.findUnique.mockResolvedValue(null);
  appMocks.prisma.experience.findMany.mockResolvedValue([]);
  appMocks.prisma.experience.findUnique.mockResolvedValue(null);
  appMocks.prisma.project.findMany.mockResolvedValue([]);
  appMocks.prisma.project.findUnique.mockResolvedValue(null);
  mockFetch.mockResolvedValue({ ok: true, json: async () => [] });
  vi.stubGlobal('fetch', mockFetch);
}

beforeEach(resetAppMocks);
