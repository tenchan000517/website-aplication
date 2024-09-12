import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json({ success: true, url: '/admin/login' });
  }

  return NextResponse.json({ success: false, url: '/' });
}

export async function GET(req) {
  return NextResponse.json({ error: "Use POST method for signout" }, { status: 405 });
}