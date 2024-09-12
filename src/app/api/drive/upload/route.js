// src/app/api/drive/upload/route.js

import { NextResponse } from 'next/server';
import { uploadFileToDrive } from '@/utils/googleDrive';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const shopId = formData.get('shopId');
    const folderType = formData.get('folderType');
    const memberId = formData.get('memberId');
    const companyCode = process.env.COMPANY_CODE;

    if (!file || !shopId || !companyCode || !folderType) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await uploadFileToDrive(file, companyCode, shopId, folderType, memberId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}