import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdmin, adminRequiredResponse } from '@/lib/requireAdmin';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireAdmin();
  if (!session) return adminRequiredResponse();

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'Missing filename or file content' }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
