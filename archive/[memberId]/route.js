import { NextResponse } from 'next/server';
import { getFileFromDrive } from '@/utils/googleDrive';

export async function GET(request, { params }) {
  const { memberId } = params;

  try {
    const { metadata, stream } = await getFileFromDrive(memberId);

    const encodedFilename = encodeURIComponent(metadata.name).replace(/['()]/g, escape);

    const headers = new Headers({
        'Content-Type': metadata.mimeType,
        'Content-Disposition': `inline; filename*=UTF-8''${encodedFilename}`,
      });

      return new NextResponse(stream, { headers });
    } catch (error) {
      console.error('Error retrieving file:', error);
      return NextResponse.json({ error: 'Failed to retrieve file from Google Drive' }, { status: 500 });
    }
  }