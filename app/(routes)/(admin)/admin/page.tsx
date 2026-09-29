import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils/formatDate';

export default async function AdminDashboard() {
  const session = await auth();

  // Fetch stats
  const [totalPosts, publishedPosts, draftPosts, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
      },
    }),
  ]);

  const totalViews = await prisma.post.aggregate({
    _sum: { views: true },
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
        </h1>
        <p className="text-gray-400">Here&apos;s what&apos;s happening with your blog</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-6">
          <div className="text-gray-400 text-sm mb-2">Total Posts</div>
          <div className="text-4xl font-bold">{totalPosts}</div>
        </div>

        <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-6">
          <div className="text-gray-400 text-sm mb-2">Published</div>
          <div className="text-4xl font-bold text-green-500">{publishedPosts}</div>
        </div>

        <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-6">
          <div className="text-gray-400 text-sm mb-2">Drafts</div>
          <div className="text-4xl font-bold text-gray-400">{draftPosts}</div>
        </div>

        <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-6">
          <div className="text-gray-400 text-sm mb-2">Total Views</div>
          <div className="text-4xl font-bold text-purple-300">{totalViews._sum.views || 0}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 rounded-lg bg-purple-300 text-white hover:brightness-90 transition-all font-medium"
        >
          ✍️ Create New Post
        </Link>
        <Link
          href="/admin/posts"
          className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-300 transition-all"
        >
          📝 View All Posts
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="rounded-[40px] bg-gray-800 border-2 border-gray-700 p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>

        {recentPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-4">📝</p>
            <p>No posts yet. Create your first post to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map(
              (post: {
                id: string;
                title: string;
                slug: string;
                published: boolean;
                createdAt: Date;
                views: number;
                author: { name: string | null };
              }) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.slug}/edit`}
                  className="block p-4 rounded-lg bg-gray-850 border border-gray-700 hover:border-purple-300 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {post.author.name}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
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
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
