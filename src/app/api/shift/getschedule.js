// C:\Next.jsWEB\src\app\api\shift\getSchedule.js
import { findInSheet } from '@/utils/googleSheets';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { memberId, shiftDate } = req.body;

    try {
      // Google Sheetsから該当メンバーのシフトを取得
      const schedule = await findInSheet('shiftSchedule', {
        memberId,
        shiftDate
      });

      if (schedule.length > 0) {
        res.status(200).json({ schedule });
      } else {
        res.status(404).json({ message: 'シフトが見つかりませんでした' });
      }
    } catch (error) {
      console.error('シフト取得エラー:', error);
      res.status(500).json({ error: 'シフトの取得に失敗しました' });
    }
  } else {
    res.status(405).json({ message: 'POSTメソッドのみ対応しています' });
  }
}
