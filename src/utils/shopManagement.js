import { sheets, getSheetValues, appendSheetValues } from './googleSheets';
import { determineUploadFolder } from './googleDrive';

const SHOPS_SHEET_NAME = process.env.GOOGLE_SHOPS_SHEET_NAME || 'shops';
const COMPANY_CODE = process.env.COMPANY_CODE; // 環境変数から取得

async function getShopHeaders() {
  try {
    const headers = await getSheetValues(SHOPS_SHEET_NAME, '1:1');
    if (!headers || headers.length === 0 || !headers[0]) {
      console.error('No headers found in the shops sheet');
      return [];
    }
    return headers[0];
  } catch (error) {
    console.error('Error fetching shop headers:', error);
    throw error;
  }
}

export async function getShops() {
  try {
    const headers = await getShopHeaders();
    const values = await getSheetValues(SHOPS_SHEET_NAME, 'A2:ZZ');

    if (!values || values.length === 0) {
      console.log('No shop data found');
      return [];
    }

    return values.map(row => {
      const shop = {};
      headers.forEach((header, index) => {
        shop[header] = row[index] || '';
      });

      // すでに24時間形式になっていることを確認しつつ、不正な形式があれば変換
      if (shop.openingHours) shop.openingHours = convertTo24Hour(shop.openingHours);
      if (shop.closedHours) shop.closedHours = convertTo24Hour(shop.closedHours);


      return shop;
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
}

export async function getShop(shopId) {
  try {
    const shops = await getShops();
    return shops.find(shop => shop.shopId === shopId) || null;
  } catch (error) {
    console.error(`Error fetching shop with id ${shopId}:`, error);
    throw error;
  }
}

// 12時間形式を24時間形式に変換する関数
function convertTo24Hour(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
}

export async function createShop(shopData) {
  try {
    // console.log('Creating new shop with data:', shopData);
    const shopId = await generateNewShopId();
    // console.log('Generated new shop ID:', shopId);

    const folderStructure = await determineUploadFolder(shopId);
    
    const headers = await getShopHeaders();

        // 開店時間と閉店時間を24時間形式に変換
        const formattedData = {
          ...shopData,
          openingHours: convertTo24Hour(shopData.openingHours),
          closedHours: convertTo24Hour(shopData.closedHours),
        };

    const values = headers.map(header => {
      if (header === 'shopId') return shopId;
      if (header === 'driveFolderId') return folderStructure.shopFolderId;
      if (header === 'publicFolderId') return folderStructure.publicFolderId;

      return shopData[header] || '';
    });

    // console.log('Appending values to sheet:', values);
    await appendSheetValues(SHOPS_SHEET_NAME, values);
    
    const newShop = { 
      shopId, 
      ...shopData, 
      driveFolderId: folderStructure.shopFolderId,
      publicFolderId: folderStructure.publicFolderId
    };
    
    // console.log('New shop created:', newShop);
    return newShop;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
}

export async function updateShop(shopId, updatedShop) {
  try {
    const shops = await getShops();
    const index = shops.findIndex(shop => shop.shopId === shopId);
    if (index === -1) throw new Error('Shop not found');

    const headers = await getShopHeaders();

        // 開店時間と閉店時間を24時間形式に変換
        const formattedShop = {
          ...updatedShop,
          openingHours: convertTo24Hour(updatedShop.openingHours),
          closedHours: convertTo24Hour(updatedShop.closedHours),
        };

    const values = headers.map(header => 
      formattedShop[header] !== undefined ? formattedShop[header] : shops[index][header]
    );

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHOPS_SHEET_NAME}!A${index + 2}:ZZ${index + 2}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    return { shopId, ...updatedShop };
  } catch (error) {
    console.error(`Error updating shop with id ${shopId}:`, error);
    throw error;
  }
}

export async function deleteShop(shopId) {
  try {
    const shops = await getShops();
    const index = shops.findIndex(shop => shop.shopId === shopId);
    if (index === -1) throw new Error('Shop not found');

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === SHOPS_SHEET_NAME);
    if (!sheet) throw new Error(`Sheet with name ${SHOPS_SHEET_NAME} not found`);

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

    console.log(`Shop with ID ${shopId} deleted successfully`);
    // TODO: 関連するmembers, shifts, settingsの削除処理を実装
  } catch (error) {
    console.error(`Error deleting shop with id ${shopId}:`, error);
    throw error;
  }
}

async function generateNewShopId() {
  try {
    const shops = await getShops();
    // console.log('Existing shops:', shops);
    const existingIds = shops
      .map(shop => parseInt(shop.shopId))
      .filter(id => !isNaN(id));
    console.log('Existing IDs:', existingIds);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = (maxId + 1).toString();
    // console.log('New generated ID:', newId);
    return newId;
  } catch (error) {
    console.error('Error generating new shop ID:', error);
    throw error;
  }
}