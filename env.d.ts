
declare namespace NodeJS {

  interface ProcessEnv {
    // Database
    DATABASE_URL: string;
    DIRECT_URL: string;

    // NextAuth
    NEXTAUTH_URL: string;
    AUTH_SECRET: string;

    // OAuth Providers
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;

    // Admin
    ADMIN_EMAIL: string;

    // Existing variables
    NEXT_PUBLIC_DOWNLOAD_URL: string;
    HOSTNAME: string;
    PORT: string;
    HOST:string;
    NEXT_PUBLIC_HOST: string;
    NEXT_PUBLIC_HOSTNAME: string;
    NEXT_PUBLIC_API_BASE_URL: string;
  }
}
