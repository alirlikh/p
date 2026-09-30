import { Suspense } from 'react';
import type { Metadata } from 'next';
import BlogListSection from '@/components/templates/blogListSection/BlogListSection';
import Loader from '@/components/materials/loader/Loader';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import BlogFilterBar from '@/components/materials/form/BlogFilterBar';
import { SITE_URL } from '@/lib/site';

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

async function getPosts(page: number = 1, query?: string, category?: string, tag?: string) {
  try {
    const limit = 9;
    const skip = (page - 1) * limit;

    const where: any = { published: true }; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.categories = { some: { slug: category } };
    }
    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: true, categories: true, tags: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching posts from database:', error);
    return { posts: [], pagination: { page: 1, limit: 9, totalCount: 0, totalPages: 0 } };
  }
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    tag?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;
  const canonical = page === 1 ? '/blog' : `/blog?page=${page}`;
  const hasFilters = Boolean(params.q || params.category || params.tag);
  const title = 'Blog';
  const description = 'Read about web development, programming, React, and Next.js.';

  return {
    title,
    description,
    alternates: { canonical },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      url: new URL(canonical, SITE_URL).toString(),
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const query = params.q;
  const category = params.category;
  const tag = params.tag;

  const [data, categories, tags] = await Promise.all([
    getPosts(currentPage, query, category, tag),
    prisma.category.findMany(),
    prisma.tag.findMany(),
  ]);
  const { posts, pagination } = data;

  const getPaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="p-4 px-8 md:px-28 py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog</h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Thoughts on web development, programming, and technology
        </p>
        <BlogFilterBar categories={categories} tags={tags} />
      </section>

      {/* Blog Posts */}
      <Suspense fallback={<Loader />}>
        <BlogListSection posts={posts} />
      </Suspense>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="p-4 px-8 md:px-12 py-12">
          <div className="flex justify-center items-center gap-4">
            {currentPage > 1 && (
              <Link
                href={getPaginationUrl(currentPage - 1)}
                className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-300 transition-all"
              >
                ← Previous
              </Link>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={getPaginationUrl(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    pageNum === currentPage
                      ? 'bg-purple-300 text-white'
                      : 'bg-gray-800 border border-gray-700 hover:border-purple-300'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>

            {currentPage < pagination.totalPages && (
              <Link
                href={getPaginationUrl(currentPage + 1)}
                className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-300 transition-all"
              >
                Next →
              </Link>
            )}
          </div>

          <p className="text-center text-gray-400 mt-6">
            Page {currentPage} of {pagination.totalPages} ({pagination.totalCount} posts)
          </p>
        </section>
      )}
    </div>
  );
}
