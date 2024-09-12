import { NextResponse } from 'next/server';
import { getFileFromDrive } from '@/utils/googleDrive';

export async function GET(req, { params }) {
  const { fileId } = params;

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }

  try {
    const { metadata, stream } = await getFileFromDrive(fileId);

    const headers = new Headers();
    headers.set('Content-Type', metadata.mimeType);
    headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(metadata.name)}"`);

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}