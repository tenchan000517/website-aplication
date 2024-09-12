// src/app/api/analysis/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';
import { getReservationData, getPopularCasts } from '@/utils/googleSheets';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'shop_manager'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reservationData = await getReservationData();
    const popularCasts = await getPopularCasts();
    
    return NextResponse.json({
      reservationData,
      popularCasts
    });
  } catch (error) {
    console.error('Failed to fetch analysis data:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis data' }, { status: 500 });
  }
}