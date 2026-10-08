import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/download/route';

describe('download route', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_DOWNLOAD_URL', 'https://example.com/default.pdf');
    vi.stubEnv('IR_DOWNLOAD_URL', 'https://example.com/iran.pdf');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('redirects visitors in Iran to the Iran-specific document', () => {
    const response = GET(
      new Request('https://portfolio.example/api/download', {
        headers: { 'cf-ipcountry': 'ir' },
      })
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/iran.pdf');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('redirects visitors from other countries to the default document', () => {
    const response = GET(
      new Request('https://portfolio.example/api/download', {
        headers: { 'cf-ipcountry': 'US' },
      })
    );

    expect(response.headers.get('location')).toBe('https://example.com/default.pdf');
  });

  it('returns an error when the selected document URL is not configured', async () => {
    vi.stubEnv('IR_DOWNLOAD_URL', '');

    const response = GET(
      new Request('https://portfolio.example/api/download', {
        headers: { 'cf-ipcountry': 'IR' },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Download URL is not configured correctly',
    });
  });
});
