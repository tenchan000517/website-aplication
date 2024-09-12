// src/app/api/drive/[fileId]/route.js

import { NextResponse } from 'next/server';
import { deleteFileFromDrive } from '@/utils/googleDrive';

export async function DELETE(request, { params }) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    await deleteFileFromDrive(fileId);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}