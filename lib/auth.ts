import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authConfig } from '@/lib/auth.config';
import prisma from '@/lib/prisma';
import { getServerEnv } from '@/lib/env';
import type { Session } from '@auth/core/types';
import type { JWT } from '@auth/core/jwt';

getServerEnv();

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
        (session.user as any).isAdmin = token.isAdmin; // eslint-disable-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role; // eslint-disable-line @typescript-eslint/no-explicit-any
      }
      return session;
    },
  },
});
