import { getSheetValues, appendSheetValues, updateSheetValues } from './googleSheets';
import { getSettings } from './settingsManagement';
import { sendLineNotification } from './lineNotification';

// 日本時間を取得する関数
async function getCurrentJapaneseDateTime(shopId) {
    if (!shopId) {
      console.warn('No shopId provided, using default timezone');
      return new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false });
    }
  
    try {
      const settings = await getSettings(shopId);
      const timeZone = settings.timeZone || 'Asia/Tokyo';
      return new Date().toLocaleString('ja-JP', { timeZone: timeZone, hour12: false });
    } catch (error) {
      console.error('Error getting settings, using default timezone:', error);
      return new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false });
    }
  }

export async function handleLineUser(lineUserId) {
  const lineUsers = await getSheetValues('lineUsers', 'A2:C');
  const existingUser = lineUsers.find(row => row[0] === lineUserId);
  
  if (existingUser) {
    return { isRegistered: true, shopId: existingUser[1], memberId: existingUser[2] };
  } else {
    return { isRegistered: false };
  }
}

export async function registerLineUser(lineUserId, shopId, memberId) {
  await appendSheetValues('lineUsers', [lineUserId, shopId, memberId]);
  console.log('New LINE user registered:', lineUserId);
}

export async function recordAttendance(lineUserId, type) {
    const userInfo = await handleLineUser(lineUserId);
    if (!userInfo.isRegistered) {
      throw new Error('User not registered');
    }
  
    const currentDateTime = await getCurrentJapaneseDateTime(userInfo.shopId);
    const [currentDate, currentTime] = currentDateTime.split(' ');
  
    let latestRecord = await getLatestRecord(lineUserId);
  
    switch (type) {
      case 'clockIn':
        if (latestRecord && !latestRecord[6]) {
          return { status: 'already_clocked_in', message: '既に出勤済みです。' };
        }
        await createNewAttendanceRecord({ ...userInfo, lineUserId }, currentDate, currentTime);
        return { status: 'success', message: '出勤を記録しました。' };
      case 'clockOut':
        if (!latestRecord || latestRecord[6]) {
          return { status: 'not_clocked_in', message: '出勤記録がありません。先に出勤してください。' };
        }
        await updateLatestRecord(lineUserId, { clockOut: currentTime });
        return { status: 'success', message: '退勤を記録しました。' };
      case 'breakStart':
      case 'breakEnd':
      case 'customerCount':
        if (!latestRecord || latestRecord[6]) {
          return { status: 'not_clocked_in', message: '出勤記録がありません。先に出勤してください。' };
        }
        if (type === 'breakStart') {
          await updateLatestRecord(lineUserId, { breakStartTime: currentTime });
          return { status: 'success', message: '休憩開始を記録しました。' };
        } else if (type === 'breakEnd') {
          await updateLatestRecord(lineUserId, { breakEndTime: currentTime });
          return { status: 'success', message: '休憩終了を記録しました。' };
        } else {
          await incrementCustomerCount(lineUserId);
          return { status: 'success', message: '接客カウントを記録しました。' };
        }
      default:
        throw new Error('Invalid attendance type');
    }
  }

    export async function checkAttendanceStatus(lineUserId) {
        const latestRecord = await getLatestRecord(lineUserId);
        
        if (!latestRecord) {
          return { status: 'not_clocked_in', message: '出勤していません。' };
        }
        
        if (!latestRecord[6]) { // 退勤時間が空の場合
          return { status: 'clocked_in', message: '現在出勤中です。' };
        }
        
        return { status: 'clocked_out', message: '退勤済みです。' };
      }

// async function getLatestRecord(lineUserId) {
//   const attendance = await getSheetValues('attendance', 'A2:J');
//   return [...attendance].reverse().find(row => row[2] === lineUserId && !row[6]);
// }

async function getLatestRecord(lineUserId) {
    const attendance = await getSheetValues('attendance', 'A2:J');
    const latestRecord = [...attendance].reverse().find(row => row[2] === lineUserId && !row[6]);
    
    if (!latestRecord) {
      return null; // nullを返すことで見つからないことを明示
    }
  
    return latestRecord;
  }
  

async function createNewAttendanceRecord(userInfo, currentDate, currentTime) {
    const newRecord = [
      userInfo.shopId,
      userInfo.memberId,
      userInfo.lineUserId,
      '', // name
      currentDate,
      currentTime, // clockIn
      '', // clockOut
      '', // breakStartTime
      '', // breakEndTime
      0   // customerCount
    ];
    await appendSheetValues('attendance', newRecord);
    return newRecord;
  }

  async function updateLatestRecord(lineUserId, updateData) {
    const attendance = await getSheetValues('attendance', 'A2:J');
    const latestRecord = attendance.reverse().find(row => row[2] === lineUserId && !row[6]);
  
    if (latestRecord) {
      const rowIndex = attendance.length - attendance.indexOf(latestRecord) + 1; // ヘッダー行を考慮
      const updateRange = `G${rowIndex}:J${rowIndex}`;
      const currentValues = latestRecord.slice(6);
      const newValues = currentValues.map((value, index) => {
        if (index === 0 && 'clockOut' in updateData) return updateData.clockOut;
        if (index === 1 && 'breakStartTime' in updateData) return updateData.breakStartTime;
        if (index === 2 && 'breakEndTime' in updateData) return updateData.breakEndTime;
        return value;
      });
      await updateSheetValues('attendance', updateRange, newValues);
    } else {
      throw new Error('No active attendance record found');
    }
  }

  async function incrementCustomerCount(lineUserId) {
    const latestRecord = await getLatestRecord(lineUserId);
  
    if (latestRecord) {
      const attendance = await getSheetValues('attendance', 'A2:J');
      
      // 最新の出勤レコードを見つけるために、完全一致する行を探す
      const rowIndex = attendance.findIndex(row => row[2] === lineUserId && !row[6]);
      
      if (rowIndex === -1) {
        throw new Error('No active attendance record found');
      }
  
      // 最新のカウントを取得し、1 追加
      const currentCount = parseInt(attendance[rowIndex][9]) || 0;
      
      // J列（カウント）に上書き
      await updateSheetValues('attendance', `J${rowIndex + 2}`, [currentCount + 1]); // ヘッダー行考慮で+2
    } else {
      throw new Error('No active attendance record found');
    }
  }
  

export async function checkLongShifts() {
  const settings = await getSettings();
  const maxShiftHours = settings.maxShiftHours || 24;
  const currentTime = new Date(await getCurrentJapaneseDateTime());
  
  const attendance = await getSheetValues('attendance', 'A2:J');
  const activeShifts = attendance.filter(row => !row[6]); // 退勤時間が空の記録

  for (const shift of activeShifts) {
    const startTime = new Date(shift[4] + ' ' + shift[5]);
    const hoursDiff = (currentTime - startTime) / (1000 * 60 * 60);

    if (hoursDiff >= maxShiftHours) {
      await sendReminder(shift[2]); // lineUserIdを使用
    }
  }
}

async function sendReminder(lineUserId) {
  const message = '長時間の勤務が続いています。休憩を取るか、退勤をしてください。';
  await sendLineNotification(lineUserId, message);
}