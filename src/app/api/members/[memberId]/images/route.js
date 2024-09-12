import { NextResponse } from 'next/server';
import { getMemberImages, uploadMemberImage } from '@/utils/memberManagement';
import { uploadFileToDrive, getFileFromDrive } from '@/utils/googleDrive';

export async function GET(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');

  try {
    // getMemberImagesをGoogle Driveから画像を取得するように修正
    const imageUrls = await getMemberImages(shopId, memberId);
    const images = await Promise.all(imageUrls.map(async (url) => {
      const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);
      if (!fileId) {
        console.error(`Invalid Google Drive URL: ${url}`);
        return null;
      }

      try {
        const fileData = await getFileFromDrive(fileId[0]);
        return {
          id: fileId[0],
          url: `https://drive.google.com/uc?export=view&id=${fileId[0]}`,
          name: fileData.name,
          mimeType: fileData.mimeType
        };
      } catch (error) {
        console.error(`Error fetching file data for ID ${fileId[0]}:`, error);
        return null;
      }
    }));
    
        // フィルタリングして、nullの結果を除外
        const validImages = images.filter(img => img !== null);

        return NextResponse.json(validImages);
      } catch (error) {
        console.error('Error fetching member images:', error);
        return NextResponse.json({ error: 'Failed to fetch member images' }, { status: 500 });
      }
    }

export async function POST(request, { params }) {
  const { memberId } = params;
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const companyCode = searchParams.get('companyCode');

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const buffer = await file.arrayBuffer();
    const fileName = `${memberId}_${Date.now()}_${file.name}`;
    const mimeType = file.type;
    const fileUrl = await uploadFileToDrive(buffer, fileName, mimeType, shopId, companyCode);
    await uploadMemberImage(shopId, memberId, fileUrl);
    return NextResponse.json({ message: 'Image uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error uploading member image:', error);
    return NextResponse.json({ error: 'Failed to upload member image' }, { status: 500 });
  }
}