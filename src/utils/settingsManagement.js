import { sheets } from './googleSheets';

const SETTINGS_SHEET_NAME = process.env.GOOGLE_SETTINGS_SHEET_NAME || 'settings';
const SHOPS_SHEET_NAME = 'shops';

const DEFAULT_SETTINGS = {
  timeZone: 'Asia/Tokyo',
  maxShiftHours: '24',
  reminderInterval: '1',
  defaultShiftStartTime: '09:00',
  defaultShiftEndTime: '18:00',
  breakTimeRequired: 'true',
  breakTimeDuration: '60'
};

async function getSettingsHeaders() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `${SETTINGS_SHEET_NAME}!1:1`,
  });
  return response.data.values[0];
}

export async function getSettings(shopId) {
  if (!shopId) {
    console.warn('getSettings called without shopId');
    return DEFAULT_SETTINGS;
  }

  try {
    const headers = await getSettingsHeaders();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SETTINGS_SHEET_NAME}!A2:H`,
    });

    if (!response.data.values) {
      console.warn(`No settings found for shop ${shopId}, using default`);
      return { ...DEFAULT_SETTINGS, shopId };
    }

    const allSettings = response.data.values.map(row => {
      const setting = {};
      headers.forEach((header, index) => {
        setting[header] = row[index];
      });
      return setting;
    });

    let shopSettings = allSettings.find(setting => setting.shopId === shopId);

    if (!shopSettings) {
      console.log(`Creating default settings for shop ${shopId}`);
      shopSettings = await createDefaultSettings(shopId, headers);
    }

    return shopSettings;
  } catch (error) {
    console.error(`Error fetching settings for shop ${shopId}:`, error);
    return { ...DEFAULT_SETTINGS, shopId };
  }
}

async function createDefaultSettings(shopId, headers) {
  const defaultValues = headers.map(header => {
    if (header === 'shopId') return shopId;
    return DEFAULT_SETTINGS[header] || '';
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: `${SETTINGS_SHEET_NAME}!A:A`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [defaultValues] },
  });

  const setting = {};
  headers.forEach((header, index) => {
    setting[header] = defaultValues[index];
  });

  return setting;
}

export async function updateSettings(shopId, updatedSettings) {
  try {
    const headers = await getSettingsHeaders();
    const existingSettings = await getSettings(shopId);

    const values = headers.map(header => {
      if (header === 'shopId') return shopId;
      return updatedSettings[header] !== undefined ? updatedSettings[header] : existingSettings[header];
    });

    const range = existingSettings._rowIndex
      ? `${SETTINGS_SHEET_NAME}!A${existingSettings._rowIndex}:H${existingSettings._rowIndex}`
      : `${SETTINGS_SHEET_NAME}!A:A`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    return { ...existingSettings, ...updatedSettings };
  } catch (error) {
    console.error(`Error updating settings for shop ${shopId}:`, error);
    throw error;
  }
}

export async function createSettingsForNewShops() {
  try {
    const shopsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHOPS_SHEET_NAME}!A2:A`,
    });

    const settingsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SETTINGS_SHEET_NAME}!A2:A`,
    });

    const shopIds = shopsResponse.data.values ? shopsResponse.data.values.map(row => row[0]) : [];
    const existingSettingsShopIds = settingsResponse.data.values ? settingsResponse.data.values.map(row => row[0]) : [];

    const newShopIds = shopIds.filter(shopId => !existingSettingsShopIds.includes(shopId));

    const headers = await getSettingsHeaders();
    for (const shopId of newShopIds) {
      await createDefaultSettings(shopId, headers);
    }

    console.log(`Created default settings for ${newShopIds.length} new shops`);
  } catch (error) {
    console.error('Error creating settings for new shops:', error);
    throw error;
  }
}