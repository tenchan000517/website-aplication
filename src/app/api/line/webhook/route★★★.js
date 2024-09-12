import { validateSignature } from '@line/bot-sdk';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('x-line-signature');

  // 署名を検証
  if (!validateSignature(body, process.env.LINE_CHANNEL_SECRET, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Webhookイベントを処理
  const events = JSON.parse(body).events;
  console.log('Received events:', events);

  // とりあえず全てのイベントに「受信しました」と返信
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      await replyMessage(event.replyToken, { type: 'text', text: '受信しました' });
    }
  }

  return NextResponse.json({ message: 'OK' });
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

// OPTIONSメソッドのハンドラーを追加（必要に応じて）
export async function OPTIONS(req) {
  return NextResponse.json({}, { status: 200 });
}


// https://8b4d-2402-6b00-da0d-9600-8885-7206-3119-4750.ngrok-free.app/api/line/webhook
