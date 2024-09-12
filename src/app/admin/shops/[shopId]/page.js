'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Calendar, Folder } from 'lucide-react';  // アイコンのインポート

export default function ShopDetail({ params }) {
  const [shop, setShop] = useState(null);
  const [members, setMembers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { shopId } = params;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session.user.role === 'admin' || session.user.shopId === shopId) {
        fetchShopData();
      } else {
        router.push('/admin/unauthorized');
      }
    }
  }, [status, session, shopId, router]);

  async function fetchShopData() {
    try {
      const shopResponse = await fetch(`/api/shops?shopId=${shopId}`);
      const shopData = await shopResponse.json();
      setShop(shopData);

      const membersResponse = await fetch(`/api/members?shopId=${shopId}`);
      const membersData = await membersResponse.json();
      setMembers(Array.isArray(membersData) ? membersData : []); // membersDataが配列でない場合は空配列に設定

      const today = new Date().toISOString().split('T')[0];
      const shiftsResponse = await fetch(`/api/shifts?shopId=${shopId}&startDate=${today}&endDate=${today}`);
      const shiftsData = await shiftsResponse.json();
      setShifts(Array.isArray(shiftsData) ? shiftsData : []); // エラー修正：shiftsDataが配列でない場合に空配列を設定
    } catch (error) {
      console.error('Error fetching shop data:', error);
    }
  }

  if (status === 'loading' || !shop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{shop.name}</h1>

    {/* カードメニュー */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Link href={`/admin/shops/${shopId}/members`} className="bg-blue-100 shadow rounded-lg p-6 hover:bg-blue-200 transition">
      <Users className="text-blue-500 mr-2" size={24} /> {/* メンバー管理アイコン */}

        <h2 className="text-xl font-semibold mb-4">メンバー管理</h2>
        <p>メンバーを管理し、詳細情報や追加・編集ができます。</p>
        <p><strong>メンバー数:</strong> {members.length} 人</p>  {/* メンバー数の表示 */}

      </Link>
      <Link href={`/admin/shops/${shopId}/shifts`} className="bg-green-100 shadow rounded-lg p-6 hover:bg-green-200 transition">
      <Calendar className="text-green-500 mr-2" size={24} /> {/* シフト管理アイコン */}

        <h2 className="text-xl font-semibold mb-4">シフト管理</h2>
        <p>シフトの管理や追加・編集ができます。</p>
        <p><strong>本日の出勤:</strong> {shifts.length} 人</p>  {/* 本日の出勤数を表示 */}

      </Link>

      <Link href={`/admin/shops/${shopId}/library`} className="bg-purple-100 shadow rounded-lg p-6 hover:bg-purple-200 transition">
          <div className="flex items-center mb-4">
            <Folder className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">ライブラリ</h2>
          </div>
          <p className="mb-2">店舗の資料や画像の管理・アップロードができます。</p>
        </Link>

  {/* 予約管理と店舗分析は後で使うかもしれないのでコメントアウト */}
  {/* 
  <Link href={`/admin/shops/${shopId}/reservations`} className="bg-yellow-100 shadow rounded-lg p-6 hover:bg-yellow-200 transition">
    <h2 className="text-xl font-semibold mb-4">予約管理</h2>
    <p>予約情報を管理し、追加・編集ができます。</p>
  </Link>
  <Link href={`/admin/shops/${shopId}/analytics`} className="bg-red-100 shadow rounded-lg p-6 hover:bg-red-200 transition">
    <h2 className="text-xl font-semibold mb-4">店舗分析</h2>
    <p>店舗の分析データを確認できます。</p>
  </Link>
  */}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <div className="bg-white shadow rounded-lg p-6 h-full"> {/* 高さ100%の設定 */}
          <h2 className="text-2xl font-semibold mb-4">店舗情報</h2>
          <p className="mb-2"><strong>住所:</strong> {shop.address}</p>
          <p className="mb-2"><strong>電話番号:</strong> {shop.phoneNumber}</p>
          <p className="mb-2"><strong>メール:</strong> {shop.email}</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="bg-white shadow rounded-lg p-6 h-full"> {/* 高さ100%の設定 */}
          <h2 className="text-2xl font-semibold mb-4">本日のシフト</h2>
          {shifts.length > 0 ? (
            <ul className="space-y-2">
              {shifts.map((shift) => (
                <li key={shift.id} className="p-2 bg-gray-100 rounded">
                  {shift.memberName}: {shift.startTime} - {shift.endTime}
                </li>
              ))}
            </ul>
          ) : (
            <p>本日のシフトはありません。</p>
          )}
        </div>
      </div>
    </div>


        {/* ここに余白を追加 */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">メンバー一覧</h2>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="p-2 bg-gray-100 rounded">
                {member.name}
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}