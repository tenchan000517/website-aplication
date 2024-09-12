// C:\Next.jsWEB\src\app\api\shift\register.js
import { appendSheetValues } from '@/utils/googleSheets';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { shopId, memberId, name, shiftDate, startTime, endTime } = req.body;

    try {
      // シフト情報をGoogle Sheetsに登録
      await appendSheetValues('shiftSchedule', [
        shopId,
        memberId,
        name,
        shiftDate,
        startTime,
        endTime
      ]);

      res.status(200).json({ message: 'シフトが正常に登録されました' });
    } catch (error) {
      console.error('シフト登録エラー:', error);
      res.status(500).json({ error: 'シフトの登録に失敗しました' });
    }
  } else {
    res.status(405).json({ message: 'POSTメソッドのみ対応しています' });
  }
}
