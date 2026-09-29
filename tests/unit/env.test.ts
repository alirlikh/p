import { afterEach, describe, expect, it, vi } from 'vitest';
import { getServerEnv } from '@/lib/env';

describe('getServerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the validated server configuration', () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://user:pass@localhost:5432/app');
    vi.stubEnv('DIRECT_URL', 'postgresql://user:pass@localhost:5432/app');
    vi.stubEnv('AUTH_SECRET', 'a'.repeat(32));
    vi.stubEnv('AUTH_GITHUB_ID', 'github-client');
    vi.stubEnv('AUTH_GITHUB_SECRET', 'github-secret');
    vi.stubEnv('ADMIN_EMAIL', 'admin@example.com');
    vi.stubEnv('NEXTAUTH_URL', 'https://example.com');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://example.com/api');
    vi.stubEnv('NEXT_PUBLIC_DOWNLOAD_URL', 'https://example.com/cv.pdf');

    expect(getServerEnv()).toMatchObject({
      ADMIN_EMAIL: 'admin@example.com',
      NEXTAUTH_URL: 'https://example.com',
    });
  });

  it('rejects missing required configuration', () => {
    expect(() => getServerEnv()).toThrow('Invalid server environment configuration');
  });
});
