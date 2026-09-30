import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const getPublishedPosts = unstable_cache(
  () =>
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
  ['published-sitemap-posts'],
  { revalidate: 3600 },
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alireza-jalili.ir';
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/education`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/project`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const posts = await getPublishedPosts();

  return [
    ...pages,
    ...posts.map((post: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
