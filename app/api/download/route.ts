import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET(): NextResponse {
  const downloadUrl = process.env.DOWNLOAD_WORKER_URL;

  if (!downloadUrl) {
    return NextResponse.json({ error: 'Download URL is not configured' }, { status: 500 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(downloadUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid download URL' }, { status: 500 });
  }

  if (targetUrl.protocol !== 'https:') {
    return NextResponse.json({ error: 'Download URL must use HTTPS' }, { status: 500 });
  }

  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}
