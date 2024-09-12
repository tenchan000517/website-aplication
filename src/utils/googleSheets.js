import { google } from 'googleapis';
import bcrypt from 'bcryptjs';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });

/**
 * シートの値を取得する
 * @param {string} sheetName シート名
 * @param {string} range 範囲（例: 'A1:D10'）
 * @returns {Promise<Array<Array<string>>>} シートの値
 */
export async function getSheetValues(sheetName, range) {
  try {
    console.log(`Fetching values for sheet: ${sheetName}, range: ${range}`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });
    
    if (!response.data || !response.data.values) {
      console.log(`No data found in ${sheetName} sheet for range ${range}`);
      return [];
    }
    
    console.log(`Data fetched successfully for ${sheetName}:`, response.data.values);
    return response.data.values;
  } catch (error) {
    console.error(`Error fetching sheet values from ${sheetName}:`, error);
    console.log(`Spreadsheet ID: ${process.env.GOOGLE_SPREADSHEET_ID}, Sheet Name: ${sheetName}`);
    throw new Error(`Failed to fetch data from sheet: ${sheetName}`);
  }
}

/**
 * シートに値を追加する
 * @param {string} sheetName シート名
 * @param {Array<string>} values 追加する値の配列
 * @returns {Promise<Object>} 更新結果
 */
export async function appendSheetValues(sheetName, values) {
  try {
    console.log(`Appending to sheet ${sheetName}:`, values); // デバッグ用ログ

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
    console.log('Append response:', response.data); // デバッグ用ログ

    return response.data.updates;
  } catch (error) {
    console.error(`Error appending values to ${sheetName}: ${error}`);
    throw new Error(`Failed to append data to sheet: ${sheetName}`);
  }
}

/**
 * シートの値を更新する
 * @param {string} sheetName シート名
 * @param {string} range 範囲（例: 'A1:D1'）
 * @param {Array<string>} values 更新する値の配列
 * @returns {Promise<void>}
 */
export async function updateSheetValues(sheetName, range, values) {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
  } catch (error) {
    console.error(`Error updating values in ${sheetName}: ${error}`);
    throw new Error(`Failed to update data in sheet: ${sheetName}`);
  }
}

/**
 * シートの行を削除する
 * @param {string} sheetName シート名
 * @param {number} rowIndex 削除する行のインデックス
 * @returns {Promise<void>}
 */
export async function deleteSheetRow(sheetName, rowIndex) {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === sheetName);
    if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);

    const sheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        }],
      },
    });
  } catch (error) {
    console.error(`Error deleting row from ${sheetName}: ${error}`);
    throw new Error(`Failed to delete row from sheet: ${sheetName}`);
  }
}

/**
 * シートの全データを取得し、オブジェクトの配列に変換する
 * @param {string} sheetName シート名
 * @returns {Promise<Array<Object>>} データオブジェクトの配列
 */
export async function getSheetData(sheetName) {
  try {
    const values = await getSheetValues(sheetName, 'A1:Z');
    const [headers, ...rows] = values;
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
  } catch (error) {
    console.error(`Error fetching sheet data from ${sheetName}: ${error}`);
    throw new Error(`Failed to fetch and process data from sheet: ${sheetName}`);
  }
}

/**
 * 指定された条件に基づいてシートからデータを検索する
 * @param {string} sheetName シート名
 * @param {Object} conditions 検索条件（例: { name: 'John', age: '30' }）
 * @returns {Promise<Array<Object>>} 条件に一致するデータオブジェクトの配列
 */
export async function findInSheet(sheetName, conditions) {
  try {
    const data = await getSheetData(sheetName);
    return data.filter(row => 
      Object.entries(conditions).every(([key, value]) => row[key] == value)
    );
  } catch (error) {
    console.error(`Error searching in sheet ${sheetName}: ${error}`);
    throw new Error(`Failed to search data in sheet: ${sheetName}`);
  }
}

/**
 * シートにデータオブジェクトを追加する
 * @param {string} sheetName シート名
 * @param {Object} data 追加するデータオブジェクト
 * @returns {Promise<Object>} 更新結果
 */
export async function addRowToSheet(sheetName, data) {
  try {
    const headers = await getSheetValues(sheetName, 'A1:1');
    if (!headers || !headers[0] || !Array.isArray(headers[0])) {
      console.error(`Invalid headers for sheet ${sheetName}:`, headers);
      throw new Error(`Failed to get headers for sheet: ${sheetName}`);
    }

    const values = headers[0].map(header => data[header] || '');
    return await appendSheetValues(sheetName, values);
  } catch (error) {
    console.error(`Error adding row to ${sheetName}:`, error);
    throw new Error(`Failed to add row to sheet: ${sheetName}`);
  }
}

/**
 * ユーザーデータを取得する
 * @returns {Promise<Array<Object>>} ユーザーデータの配列
 */
export async function getUsers() {
  try {
    return await getSheetData('users');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * 店舗データを取得する
 * @returns {Promise<Array<Object>>} 店舗データの配列
 */
export async function getShops() {
  try {
    return await getSheetData('shops');
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw new Error('Failed to fetch shops');
  }
}

/**
 * メンバー（キャスト）データを取得する
 * @returns {Promise<Array<Object>>} メンバーデータの配列
 */
export async function getMembers() {
  try {
    return await getSheetData('members');
  } catch (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }
}

/**
 * ユーザーを追加する
 * @param {Object} userData ユーザーデータ
 * @returns {Promise<Object>} 更新結果
 */
export async function addUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword
    };
    return await addRowToSheet('users', userDataWithHashedPassword);
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user');
  }
}

/**
 * 店舗を追加する
 * @param {Object} shopData 店舗データ
 * @returns {Promise<Object>} 更新結果
 */
export async function addShop(shopData) {
  try {
    return await addRowToSheet('shops', shopData);
  } catch (error) {
    console.error('Error adding shop:', error);
    throw new Error('Failed to add shop');
  }
}

/**
 * メンバー（キャスト）を追加する
 * @param {Object} memberData メンバーデータ
 * @returns {Promise<Object>} 更新結果
 */
export async function addMember(memberData) {
  try {
    return await addRowToSheet('members', memberData);
  } catch (error) {
    console.error('Error adding member:', error);
    throw new Error('Failed to add member');
  }
}

/**
 * ユーザーを認証する
 * @param {string} username ユーザー名
 * @param {string} password パスワード
 * @returns {Promise<Object|null>} 認証されたユーザーオブジェクト、または認証失敗時はnull
 * @throws {Error} 認証プロセス中にエラーが発生した場合
 */
export async function authenticateUser(username, password) {
  try {
    const users = await getSheetData('users');
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, name: user.username, role: user.role };
    }
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * シフトスケジュールを更新する
 * @param {string} clientId クライアントID
 * @param {string} name 名前
 * @param {string} date 日付
 * @param {string} startTime 開始時間
 * @param {string} endTime 終了時間
 * @returns {Promise<boolean>} 更新が成功したかどうか
 */
export async function updateSchedule(clientId, name, date, startTime, endTime) {
  try {
    const sheetName = 'schedules'; // または適切なシート名に変更してください
    const values = [clientId, name, date, startTime, endTime];
    
    // 新しい行を追加する
    await appendSheetValues(sheetName, values);
    
    console.log('Schedule updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}