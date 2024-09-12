import { NextResponse } from 'next/server';
import { updateMemberProfileImage } from '@/utils/memberManagement';

export async function POST(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = searchParams.get('companyCode');

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const result = await updateMemberProfileImage(companyCode, shopId, memberId, imageFile);
    return NextResponse.json({ message: 'Profile image updated successfully', member: result });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json({ error: 'Failed to update profile image' }, { status: 500 });
  }
}