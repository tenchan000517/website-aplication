import { sheets } from './googleSheets';

const SHIFTS_SHEET_NAME = process.env.GOOGLE_SHIFTS_SHEET_NAME || 'shifts';

async function getShiftHeaders() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHIFTS_SHEET_NAME}!1:1`,
    });
    
    if (!response.data.values || !response.data.values[0]) {
      console.error('No headers found in the sheet');
      return [];
    }
    
    return response.data.values[0];
  } catch (error) {
    console.error('Error fetching shift headers:', error);
    return [];
  }
}

export async function getShifts(shopId, startDate, endDate) {
  try {
    const headers = await getShiftHeaders();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHIFTS_SHEET_NAME}!A2:ZZ`,
    });

    // Check if response.data.values exists and is an array
    if (!response.data.values || !Array.isArray(response.data.values)) {
      console.log('No data found in the sheet or invalid response');
      return [];
    }

    const shifts = response.data.values.map(row => {
      const shift = {};
      headers.forEach((header, index) => {
        shift[header] = row[index] || ''; // Use empty string if value is undefined
      });
      return shift;
    });

    return shifts.filter(shift => 
      shift.shopId === shopId &&
      new Date(shift.date) >= new Date(startDate) &&
      new Date(shift.date) <= new Date(endDate)
    );
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return []; // Return an empty array instead of throwing an error
  }
}

export async function createShift(shopId, shift) {
  try {
    const headers = await getShiftHeaders();
    const values = headers.map(header => {
      if (header === 'shopId') return shopId;
      return shift[header] || '';
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHIFTS_SHEET_NAME}!A:A`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    return response.data.updates.updatedRange.split('!')[1].split(':')[0].replace(/\D/g, '');
  } catch (error) {
    console.error('Error creating shift:', error);
    throw error;
  }
}

export async function updateShift(shopId, shiftId, updatedShift) {
  try {
    const shifts = await getShifts(shopId, new Date(0), new Date('9999-12-31'));
    const index = shifts.findIndex(shift => shift.id === shiftId);
    if (index === -1) throw new Error('Shift not found');

    const headers = await getShiftHeaders();
    const values = headers.map(header => {
      if (header === 'shopId') return shopId;
      return updatedShift[header] !== undefined ? updatedShift[header] : shifts[index][header];
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHIFTS_SHEET_NAME}!A${index + 2}:ZZ${index + 2}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
  } catch (error) {
    console.error(`Error updating shift with id ${shiftId}:`, error);
    throw error;
  }
}

export async function deleteShift(shopId, shiftId) {
  try {
    const shifts = await getShifts(shopId, new Date(0), new Date('9999-12-31'));
    const index = shifts.findIndex(shift => shift.id === shiftId);
    if (index === -1) throw new Error('Shift not found');

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === SHIFTS_SHEET_NAME);
    if (!sheet) throw new Error(`Sheet with name ${SHIFTS_SHEET_NAME} not found`);

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
  } catch (error) {
    console.error(`Error deleting shift with id ${shiftId}:`, error);
    throw error;
  }
}