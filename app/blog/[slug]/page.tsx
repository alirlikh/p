import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BlogPostContent from '@/components/materials/blogContent/BlogPostContent';
import ShareButton from '@/components/materials/blogContent/ShareButton';

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
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Alireza Jalili`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.coverImage ? [post.coverImage] : [],
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

  return (
    <main className="min-h-screen">
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
            {post.categories.map((category: any) => (
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
              {post.tags.map((tag: any) => (
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

          <ShareButton
            title={post.title}
            excerpt={post.excerpt || post.title}
          />
        </div>
      </article>
    </main>
  );
}
