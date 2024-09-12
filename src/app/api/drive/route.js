import { NextResponse } from 'next/server';
import { listDriveFiles } from '@/utils/googleDrive';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const folderId = searchParams.get('folderId');
  const shopId = searchParams.get('shopId');
  const memberId = searchParams.get('memberId');
  const companyCode = process.env.COMPANY_CODE;


  console.log('GET /api/drive', { role, companyCode, shopId, folderId, memberId });

  if (!role || !companyCode) {
    console.log('Missing required parameters');
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const files = await listDriveFiles(role, companyCode, shopId, folderId, memberId);
    console.log(`Files fetched: ${files.length}`);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}