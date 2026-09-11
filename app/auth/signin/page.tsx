import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import SignInButton from './SignInButton';

export const metadata: Metadata = {
  title: 'Sign In - Admin',
  description: 'Sign in to access the admin panel',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  // Check if user is already authenticated
  const session = await auth();
  if (session?.user) {
    // If admin, redirect to admin panel
    if (session.user.isAdmin) {
      redirect('/admin');
    }
    // If not admin, redirect to home
    redirect('/');
  }

  const { error, callbackUrl } = await searchParams;

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: 'This email is already associated with another account.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Configuration: 'Server configuration error. Please contact support.',
    Default: 'An error occurred during sign in. Please try again.',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Sign In</h1>
            <p className="text-gray-400">Sign in to access the admin panel</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Sign In Button */}
          <SignInButton callbackUrl={callbackUrl} />

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Only authorized administrators can access the admin panel.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
