import { google } from 'googleapis';
import { Readable } from 'stream';

const COMPANY_CODE = process.env.COMPANY_CODE;

async function getAuthClient() {
  return new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.resource',
    ],
  });
}

export async function uploadToDrive(file, filename, mimeType, folderId, shopId) {
  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    // ArrayBuffer を Buffer に変換
    const buffer = Buffer.from(file);

    const fileMetadata = {
      name: filename,
      parents: [folderId],
      properties: {
        shopId: shopId,
        companyCode: COMPANY_CODE,
      },
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(buffer) // Buffer から Readable ストリームを作成
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // ファイルを公開設定にする
    await drive.permissions.create({
      fileId: response.data.fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // tenchan1341@gmail.com に編集権限を付与
    await drive.permissions.create({
      fileId: response.data.fileIdid,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: 'tenchan1341@gmail.com'
      },
    });

    // ファイルを公開状態に設定
    await drive.files.update({
      fileId: response.data.fileId,
      requestBody: {
        // 'anyoneWithLink' を指定することで、リンクを知っている人なら誰でもアクセス可能になります
        copyRequiresWriterPermission: false,
        writersCanShare: true,
        viewersCanCopyContent: true,
      },
    });

    console.log('File uploaded, made public, ID:', response.data.fileId);
    
    // 画像の直接リンクを返す
    if (mimeType.startsWith('image/')) {
      return `https://drive.google.com/uc?export=view&id=${response.data.fileId}`;
    } else {
      // 画像以外の場合は webViewLink を返す
      return response.data.webViewLink;
    }

  } catch (error) {
    console.error('Google Drive upload error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
}