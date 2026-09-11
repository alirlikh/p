import { ReactNode } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  if (!session.user.isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-purple-300 hover:brightness-90">
                ← Portfolio
              </Link>
              <span className="text-gray-400">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {session.user.name || session.user.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-all"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-850 border-r border-gray-700 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/posts"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              📝 Posts
            </Link>
            <Link
              href="/admin/categories"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              🏷️ Categories
            </Link>
            <Link
              href="/admin/tags"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              🔖 Tags
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Portfolio</span>
              <Link
                href="/admin/project"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                🚀 Projects
              </Link>
              <Link
                href="/admin/experience"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                💼 Experience
              </Link>
              <Link
                href="/admin/education"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                🎓 Education
              </Link>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <Link
                href="/blog"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-all text-gray-400 text-sm"
              >
                👁️ View Blog
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
