import { google } from 'googleapis';
import { Readable } from 'stream';

async function getAuthClient() {
  return new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function uploadToDrive(file) {
  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalFilename,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    // ファイルを公開設定にする
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // // tenchan1341@gmail.com に編集権限を付与
    // await drive.permissions.create({
    //   fileId: response.data.id,
    //   requestBody: {
    //     role: 'writer',
    //     type: 'user',
    //     emailAddress: 'tenchan1341@gmail.com'
    //   },
    // });

    console.log('File uploaded, made public, and shared with tenchan1341@gmail.com, ID:', response.data.id);
    return `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
}