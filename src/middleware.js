// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // 環境変数から COMPANY_CODE を取得
  const companyCode = process.env.COMPANY_CODE;

  // Next-Auth のトークンを取得
  const token = await getToken({ req: request });

  // // APIリクエストにcompanyCodeを追加
  // if (request.nextUrl.pathname.startsWith('/api/')) {
  //   const url = new URL(request.url);
  //   url.searchParams.set('companyCode', companyCode);
  //   request = new Request(url, request);
  // }

  // // 認証チェック
  // if (process.env.ENABLE_AUTH === 'true') {
  //   if (!token && request.nextUrl.pathname.startsWith('/admin/')) {
  //     return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  //   }
  // }

  // // スタッフシフトページの認証チェック
  // if (request.nextUrl && !token && request.nextUrl.pathname.startsWith('/staff/shifts')) {
  //   return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  // }

  // APIリクエストにcompanyCodeを追加
  if (request.nextUrl && request.nextUrl.pathname.startsWith('/api/')) {
    const url = new URL(request.url);
    url.searchParams.set('companyCode', companyCode);
    request = new Request(url, request);
  }

  // 認証チェック
  if (process.env.ENABLE_AUTH === 'true' && request.nextUrl) {
    if (!token && request.nextUrl.pathname.startsWith('/admin/')) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }
  }

  // スタッフシフトページの認証チェック
  if (request.nextUrl && !token && request.nextUrl.pathname.startsWith('/shifts')) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/admin/:path*',
    '/shifts/:path*',
    '/api/:path*'
  ]
};