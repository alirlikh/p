import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      isAdmin: boolean;
      role: Role;
    };
  }

  interface User {
    role: Role;
    isAdmin?: boolean;
  }
}
