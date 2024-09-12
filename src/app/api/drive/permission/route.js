import { NextResponse } from 'next/server';
import { setPublicPermission } from '@/utils/googleDrive';

// APIルートまたはサーバーサイドの処理で使用する例
export async function POST(request) {
  try {
    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const updatedFileInfo = await setPublicPermission(fileId);
    
    return NextResponse.json({
      message: 'Public permission set successfully',
      file: updatedFileInfo
    });
  } catch (error) {
    console.error('Error in POST /api/set-public-permission:', error);
    return NextResponse.json({ error: 'Failed to set public permission' }, { status: 500 });
  }
}