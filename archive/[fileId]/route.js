// /app/api/drive/[fileId]/route.js

import { NextResponse } from 'next/server';
import { getFileFromDrive, deleteFileFromDrive } from '@/utils/googleDrive';

export async function GET(request, { params }) {
  const { fileId } = params;

  try {
    const file = await getFileFromDrive(fileId);
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { fileId } = params;

  try {
    await deleteFileFromDrive(fileId);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}