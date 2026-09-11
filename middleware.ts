import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const isAdmin = req.auth?.user?.isAdmin;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAdminAPI = req.nextUrl.pathname.startsWith('/api/admin');
  const isBlogMutation =
    req.nextUrl.pathname.startsWith('/api/blog') &&
    (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE');

  // Protect admin routes
  if ((isAdminRoute || isAdminAPI || isBlogMutation) && !isAdmin) {
    if (!req.auth) {
      // Not authenticated - redirect to sign in
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    // Authenticated but not admin - forbidden
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/blog/:path*',
  ],
};
