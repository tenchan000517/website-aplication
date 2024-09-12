import { NextResponse } from 'next/server';
import { getShifts, createShift, updateShift, deleteShift } from '@/utils/shiftManagement';
import { updateSchedule } from '@/utils/googleSheets';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!shopId || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const shifts = await getShifts(shopId, startDate, endDate);
    return new Response(JSON.stringify(shifts), { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/shifts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('POSTリクエスト受信:', body);

    const { shopId, memberId, date, startTime, endTime } = body;

    // 新しいcreateShift関数を使用
    const shiftId = await createShift(shopId, { memberId, date, startTime, endTime });

    // 既存のupdateSchedule関数も呼び出す（互換性のため）
    await updateSchedule(shopId, memberId, date, startTime, endTime);

    if (shiftId) {
      console.log('シフトが正常に登録されました');
      return NextResponse.json({ message: 'シフトが正常に登録されました', id: shiftId });
    } else {
      console.error('シフトの登録に失敗しました');
      return NextResponse.json({ message: 'シフトの登録に失敗しました' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST /api/shifts エラー:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const shiftId = searchParams.get('shiftId');

  try {
    const body = await request.json();
    await updateShift(shopId, shiftId, body);
    return NextResponse.json({ message: 'シフトが正常に更新されました' });
  } catch (error) {
    console.error('PUT /api/shifts エラー:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const shopId = searchParams.get('shopId');
  const shiftId = searchParams.get('shiftId');

  try {
    await deleteShift(shopId, shiftId);
    return NextResponse.json({ message: 'シフトが正常に削除されました' });
  } catch (error) {
    console.error('DELETE /api/shifts エラー:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}