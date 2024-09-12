// src/app/api/settings/route.js
import { getSettings, updateSettings } from '@/utils/settingsManagement';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  try {
    const settings = await getSettings(shopId);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  try {
    const body = await request.json();
    await updateSettings(shopId, body);
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}