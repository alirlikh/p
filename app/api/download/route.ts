import { NextResponse } from 'next/server';

export function GET(request: Request): NextResponse {
  const isIran = request.headers.get('cf-ipcountry')?.toUpperCase() === 'IR';
  const downloadUrl = isIran ? process.env.IR_DOWNLOAD_URL : process.env.NEXT_PUBLIC_DOWNLOAD_URL;

  if (!downloadUrl || !URL.canParse(downloadUrl)) {
    return NextResponse.json(
      { error: 'Download URL is not configured correctly' },
      { status: 500 }
    );
  }

  const targetUrl = new URL(downloadUrl);
  if (targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:') {
    return NextResponse.json({ error: 'Download URL must use HTTP or HTTPS' }, { status: 500 });
  }

  return NextResponse.redirect(targetUrl, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
