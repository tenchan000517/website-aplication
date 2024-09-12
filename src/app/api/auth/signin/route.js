import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL('/staff/shifts', process.env.NEXT_PUBLIC_BASE_URL));
  response.cookies.set('clientId', clientId, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 }); // 30 days
  return response;
}