// app/api/auth/error/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL('/error', req.url);
  url.searchParams.set('error', 'auth_error'); // Puedes añadir parámetros si lo deseas
  return NextResponse.redirect(url);
}

export async function POST(req: NextRequest) {
  const url = new URL('/error', req.url);
  url.searchParams.set('error', 'auth_error');
  return NextResponse.redirect(url);
}
