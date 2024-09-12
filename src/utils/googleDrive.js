import { google } from 'googleapis';
import { Readable } from 'stream';

// const COMPANY_CODE = process.env.COMPANY_CODE;

// if (!COMPANY_CODE) {
//   console.error('COMPANY_CODE is not set in environment variables');
//   process.exit(1);
// }

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

// export async function createCompanyFolder() {
//   const auth = await getAuthClient();
//   const drive = google.drive({ version: 'v3', auth });

//   try {
//     // COMPANY_CODE を使用してフォルダをチェック
//     const response = await drive.files.list({
//       q: `mimeType='application/vnd.google-apps.folder' and name='${COMPANY_CODE}'`,
//       fields: 'files(id, name)',
//       spaces: 'drive'
//     });

//     if (response.data.files.length > 0) {
//       console.log(`Company folder ${COMPANY_CODE} already exists`);
//       return response.data.files[0];
//     }

//     // フォルダが存在しない場合は新規作成
//     const fileMetadata = {
//       name: COMPANY_CODE,
//       mimeType: 'application/vnd.google-apps.folder'
//     };
//     const folder = await drive.files.create({
//       resource: fileMetadata,
//       fields: 'id'
//     });
//     console.log(`Company folder created with ID: ${folder.data.id}`);
//     return folder.data;
//   } catch (error) {
//     console.error('Error creating company folder:', error);
//     throw error;
//   }
// }

export async function determineUploadFolder(companyCode, shopId, folderType, memberId = null) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  const companyFolder = await findOrCreateFolder(drive, companyCode);
  const shopFolder = await findOrCreateFolder(drive, shopId, companyFolder.id);

  if (memberId) {
    const membersFolder = await findOrCreateFolder(drive, 'members', shopFolder.id);
    const memberFolder = await findOrCreateFolder(drive, memberId, membersFolder.id);
    return await findOrCreateFolder(drive, folderType, memberFolder.id);
  }

  const publicFolder = await findOrCreateFolder(drive, 'public', shopFolder.id);
  return await findOrCreateFolder(drive, folderType, publicFolder.id);
}

export async function uploadFileToDrive(file, companyCode, shopId, folderType, memberId = null) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  try {
    const targetFolder = await determineUploadFolder(companyCode, shopId, folderType, memberId);

    const fileMetadata = {
      name: file.name,
      parents: [targetFolder.id]
    };

    const media = {
      mimeType: file.type,
      body: Readable.from(Buffer.from(await file.arrayBuffer()))
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    console.log('File uploaded, ID:', response.data.id);

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    console.log('Public permission added to file:', response.data.id);

    return {
      id: response.data.id,
      webViewLink: response.data.webViewLink
    };
  } catch (error) {
    console.error('Error uploading file or setting permissions:', error);
    throw error;
  }
}

export async function getFileFromDrive(fileId) {
  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType',
    });

    const fileContent = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    return { metadata: fileMetadata.data, stream: fileContent.data };
  } catch (error) {
    console.error('Google Drive API error:', error);
    throw error;
  }
}

export async function deleteFileFromDrive(fileId) {
  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    console.log(`Attempting to delete file from Google Drive with ID: ${fileId}`);

    await drive.files.delete({
      fileId: fileId,
    });

    console.log(`File ${fileId} deleted from Google Drive`);
    return true;
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error);
    throw error;
  }
}

// export async function listDriveFiles(role, shopId, folderId = null, memberId = null) {
//   const auth = await getAuthClient();
//   const drive = google.drive({ version: 'v3', auth });

//   let query;
//   if (role === 'admin' && !shopId) {
//     const companyFolder = await findOrCreateFolder(drive, COMPANY_CODE);
//     query = `'${companyFolder.id}' in parents`;
//   } else if (folderId) {
//     query = `'${folderId}' in parents`;
//   } else {
//     const folderStructure = await createFolderStructure(shopId);
//     if (memberId) {
//       const memberFolders = await createMemberFolder(shopId, memberId);
//       query = `'${memberFolders.memberImagesFolderId}' in parents`;
//     } else {
//       query = `'${folderStructure.imagesFolderId}' in parents`; // public/images フォルダ
//     }
//   }

//   const response = await drive.files.list({
//     q: query,
//     fields: 'files(id, name, mimeType, webViewLink)',
//   });

//   return response.data.files;
// }

export async function listDriveFiles(companyCode, shopId, folderId = null, memberId = null) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  let query;
  if (!shopId && !folderId) {
    // Company root folder
    const companyFolder = await findOrCreateFolder(drive, companyCode);
    query = `'${companyFolder.id}' in parents`;
  } else if (folderId) {
    // Specific folder
    query = `'${folderId}' in parents`;
  } else {
    // Shop folder structure
    const folderStructure = await createFolderStructure(companyCode, shopId);
    if (memberId) {
      const memberFolders = await createMemberFolder(companyCode, shopId, memberId);
      query = `'${memberFolders.memberImagesFolderId}' in parents`;
    } else {
      query = `'${folderStructure.imagesFolderId}' in parents`;
    }
  }

  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, mimeType, webViewLink)',
  });

  return response.data.files;
}

export async function listFilesAndFolders(companyCode, path = '') {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  try {
    // まず、指定されたパスのフォルダIDを取得
    const folderId = await getFolderIdByPath(drive, companyCode, path);

    if (!folderId) {
      throw new Error('Folder not found');
    }

    // フォルダ内のファイルとサブフォルダを取得
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink)',
      orderBy: 'name',
    });

    const files = response.data.files;

    // ファイルとフォルダを分離
    const folders = files.filter(file => file.mimeType === 'application/vnd.google-apps.folder');
    const documents = files.filter(file => file.mimeType !== 'application/vnd.google-apps.folder');

    return { folders, documents };
  } catch (error) {
    console.error('Error in listFilesAndFolders:', error);
    throw error;
  }
}

async function getFolderIdByPath(drive, companyCode, path) {
  let currentFolderId = await getRootFolderId(drive, companyCode);

  if (!path) return currentFolderId;

  const pathParts = path.split('/');

  for (const part of pathParts) {
    const response = await drive.files.list({
      q: `'${currentFolderId}' in parents and name = '${part}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id)',
    });

    if (response.data.files.length === 0) {
      throw new Error(`Folder not found: ${part}`);
    }

    currentFolderId = response.data.files[0].id;
  }

  return currentFolderId;
}

async function getRootFolderId(drive, companyCode) {
  const response = await drive.files.list({
    q: `name = '${companyCode}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id)',
  });

  if (response.data.files.length === 0) {
    throw new Error(`Root folder not found for company code: ${companyCode}`);
  }

  return response.data.files[0].id;
}

// Helper function to create folder structure
async function createFolderStructure(companyCode, shopId) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  const companyFolder = await findOrCreateFolder(drive, companyCode);
  const shopFolder = await findOrCreateFolder(drive, shopId, companyFolder.id);
  const publicFolder = await findOrCreateFolder(drive, 'public', shopFolder.id);
  const imagesFolder = await findOrCreateFolder(drive, 'images', publicFolder.id);

  return {
    companyFolderId: companyFolder.id,
    shopFolderId: shopFolder.id,
    publicFolderId: publicFolder.id,
    imagesFolderId: imagesFolder.id
  };
}

// Helper function to create member folder
async function createMemberFolder(companyCode, shopId, memberId) {
  const folderStructure = await createFolderStructure(companyCode, shopId);
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  const membersFolder = await findOrCreateFolder(drive, 'members', folderStructure.shopFolderId);
  const memberFolder = await findOrCreateFolder(drive, memberId, membersFolder.id);
  const memberImagesFolder = await findOrCreateFolder(drive, 'images', memberFolder.id);

  return {
    memberFolderId: memberFolder.id,
    memberImagesFolderId: memberImagesFolder.id
  };
}

export async function logDriveContents() {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  async function listFolderContents(folderId, indent = '') {
    let pageToken;
    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'nextPageToken, files(id, name, mimeType)',
        spaces: 'drive',
        pageToken: pageToken
      });

      for (const file of response.data.files) {
        console.log(`${indent}${file.name} (${file.id}) - ${file.mimeType}`);
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          await listFolderContents(file.id, indent + '  ');
        }
      }

      pageToken = response.data.nextPageToken;
    } while (pageToken);
  }

  try {
    console.log("Logging Google Drive contents:");
    await listFolderContents('root');
  } catch (error) {
    console.error("Error logging Drive contents:", error);
  }
}

async function findOrCreateFolder(drive, folderName, parentId = null) {
  let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, parents)',
    spaces: 'drive'
  });

  if (response.data.files.length > 0) {
    // 親フォルダIDが指定されている場合、その親フォルダ内のフォルダを探す
    if (parentId) {
      const matchingFolder = response.data.files.find(folder => 
        folder.parents && folder.parents.includes(parentId)
      );
      if (matchingFolder) {
        return matchingFolder;
      }
    }
    
    // 親フォルダIDが指定されていない、または一致するフォルダが見つからない場合
    // 最も浅い階層のフォルダを選択
    return response.data.files.reduce((shallowest, current) => {
      return (!shallowest || (current.parents && current.parents.length < shallowest.parents.length)) 
        ? current 
        : shallowest;
    });
  } else {
    // フォルダが存在しない場合、新規作成
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };

    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, parents'
    });
    return folder.data;
  }
}

export async function deleteFileOrFolder(fileId) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  try {
    await drive.files.delete({
      fileId: fileId,
    });
    console.log(`File/Folder with ID ${fileId} has been deleted.`);
  } catch (error) {
    console.error(`Error deleting file/folder with ID ${fileId}:`, error);
    throw error;
  }
}

export async function cleanupDrive(companyCode, shopId, keepFolderIds, deleteIds) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const deletedItems = [];

  for (const id of deleteIds) {
    try {
      await drive.files.delete({ fileId: id });
      deletedItems.push({ id, status: 'deleted' });
    } catch (error) {
      console.error(`Failed to delete ${id}:`, error.message);
      deletedItems.push({ id, status: 'error', message: error.message });
    }
  }

  return deletedItems;
}

export async function setPublicPermission(fileId) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  try {
    // ファイルに公開設定を追加
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    console.log('Public permission added to file:', fileId);

    // 更新された公開リンクを取得
    const publicFile = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, webViewLink'
    });

    console.log('Updated file info:', publicFile.data);

    return {
      id: publicFile.data.id,
      name: publicFile.data.name,
      webViewLink: publicFile.data.webViewLink
    };
  } catch (error) {
    console.error('Error setting public permission:', error);
    throw error;
  }
}