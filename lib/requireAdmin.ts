import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return null;
  }

  return session;
}

export function adminRequiredResponse() {
  return NextResponse.json(
    { error: 'Unauthorized - Admin access required' },
    { status: 401 }
  );
}