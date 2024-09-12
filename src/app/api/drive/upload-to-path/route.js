// src/app/api/drive/upload-to-path/route.js

import { NextResponse } from 'next/server';
import { uploadFileToDriveByPath } from '@/utils/googleDrive';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const path = formData.get('path');

    if (!file || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [companyCode, ...restPath] = path.split('/');

    const result = await uploadFileToDriveByPath(file, companyCode, restPath.join('/'));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}