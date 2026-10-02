import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import ShareButton from '@/components/materials/blogContent/ShareButton';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { logger } from '@/lib/logger';

// Lazy load BlogPostContent (uses react-syntax-highlighter ~8.7MB)
const BlogPostContent = dynamic(
  () => import('@/components/materials/blogContent/BlogPostContent'),
  { loading: () => <div className="animate-pulse bg-gray-800 h-96 rounded-lg" /> }
);

// Enable ISR
export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/blog/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    logger.error('Error fetching post', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const postUrl = new URL(`/blog/${slug}`, SITE_URL).toString();
  const imageUrl = post.coverImage ? new URL(post.coverImage, SITE_URL).toString() : undefined;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const postUrl = new URL(`/blog/${post.slug}`, SITE_URL).toString();
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    url: postUrl,
    mainEntityOfPage: postUrl,
    inLanguage: 'en',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.coverImage && {
      image: new URL(post.coverImage, SITE_URL).toString(),
    }),
    author: {
      '@type': 'Person',
      name: post.author?.name || SITE_NAME,
    },
    publisher: { '@id': `${SITE_URL}/#person` },
    ...(post.categories?.length && {
      articleSection: post.categories.map((category: { name: string }) => category.name),
    }),
    ...(post.tags?.length && {
      keywords: post.tags.map((tag: { name: string }) => tag.name),
    }),
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="p-4 px-8 md:px-28 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-300 hover:brightness-90 transition-all"
        >
          ← Back to Blog
        </Link>
      </div>

      <article className="max-w-4xl mx-auto p-4 px-8 md:px-12 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData).replace(/</g, '\\u003c'),
          }}
        />
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-96 rounded-[40px] overflow-hidden mb-8 border-2 border-gray-700">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category: { id: string; name: string }) => (
              <span
                key={category.id}
                className="text-xs px-3 py-1 rounded-full bg-purple-300/20 text-purple-300 border border-purple-300"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-400 mb-6 leading-relaxed">{post.excerpt}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || 'Author'}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-400">
                {post.publishedAt && formatDate(post.publishedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{readingTime} min read</span>
            <span>•</span>
            <span>{post.views} views</span>
          </div>
        </div>

        {/* Content */}
        <BlogPostContent content={post.content} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: { id: string; name: string }) => (
                <span
                  key={tag.id}
                  className="text-sm px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share/Back */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex justify-between items-center">
          <Link
            href="/blog"
            className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-300 transition-all"
          >
            ← All Posts
          </Link>

          <ShareButton title={post.title} excerpt={post.excerpt || post.title} />
        </div>
      </article>
    </div>
  );
}
