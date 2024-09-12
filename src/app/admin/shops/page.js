'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Home, Store } from 'lucide-react';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [selectedShop, setSelectedShop] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/admin/unauthorized');
    } else {
      fetchShops();
      fetchTotalMembers();
    }
  }, [status, session, router]);

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops');
      if (!res.ok) throw new Error('Failed to fetch shops');
      const data = await res.json();
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].shopId);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchTotalMembers = async () => {
    try {
      const res = await fetch('/api/members/count');
      if (!res.ok) throw new Error('Failed to fetch total members');
      const data = await res.json();
      setTotalMembers(data.count);
    } catch (error) {
      console.error('Error fetching total members:', error);
    }
  };

  const handleShopSelect = (event) => {
    setSelectedShop(event.target.value);
  };

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
<div className="flex justify-between items-end mb-8 w-full border-b-2 border-blue-500 pb-2">

      <h1 className="text-3xl font-bold">店舗情報登録</h1>
        {/* ダッシュボードに戻るボタン */}
        <Link href="/admin/dashboard">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Home className="mr-2" size={20} />
            ダッシュボードに戻る
            </button>
        </Link>
        </div>

        <div className="grid grid-cols-1 mb-14 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 店舗検索カード */}
            <div className="bg-blue-100 shadow rounded-lg p-6 hover:bg-blue-200 transition flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 self-start">店舗検索</h2> {/* 左上にタイトルを追加 */}
                <div className="flex items-center w-full">
                <Search className="text-blue-500 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="店舗を検索..."
                    className="p-2 border rounded w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>

            {/* 新規店舗登録カード */}
            <div className="bg-purple-100 shadow rounded-lg p-6 hover:bg-purple-200 transition flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 self-start">店舗登録</h2> {/* 左上にタイトルを追加 */}
            <Link href="/admin/shops/register" className="bg-blue-500 text-white px-16 py-2 rounded hover:bg-blue-600 transition-colors flex justify-center items-center">
                <Plus size={20} className="mr-2" />
                <span className="text-center">新規店舗登録</span>
            </Link>
            </div>

            {/* 店舗編集カード */}
            <div className="bg-green-100 shadow rounded-lg p-6 hover:bg-green-200 transition flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 self-start">店舗編集</h2> {/* 左上にタイトルを追加 */}
                <div className="flex items-center space-x-4 w-full">
                <select
                    value={selectedShop}
                    onChange={handleShopSelect}
                    className="p-2 border rounded w-2/3"
                >
                    {shops.map((shop) => (
                    <option key={shop.shopId} value={shop.shopId}>
                        {shop.name}
                    </option>
                    ))}
                </select>

                {/* 編集ボタン */}
                {selectedShop && (
                    <Link href={`/admin/shops/${selectedShop}/details`} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors">
                    編集
                    </Link>
                )}
                </div>
            </div>
            </div>

        <div className="flex justify-between items-end mb-8 w-full border-b-2 border-blue-500 pb-2">
        <h1 className="text-3xl font-bold">店舗管理</h1>
        </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">店舗一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShops.map((shop, index) => (
            <Link key={`${shop.shopId}-${index}`} href={`/admin/shops/${shop.shopId}`} className="p-4 border rounded-lg hover:bg-gray-100 transition-colors">
            <Store className="text-blue-500 mb-2" size={24} />
              <h3 className="text-lg font-semibold">{shop.name}</h3>
              <p className="text-sm text-gray-600">{shop.address}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
