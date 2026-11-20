import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET(): NextResponse {
  const primaryUrl = process.env.DOWNLOAD_WORKER_URL;
  const backupUrl = process.env.DOWNLOAD_BACKUP_URL;

  const validateUrl = (value?: string): string | null => {
    if (!value) return null;

    try {
      const url = new URL(value);

      // if (url.protocol !== 'https:') return null;

      return url.toString();
    } catch {
      return null;
    }
  };

  const primary = validateUrl(primaryUrl);
  const backup = validateUrl(backupUrl);

  if (!primary && !backup) {
    return NextResponse.json({ error: 'No valid download URLs configured' }, { status: 500 });
  }

  // Keep the existing route as the primary download.
  if (primary) {
    return NextResponse.redirect(primary, {
      status: 302,
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  }

  return NextResponse.redirect(backup!, {
    status: 302,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
