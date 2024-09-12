'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from 'lucide-react';

export default function EditMemberPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { shopId, memberId } = params;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    bust: '',
    cup: '',
    waist: '',
    hip: '',
    thumbnail: '',
    xusername: '',
    comment: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    fetchMemberData();
    fetchMemberImages();
  }, [shopId, memberId]);

  const fetchMemberData = async () => {
    try {
      const res = await fetch(`/api/members/${memberId}?shopId=${shopId}`);
      if (!res.ok) throw new Error('Failed to fetch member data');
      const data = await res.json();
      setFormData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching member data:', error);
      setError('Failed to load member data');
      setIsLoading(false);
    }
  };

  const fetchMemberImages = async () => {
    try {
      const res = await fetch(`/api/members/${memberId}/images?shopId=${shopId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setExistingImages([]);
          setImageError("メンバーの画像が見つかりません。");
        } else {
          throw new Error('Failed to fetch member images');
        }
      } else {
        const data = await res.json();
        // プロフィール画像とその他の画像を区別
        const processedImages = data.map(img => ({
          ...img,
          isProfileImage: img.url === formData.thumbnail
        }));
        setExistingImages(processedImages);
        setImageError(null);
      }
    } catch (error) {
      console.error('Error fetching member images:', error);
      setImageError("画像の取得に失敗しました。");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const memberData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'images') {
        memberData[key] = value;
      }
    });
  
    console.log('Submitting data:', memberData);  // デバッグ用ログ
  
    try {
      const res = await fetch(`/api/members/${memberId}?shopId=${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText);
        throw new Error(errorText || 'Failed to update member');
      }
  
      const data = await res.json();
      alert('メンバー情報が更新されました');
      router.push(`/admin/shops/${shopId}/members`);
    } catch (error) {
      console.error('Error updating member:', error);
      setError('メンバー情報の更新に失敗しました: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このメンバーを削除してもよろしいですか？')) {
      try {
        const res = await fetch(`/api/members/${memberId}?shopId=${shopId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete member');

        alert('メンバーが削除されました');
        router.push(`/admin/shops/${shopId}/members`);
      } catch (error) {
        console.error('Error deleting member:', error);
        setError('メンバーの削除に失敗しました');
      }
    }
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return;
  
    const imageFormData = new FormData();
    imageFormData.append('image', imageFile);
  
    try {
      const res = await fetch(`/api/members/${memberId}/image?shopId=${shopId}`, {
        method: 'POST',
        body: imageFormData,
      });
  
      if (!res.ok) {
        throw new Error('Failed to upload image');
      }
  
      const data = await res.json();
      console.log('Image uploaded:', data);
      // 必要に応じて、アップロードされた画像の URL を状態に設定するなどの処理を行う
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('画像のアップロードに失敗しました: ' + error.message);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const res = await fetch(`/api/members/${memberId}/images/${imageId}?shopId=${shopId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image');

      setExistingImages(existingImages.filter(img => img.id !== imageId));
      alert('画像が削除されました');
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('画像の削除に失敗しました');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8 w-full border-b-2 border-gray-500 pb-2">

      <h1 className="text-3xl font-bold text-gray-800">メンバー情報編集</h1>

      <Link href={`/admin/shops/${shopId}`}>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Store className="mr-2" size={20} />
            店舗管理画面に戻る
          </button>
        </Link>
        </div>

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
          <label htmlFor="images" className="block text-sm font-medium">新しい画像を追加</label>
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

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          更新
        </button>
      </form>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">既存の画像</h2>
        {imageError ? (
          <p className="text-yellow-600">{imageError}</p>
        ) : existingImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <Image 
                  src={image.url || '/default-image.png'} // フォールバック画像を追加
                  alt={image.isProfileImage ? "プロフィール画像" : "メンバー画像"} 
                  width={200} 
                  height={200} 
                  className="w-full h-32 object-cover"
                />
                {image.isProfileImage && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white p-1 text-xs">
                    プロフィール画像
                  </div>
                )}
                <button
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>画像がありません。</p>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        メンバーを削除
      </button>

      <div className="mt-6">
        <Link href={`/admin/shops/${shopId}/members`} className="text-blue-500 hover:underline">
          メンバー一覧に戻る
        </Link>
      </div>
    </div>
  );
}