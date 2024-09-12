import { sheets } from './googleSheets';
import { deleteFileFromDrive, uploadFileToDrive, determineUploadFolder } from './googleDrive';

const MEMBERS_SHEET_NAME = process.env.GOOGLE_MEMBERS_SHEET_NAME || 'members';

async function getMemberHeaders() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `${MEMBERS_SHEET_NAME}!1:1`,
  });
  return response.data.values[0];
}

async function getLastMemberId() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `${MEMBERS_SHEET_NAME}!B:B`, // Assuming memberId is in column B
  });

  if (!response.data.values || response.data.values.length === 0) {
    return 0;
  }

  const ids = response.data.values.flat().filter(id => !isNaN(id)).map(Number);
  return Math.max(...ids, 0);
}

export async function getMembers(shopId) {
  try {
    const headers = await getMemberHeaders();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A2:ZZ`,
    });

    if (!response.data || !response.data.values) {
      console.error('No members data found');
      return [];
    }

    const members = response.data.values.map(row => {
      const member = {};
      headers.forEach((header, index) => {
        member[header] = row[index];
      });
      return member;
    });

    // console.log('Members fetched with shopId:', shopId, members);

    return shopId ? members.filter(member => member.shopId === shopId) : members;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
}

export async function getMember(shopId, memberId) {
  try {
    const members = await getMembers(shopId);
    return members.find(member => member.memberId === memberId) || null;

    // if (!member) {
    //   console.error(`Member with id ${memberId} not found`);
    //   return null;
    // }

    // console.log('Member found:', member);
    // return member;

  } catch (error) {
    console.error(`Error fetching member with id ${memberId}:`, error);
    throw error;
  }
}

export async function getMemberImages(shopId, memberId) {
  try {
    const member = await getMember(shopId, memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    return member.images ? [member.images] : [];
  } catch (error) {
    console.error(`Error fetching images for member with id ${memberId}:`, error);
    throw error;
  }
}

export async function createMember(companyCode, shopId, memberData, imageFile) {
  try {
    const headers = await getMemberHeaders();
    const lastId = await getLastMemberId();
    const memberId = lastId + 1;

    // Create folder structure and member folder
    const memberImagesFolderId = await determineUploadFolder(companyCode, shopId, 'images', memberId);

    // uploadFileToDrive 関数の引数を更新
    let imageUrl = '';
    if (imageFile) {
      const uploadResult = await uploadFileToDrive(imageFile, companyCode, shopId, 'images', memberId);
      imageUrl = uploadResult.webViewLink;
    }

    const member = {
      ...memberData, // memberData を使用
      shopId,
      memberId,
      images: imageUrl || memberData.images || '',
      imagesFolderId: memberImagesFolderId
    };
    
    const values = headers.map(header => member[header] || '');

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A:A`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    // console.log('New member created:', member);
    return member;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
}


export async function updateMember(shopId, memberId, updatedMember) {
  try {

    const headers = await getMemberHeaders();  // この行を追加

    // shopIdとmemberIdで該当の行を検索
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A:B`, // shopIdとmemberIdの列のみを取得
    });

    if (!response.data || !response.data.values) {
      throw new Error('No data found in the spreadsheet');
    }

    const rowIndex = response.data.values.findIndex(
      row => row[0] === shopId && row[1] === memberId
    );

    if (rowIndex === -1) {
      throw new Error('Member not found');
    }

    // 現在のメンバーデータを取得
    const memberResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A${rowIndex + 1}:ZZ${rowIndex + 1}`,
    });

    const currentMember = {};
    memberResponse.data.values[0].forEach((value, index) => {
      currentMember[headers[index]] = value;
    });

    // 更新データの準備
    const updatedValues = headers.map(header => {
      if (header === 'shopId') return shopId;
      if (header === 'memberId') return memberId;
      if (header === 'images') return currentMember.images || '';
      return updatedMember[header] !== undefined ? updatedMember[header] : currentMember[header] || '';
    });

    // スプレッドシートの更新
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A${rowIndex + 1}:ZZ${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [updatedValues] },
    });

    // 更新されたメンバー情報を返す
    const updatedMemberInfo = headers.reduce((acc, header, i) => {
      acc[header] = updatedValues[i];
      return acc;
    }, {});

    return updatedMemberInfo;
  } catch (error) {
    console.error(`Error updating member with shopId ${shopId} and memberId ${memberId}:`, error);
    throw error;
  }
}

export async function updateMemberProfileImage(companyCode, shopId, memberId, newImageFile) {
  try {
    const members = await getMembers(shopId);
    const index = members.findIndex(member => member.memberId === memberId);
    if (index === -1) throw new Error('Member not found');

    const currentMember = members[index];

    // 新しい画像をアップロード
    const uploadResult = await uploadFileToDrive(newImageFile, companyCode, shopId, 'images', memberId);
    const newImageUrl = uploadResult.webViewLink;

    // スプレッドシートの 'images' フィールドを更新
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${MEMBERS_SHEET_NAME}!A${index + 2}:ZZ${index + 2}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[newImageUrl]] },
    });

    return { ...currentMember, images: newImageUrl };
  } catch (error) {
    console.error(`Error updating profile image for member with id ${memberId}:`, error);
    throw error;
  }
}

export async function deleteMember(shopId, memberId) {
  try {
    const members = await getMembers(shopId);
    const index = members.findIndex(member => member.id === memberId);
    if (index === -1) throw new Error('Member not found');

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === MEMBERS_SHEET_NAME);
    if (!sheet) throw new Error(`Sheet with name ${MEMBERS_SHEET_NAME} not found`);

    const sheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: index + 1,
              endIndex: index + 2,
            },
          },
        }],
      },
    });

    // TODO: 関連するshiftsの削除処理を実装
  } catch (error) {
    console.error(`Error deleting member with id ${memberId}:`, error);
    throw error;
  }
}