'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Store } from 'lucide-react';

export default function NewMemberPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { shopId } = params;

  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    bust: '',
    cup: '',
    waist: '',
    hip: '',
    thumbnail: '',  // サムネイル外部リンク
    // images: '',     // プロフィール画像リンク
    xusername: '',
    comment: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataUpload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataUpload.append(key, value || '');  // 空欄もエラーにしない
    });

    selectedFiles.forEach((file, index) => {
      formDataUpload.append('images', file);
    });

    try {
      const res = await fetch(`/api/members?shopId=${shopId}`, {
        method: 'POST',
        body: formDataUpload,  // FormDataを送信
      });
      if (res.ok) {
        alert('新規メンバーが追加されました');
        router.push(`/admin/shops/${shopId}/members`);
      } else {
        throw new Error('新規メンバーの追加に失敗しました');
      }
    } catch (error) {
      console.error('Error adding new member:', error);
      alert('メンバー追加に失敗しました');
    }
  };

  if (!isClient) {
    return null; // または適切なローディング表示
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8 w-full border-b-2 border-gray-500 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">新規メンバー追加</h1>
        <Link href={`/admin/shops/${shopId}`}>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Store className="mr-2" size={20} />
            店舗管理画面に戻る
          </button>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-8">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label htmlFor={key} className="block text-sm font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              value={value || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium">Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          メンバーを追加
        </button>
      </form>

      {/* <div className="mt-6">
        <h2 className="text-2xl font-semibold">画像アップロード</h2>
        <input type="file" onChange={handleFileChange} className="mt-4" />
        <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          アップロード
        </button>
        {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
      </div> */}

      <div className="mt-6">
        <Link href={`/admin/shops/${shopId}/members`} className="text-blue-500 hover:underline">
          メンバー一覧に戻る
        </Link>
      </div>
    </div>
  );
}
