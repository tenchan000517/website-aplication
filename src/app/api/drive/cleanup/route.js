import { NextResponse } from 'next/server';
import { cleanupDrive } from '@/utils/googleDrive';

export async function POST(request) {
  try {
    const { companyCode, shopId, keepFolderIds, deleteIds } = await request.json();

    if (!companyCode || !shopId || !keepFolderIds || !deleteIds) {
      return NextResponse.json({ error: 'Required parameters are missing' }, { status: 400 });
    }

    const result = await cleanupDrive(companyCode, shopId, keepFolderIds, deleteIds);
    return NextResponse.json({ message: 'Cleanup completed successfully', deletedItems: result });
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json({ error: 'An error occurred during cleanup' }, { status: 500 });
  }
}