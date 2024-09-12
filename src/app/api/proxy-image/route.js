import { getFileFromDrive } from '@/utils/googleDrive';
import sharp from 'sharp';

export default async function handler(req, res) {
  const { id, name } = req.query;

  try {
    const file = await getFileFromDrive(id);
    const response = await fetch(file.webContentLink);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 画像の最適化（例：WebP形式に変換、幅を1000pxに制限）
    const optimizedImage = await sharp(buffer)
      .webp({ quality: 80 })
      .resize({ width: 1000, withoutEnlargement: true })
      .toBuffer();

    // キャッシュヘッダーの設定
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', `inline; filename="${name}.webp"`);

    res.send(optimizedImage);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}