// Temporary type declarations until packages are installed
// This file will be ignored once you run: npm install

declare module '@prisma/client' {
  export class PrismaClient {
    post: any;
    category: any;
    tag: any;
    user: any;
    account: any;
    session: any;
    verificationToken: any;
    project: any;
    experience: any;
    experienceDuty: any;
    education: any;
    $transaction: any;
    $disconnect: any;
  }

  export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
}

declare module 'next-auth' {
  export default function NextAuth(config: any): any;
  export function auth(): Promise<any>;
  export const handlers: any;
  export const signIn: any;
  export const signOut: any;
  export type NextAuthConfig = any;
}

declare module 'next-auth/providers/github' {
  export default function GitHub(config: any): any;
}

declare module '@auth/prisma-adapter' {
  export function PrismaAdapter(prisma: any): any;
}

declare module 'zod' {
  export const z: any;
  export type infer = any;
}
