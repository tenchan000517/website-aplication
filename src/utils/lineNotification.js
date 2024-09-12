import axios from 'axios';

export async function sendLineNotification(lineUserId, message) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: lineUserId,
      messages: [{ type: 'text', text: message }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });
    console.log(`Notification sent to ${lineUserId}: ${message}`);
  } catch (error) {
    console.error('Error sending LINE notification:', error);
    throw new Error('Failed to send LINE notification');
  }
}