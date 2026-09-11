import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-purple-300 px-6 py-3 text-white transition-all hover:brightness-90"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
