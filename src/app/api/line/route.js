import { validateSignature } from '@line/bot-sdk';
import { NextResponse } from 'next/server';
import { getSheetValues, appendSheetValues, findInSheet } from '@/utils/googleSheets';

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('x-line-signature');

  if (!validateSignature(body, process.env.LINE_CHANNEL_SECRET, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const events = JSON.parse(body).events;
  console.log('Received events:', events);

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      await handleMessage(event);
    }
  }

  return NextResponse.json({ message: 'OK' });
}

async function handleMessage(event) {
  const { replyToken, message, source } = event;
  const text = message.text.toLowerCase();

  switch (text) {
    case '出勤':
      await handleClockIn(replyToken, source.userId);
      break;
    case '退勤':
      await handleClockOut(replyToken, source.userId);
      break;
    case 'シフト確認':
      await handleShiftCheck(replyToken, source.userId);
      break;
    default:
      await replyMessage(replyToken, { type: 'text', text: 'コマンドが認識できませんでした。「出勤」「退勤」「シフト確認」のいずれかを送信してください。' });
  }
}

async function handleClockIn(replyToken, userId) {
  const now = new Date();
  const clockInData = [userId, now.toISOString(), now.toLocaleTimeString(), ''];
  await appendSheetValues('attendance', clockInData);
  await replyMessage(replyToken, { type: 'text', text: '出勤を記録しました。お疲れ様です！' });
}

async function handleClockOut(replyToken, userId) {
  const now = new Date();
  const todayAttendance = await findInSheet('attendance', { userId: userId, date: now.toISOString().split('T')[0] });
  
  if (todayAttendance.length === 0) {
    await replyMessage(replyToken, { type: 'text', text: '本日の出勤記録が見つかりません。' });
    return;
  }

  const lastAttendance = todayAttendance[todayAttendance.length - 1];
  if (lastAttendance.clockOut) {
    await replyMessage(replyToken, { type: 'text', text: '既に退勤済みです。' });
    return;
  }

  // 退勤時間を更新
  // Note: この部分は実際のスプレッドシートの構造に合わせて調整が必要です
  await updateSheetValues('attendance', `D${lastAttendance.rowIndex}`, [now.toLocaleTimeString()]);
  await replyMessage(replyToken, { type: 'text', text: '退勤を記録しました。お疲れ様でした！' });
}

async function handleShiftCheck(replyToken, userId) {
  const shifts = await getSheetValues('shifts', 'A2:D');
  const userShifts = shifts.filter(shift => shift[0] === userId);

  if (userShifts.length === 0) {
    await replyMessage(replyToken, { type: 'text', text: '登録されているシフトはありません。' });
    return;
  }

  const shiftMessages = userShifts.map(shift => 
    `${shift[1]}: ${shift[2]} - ${shift[3]}`
  ).join('\n');

  await replyMessage(replyToken, { type: 'text', text: `あなたのシフト:\n${shiftMessages}` });
}

async function replyMessage(replyToken, messages) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [messages],
    }),
  });

  if (!response.ok) {
    console.error('Error sending reply:', await response.text());
  }
}

export async function OPTIONS(req) {
  return NextResponse.json({}, { status: 200 });
}