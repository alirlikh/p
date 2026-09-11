import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authConfig } from '@/lib/auth.config';
import prisma from '@/lib/prisma';
import type { Session } from '@auth/core/types';
import type { JWT } from '@auth/core/jwt';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});