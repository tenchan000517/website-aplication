import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ companyCode: process.env.COMPANY_CODE });
}