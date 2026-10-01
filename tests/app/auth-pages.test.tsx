import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppMocks } from './app-test-mocks';
import AuthLayout from '@/app/(routes)/(auth)/layout';
import AuthErrorPage from '@/app/(routes)/(auth)/auth/error/page';
import SignInPage from '@/app/(routes)/(auth)/auth/signin/page';
import SignInButton from '@/app/(routes)/(auth)/auth/signin/SignInButton';

vi.mock('@/lib/auth', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { auth: getAppMocks().auth };
});
vi.mock('@/lib/logger', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { logger: { error: getAppMocks().loggerError } };
});
vi.mock('next/navigation', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return {
    useRouter: () => getAppMocks().router,
    redirect: getAppMocks().redirect,
    notFound: getAppMocks().notFound,
  };
});
vi.mock('next-auth/react', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { signIn: getAppMocks().signIn };
});
vi.mock('@/components/materials/header/header', () => ({
  default: () => <div data-testid="header" />,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const appMocks = getAppMocks();

describe('authentication layout', () => {
  it('renders the shared header and child content', () => {
    render(
      <AuthLayout>
        <p>Authentication content</p>
      </AuthLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Authentication content')).toBeInTheDocument();
  });
});

describe('authentication error page', () => {
  it('shows the requested authentication error', async () => {
    render(await AuthErrorPage({ searchParams: Promise.resolve({ error: 'AccessDenied' }) }));

    expect(screen.getByRole('heading', { name: 'Access Denied' })).toBeInTheDocument();
    expect(screen.getByText(/authorized administrators/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Try Again' })).toHaveAttribute(
      'href',
      '/auth/signin'
    );
  });
});

describe('sign-in page', () => {
  it('renders sign-in and passes the requested callback URL to GitHub', async () => {
    render(
      await SignInPage({
        searchParams: Promise.resolve({ callbackUrl: '/admin/posts' }),
      })
    );

    expect(screen.getByRole('heading', { name: 'Admin Sign In' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with GitHub' }));

    await waitFor(() => {
      expect(appMocks.signIn).toHaveBeenCalledWith('github', {
        callbackUrl: '/admin/posts',
      });
    });
  });

  it.each([
    [{ isAdmin: true }, 'redirect:/admin'],
    [{ isAdmin: false }, 'redirect:/'],
  ])('redirects authenticated users according to admin status', async (user, redirect) => {
    appMocks.auth.mockResolvedValue({ user });

    await expect(
      SignInPage({ searchParams: Promise.resolve({}) })
    ).rejects.toThrow(redirect);
  });
});

describe('sign-in button', () => {
  it('starts GitHub authentication with the default callback', async () => {
    render(<SignInButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with GitHub' }));

    await waitFor(() => {
      expect(appMocks.signIn).toHaveBeenCalledWith('github', { callbackUrl: '/admin' });
    });
  });
});
