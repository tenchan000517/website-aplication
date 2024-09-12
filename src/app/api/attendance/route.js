import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';
import { getSheetValues, appendSheetValues, updateSheetValues, findInSheet } from '@/utils/googleSheets';

// 現在時刻を "YYYY-MM-DD HH:mm:ss" 形式で取得する関数
function getCurrentDateTime() {
  return new Date().toISOString().replace('T', ' ').substr(0, 19);
}

// 勤怠データ取得（GET）
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const shopId = searchParams.get('shopId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let attendanceData = await getSheetValues('attendance', 'A2:I');
    
    // フィルタリング
    attendanceData = attendanceData.filter(row => {
      return (
        (!userId || row[0] === userId) &&
        (!shopId || row[1] === shopId) &&
        (!startDate || row[2] >= startDate) &&
        (!endDate || row[2] <= endDate)
      );
    });

    return NextResponse.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance data' }, { status: 500 });
  }
}

// 出勤記録（POST）
export async function POST(request) {
  const body = await request.json();
  const { userId, shopId, type } = body;

  if (!userId || !shopId || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const currentDateTime = getCurrentDateTime();

  try {
    if (type === 'clockIn') {
      // 出勤記録
      await appendSheetValues('attendance', [userId, shopId, currentDateTime.split(' ')[0], currentDateTime, '', '', '', '', 'active']);
      return NextResponse.json({ message: 'Clock-in recorded successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}

// 退勤・休憩記録（PUT）
export async function PUT(request) {
  const body = await request.json();
  const { userId, shopId, type } = body;

  if (!userId || !shopId || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const currentDateTime = getCurrentDateTime();

  try {
    // その日の最新の勤怠記録を検索
    const todayRecords = await findInSheet('attendance', {
      userId: userId,
      shopId: shopId,
      date: currentDateTime.split(' ')[0]
    });

    if (todayRecords.length === 0) {
      return NextResponse.json({ error: 'No active attendance record found' }, { status: 404 });
    }

    const latestRecord = todayRecords[todayRecords.length - 1];
    const rowIndex = latestRecord.rowIndex;

    switch (type) {
      case 'clockOut':
        // 退勤記録
        await updateSheetValues('attendance', `E${rowIndex}:I${rowIndex}`, [currentDateTime, '', '', '', 'completed']);
        break;
      case 'breakStart':
        // 休憩開始記録
        await updateSheetValues('attendance', `F${rowIndex}:G${rowIndex}`, [currentDateTime, '']);
        break;
      case 'breakEnd':
        // 休憩終了記録
        await updateSheetValues('attendance', `G${rowIndex}`, [currentDateTime]);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ message: `${type} recorded successfully` });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}