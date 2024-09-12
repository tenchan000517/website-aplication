// src/app/api/drive/list/route.js

import { NextResponse } from 'next/server';
import { listFilesAndFolders } from '@/utils/googleDrive';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const [companyCode, ...restPath] = path.split('/');

    const result = await listFilesAndFolders(companyCode, restPath.join('/'));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing files and folders:', error);
    return NextResponse.json({ error: 'Failed to list files and folders' }, { status: 500 });
  }
}