import { NextResponse } from 'next/server';
import { getFileFromDrive, deleteFileFromDrive, updateFileInDrive } from '@/utils/googleDrive';

export async function GET(request, { params }) {
  const { fileId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = process.env.COMPANY_CODE;

  try {
    const file = await getFileFromDrive(fileId, shopId, companyCode);
    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { fileId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = process.env.COMPANY_CODE;

  try {
    await deleteFileFromDrive(fileId, shopId, companyCode);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { fileId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = process.env.COMPANY_CODE;
  const body = await request.json();

  try {
    const updatedFile = await updateFileInDrive(fileId, body, shopId, companyCode);
    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}