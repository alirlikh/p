import { z } from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_DOWNLOAD_URL: z.string().url(),
});

export function getServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const fields = result.error.issues
      .map((issue: { path: Array<string | number> }) => issue.path.join('.'))
      .join(', ');
    throw new Error(`Invalid server environment configuration: ${fields}`);
  }

  return result.data;
}