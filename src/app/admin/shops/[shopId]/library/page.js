'use client';

import { useParams } from 'next/navigation';
import ShopLibraryManagement from '@/components/admin/ShopLibraryManagement';
import Link from 'next/link';
import { Home, Store } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShopLibraryPage() {
  const { shopId } = useParams();
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    async function fetchShopData() {
      try {
        const res = await fetch(`/api/shops?shopId=${shopId}`);
        if (!res.ok) throw new Error('Failed to fetch shop data');
        const data = await res.json();
        setShopName(data.name);  // 店舗名をステートに保存
      } catch (error) {
        console.error('Error fetching shop data:', error);
      }
    }

    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-end mb-8 w-full border-b-2 border-gray-500 pb-2">
      <h1 className="text-3xl font-bold text-gray-800">{shopName || 'ライブラリ'}</h1>
        
        {/* ダッシュボードに戻るボタン */}
        <Link href={`/admin/shops/${shopId}`}>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Store className="mr-2" size={20} />
            店舗管理画面に戻る
          </button>
        </Link>
      </div>

      <ShopLibraryManagement shopId={shopId} />
    </div>
  );
}