import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import type { JWT } from '@auth/core/jwt';
import type { Session, User } from '@auth/core/types';

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      issuer: 'https://github.com/login/oauth',
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
        token.role = user.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'USER';
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  trustHost: true,
};