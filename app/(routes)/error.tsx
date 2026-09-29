'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. An error occurred while processing your request.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-purple-300 px-6 py-3 text-white transition-all hover:brightness-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
