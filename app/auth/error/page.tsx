import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'Authentication error occurred',
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errorMessages: Record<string, { title: string; message: string }> = {
    Configuration: {
      title: 'Server Configuration Error',
      message: 'There is a problem with the server configuration. Please contact the administrator.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'You do not have permission to sign in. Only authorized administrators can access this area.',
    },
    Verification: {
      title: 'Verification Failed',
      message: 'The verification token has expired or has already been used.',
    },
    OAuthSignin: {
      title: 'OAuth Sign In Error',
      message: 'Error in constructing an authorization URL.',
    },
    OAuthCallback: {
      title: 'OAuth Callback Error',
      message: 'Error in handling the response from the OAuth provider.',
    },
    OAuthCreateAccount: {
      title: 'OAuth Account Creation Error',
      message: 'Could not create OAuth provider user in the database.',
    },
    EmailCreateAccount: {
      title: 'Email Account Creation Error',
      message: 'Could not create email provider user in the database.',
    },
    Callback: {
      title: 'Callback Error',
      message: 'Error in the OAuth callback handler route.',
    },
    OAuthAccountNotLinked: {
      title: 'Account Not Linked',
      message: 'This email is already associated with another account. Please sign in with your original provider.',
    },
    SessionRequired: {
      title: 'Session Required',
      message: 'You must be signed in to access this page.',
    },
    Default: {
      title: 'Authentication Error',
      message: 'An unexpected error occurred during authentication. Please try again.',
    },
  };

  const errorInfo = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-3">{errorInfo.title}</h1>
            <p className="text-gray-300 leading-relaxed">{errorInfo.message}</p>
          </div>

          {/* Error Code */}
          {error && (
            <div className="mb-6 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Error Code: <span className="text-red-400 font-mono">{error}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-center font-medium shadow-lg hover:shadow-xl"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all text-center font-medium"
            >
              ← Back to Portfolio
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              If this problem persists, please contact the site administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
