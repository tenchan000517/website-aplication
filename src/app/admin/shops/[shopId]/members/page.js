'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, Store } from 'lucide-react'; // Store アイコンと ArrowLeft アイコンをインポート

export default function MembersPage({ params }) {
  const { shopId } = params;
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const res = await fetch(`/api/members?shopId=${shopId}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (!data) {
          throw new Error('No data received');
        }

        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('メンバー情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [shopId]);

  const handleMemberClick = (memberId) => {
    router.push(`/admin/shops/${shopId}/members/${memberId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">メンバー管理（店舗ID: {shopId}）</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}


      <div className="flex justify-between items-end mb-8 w-full border-b-2 border-gray-500 pb-2">

      <Link href={`/admin/shops/${shopId}/members/add`}>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 px-4 py-2 rounded hover:bg-green-600 flex items-center transition-colors">
        <PlusIcon className="mr-2" size={20} />
          新規メンバー追加
        </button>
      </Link>
      {/* 戻るボタン（店舗管理） */}
      <Link href={`/admin/shops/${shopId}`}>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Store className="mr-2" size={20} />
            店舗管理画面に戻る
          </button>
        </Link>
      </div>

      {loading ? (
        <p>ローディング中...</p>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.memberId}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleMemberClick(member.memberId)}
            >
              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p>年齢: {member.age}</p>
              <p className="mt-2 text-sm text-gray-500">
                フォルダID: {member.driveFolderId || '未設定'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>メンバーが登録されていません。</p>
      )}
    </div>
  );
}