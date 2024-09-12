import { NextResponse } from 'next/server';
import { getMembers, createMember } from '@/utils/memberManagement';
import { uploadFileToDrive } from '@/utils/googleDrive';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  if (!shopId) {
    return NextResponse.json({ error: 'shopId is required' }, { status: 400 });
  }

  try {
    const members = await getMembers(shopId);
    
    if (!members || members.length === 0) {
      return NextResponse.json({ message: 'No members found' }, { status: 404 });
    }

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const companyCode = process.env.COMPANY_CODE;

    console.log('API route: Received companyCode', companyCode); // デバッグ用

    // if (!shopId) {
    //   return NextResponse.json({ error: 'shopId is required' }, { status: 400 });
    // }
    
    const formData = await request.formData();

    const fields = {};
    let imageFile = null;

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value || '';
      }
      if (value instanceof Blob && key === 'images') {
        imageFile = value;
      }
    }

    if (!shopId || !companyCode ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Fields:', fields);
    console.log('Image file:', imageFile ? 'Present' : 'Not present');

    // Create member in database
    const createdMember = await createMember(companyCode, shopId, fields, imageFile);

    if (createdMember) {
      return NextResponse.json({ message: 'メンバーが正常に登録されました', member: createdMember });
    } else {
      return NextResponse.json({ message: 'メンバーの登録に失敗しました' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST /api/members エラー:', error);
    return NextResponse.json({ error: '内部サーバーエラー: ' + error.message }, { status: 500 });
  }
}