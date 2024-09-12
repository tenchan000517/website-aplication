import { NextResponse } from 'next/server';
import { getSchedule, updateSchedule } from '@/utils/googleSheets';

export async function GET() {
  try {
    const shifts = await getSchedule();
    console.log('シフトデータ取得成功:', shifts);  // 取得データをロギング
    return NextResponse.json(shifts);
  } catch (error) {
    console.error('シフト取得エラー:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('POSTリクエスト受信:', body);  // リクエストデータをロギング
    
    // 日本語から英語に修正
    const { name, date, startTime, endTime } = body;
    
    const success = await updateSchedule(name, date, startTime, endTime);
    
    if (success) {
      console.log('シフトが正常に登録されました');  // 成功時のロギング
      return NextResponse.json({ message: 'シフトが正常に登録されました' });
    } else {
      console.error('シフトの登録に失敗しました');  // 失敗時のロギング
      return NextResponse.json({ message: 'シフトの登録に失敗しました' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST /api/shifts エラー:', error);  // エラーロギング
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}
