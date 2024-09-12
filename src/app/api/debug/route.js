// src/app/api/debug/drive/route.js
import { logDriveContents } from '@/utils/googleDrive';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await logDriveContents();
    return NextResponse.json({ message: "Drive contents logged. Check server console." });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json({ error: "Failed to log Drive contents" }, { status: 500 });
  }
}