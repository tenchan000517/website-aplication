import { NextResponse } from 'next/server';
import { getMember, updateMember, deleteMember } from '@/utils/memberManagement';
import { deleteFileFromDrive } from '@/utils/googleDrive';

export async function GET(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = searchParams.get('companyCode');

  console.log(`Fetching member: companyCode=${companyCode}, shopId=${shopId}, memberId=${memberId}`);

  try {
    const member = await getMember(shopId, memberId);
    if (member) {
      console.log('Member found:', member);
      return NextResponse.json(member);
    } else {
      console.log('Member not found');
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: `Failed to fetch member data: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  try {
    const updatedMember = await request.json();
    console.log('Received data:', updatedMember);  // デバッグ用ログ

    const result = await updateMember(shopId, memberId, updatedMember);
    return NextResponse.json({ message: 'Member updated successfully', member: result });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = searchParams.get('companyCode');

  try {
    const member = await getMember(shopId, memberId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    await deleteMember(shopId, memberId);
    
    // 関連画像の削除
    if (member.images && member.images.length > 0) {
      await Promise.all(member.images.map(imageUrl => {
        const fileId = imageUrl.split('id=')[1];
        return deleteFileFromDrive(fileId, companyCode);
      }));
    }
    return NextResponse.json({ message: 'Member and related images deleted successfully' });
  } catch (error) {
    console.error('Error deleting member and images:', error);
    return NextResponse.json({ error: 'Failed to delete member and images' }, { status: 500 });
  }
}