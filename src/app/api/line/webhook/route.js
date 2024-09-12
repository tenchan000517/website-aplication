import { validateSignature as validateLineSignature } from '@line/bot-sdk';
import { NextResponse } from 'next/server';
import { handleLineUser, registerLineUser, recordAttendance } from '@/utils/attendanceManagement';
import crypto from 'crypto';

function calculateSignature(body, channelSecret, signature) {
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(body)
    .digest('base64');
  console.log('Calculated signature:', hash);
  return hash === signature;
}

export async function POST(req) {
  console.log('Webhook endpoint hit');

  const body = await req.text();
  console.log('Received webhook body:', body);  // ボディをログに出力

  const signature = req.headers.get('x-line-signature');
  console.log('Received signature:', signature);  // 署名をログに出力

  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  console.log('Channel Secret:', channelSecret);

  const calculatedSignature = calculateSignature(body, channelSecret);

  if (!validateLineSignature(body, process.env.LINE_CHANNEL_SECRET, signature)) {
    console.error('Invalid signature');
    console.log('Calculated:', calculatedSignature);
    console.log('Received:', signature);
    console.error('Invalid signature');

    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const events = JSON.parse(body).events;
  console.log('Received events:', events);

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const lineUserId = event.source.userId;
      const messageText = event.message.text.toLowerCase();

      try {
        const userStatus = await handleLineUser(lineUserId);

        if (!userStatus.isRegistered) {
          if (messageText.includes('登録')) {
            await replyMessage(event.replyToken, { 
              type: 'text', 
              text: '初回登録を行います。店舗IDとメンバーIDをカンマ区切りで入力してください。例: "shop001,member001"' 
            });
          } else if (messageText.includes(',')) {
            const [shopId, memberId] = messageText.split(',');
            await registerLineUser(lineUserId, shopId.trim(), memberId.trim());
            await replyMessage(event.replyToken, { 
              type: 'text', 
              text: '登録が完了しました。これで勤怠管理ができるようになりました。' 
            });
          } else {
            await replyMessage(event.replyToken, { 
              type: 'text', 
              text: '初回登録が必要です。"登録"と入力して登録プロセスを開始してください。' 
            });
          }
        } else {
          // 登録済みユーザーの処理
          let responseMessage = '';
          switch (messageText) {
            case '出勤':
            case '退勤':
            case '休憩開始':
            case '休憩終了':
            case '接客':
              const result = await recordAttendance(lineUserId, messageText === '出勤' ? 'clockIn' : 
                                                               messageText === '退勤' ? 'clockOut' : 
                                                               messageText === '休憩開始' ? 'breakStart' : 
                                                               messageText === '休憩終了' ? 'breakEnd' : 'customerCount');
              responseMessage = result.message;
              break;
            case '状況':
              const status = await checkAttendanceStatus(lineUserId);
              responseMessage = status.message;
              break;
            default:
              responseMessage = '出勤、退勤、休憩開始、休憩終了、接客、状況 のいずれかを入力してください。';
          }
          await replyMessage(event.replyToken, { type: 'text', text: responseMessage });
        }
      } catch (error) {
        console.error('Error processing message:', error);
        await replyMessage(event.replyToken, { 
          type: 'text', 
          text: '処理中にエラーが発生しました。もう一度お試しください。' 
        });
      }
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
    const errorText = await response.text();
    console.error('Error sending reply:', await response.text());
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);

  }
}

// OPTIONSメソッドのハンドラーを追加（必要に応じて）
export async function OPTIONS(req) {
  return NextResponse.json({}, { status: 200 });
}