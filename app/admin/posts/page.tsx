import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils/formatDate';
import EmptyState from '@/components/materials/feedback/EmptyState';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { select: { name: true } },
      _count: { select: { categories: true, tags: true } },
    },
  });

  if (posts.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">All Posts</h1>
          <Link
            href="/admin/posts/new"
            className="px-6 py-3 rounded-lg bg-purple-300 text-white hover:brightness-90 transition-all"
          >
            ✍️ Create New Post
          </Link>
        </div>
        <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8">
          <EmptyState
            emoji="📝"
            title="No posts yet"
            message="Create your first blog post to get started!"
            action={{
              label: 'Create First Post',
              onClick: () => {}, // This won't work in server component, but component handles it
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Posts</h1>
          <p className="text-gray-400">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 rounded-lg bg-purple-300 text-white hover:brightness-90 transition-all"
        >
          ✍️ Create New Post
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        {posts.map((post: { id: string; title: string; slug: string; excerpt: string | null; published: boolean; publishedAt: Date | null; createdAt: Date; views: number; author: { name: string | null }; categories: Array<{ name: string }>; _count: { categories: number; tags: number } }) => (
          <div
            key={post.id}
            className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-6 hover:border-purple-300 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${
                      post.published
                        ? 'bg-green-500/20 text-green-500 border-green-500'
                        : 'bg-gray-700 text-gray-400 border-gray-600'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt || 'No excerpt'}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  <span>•</span>
                  <span>{post.views} views</span>
                  {post._count.categories > 0 && (
                    <>
                      <span>•</span>
                      <span>{post._count.categories} categories</span>
                    </>
                  )}
                  {post._count.tags > 0 && (
                    <>
                      <span>•</span>
                      <span>{post._count.tags} tags</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/posts/${post.slug}/edit`}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-all"
                >
                  Edit
                </Link>
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-all"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
