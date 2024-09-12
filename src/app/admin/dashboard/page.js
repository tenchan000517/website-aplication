'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, BarChart, Folder, Store } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fileId, setFileId] = useState('');
  const [permissionMessage, setPermissionMessage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchShops();
      fetchDashboardData();
    }
  }, [status, router, selectedShop]);

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops');
      if (!res.ok) throw new Error('Failed to fetch shops');
      const data = await res.json();
      setShops(data);
      if (data.length > 0) setSelectedShop(data[0].id);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedShop) return;
    try {
      const res = await fetch(`/api/admin/dashboard?shopId=${selectedShop}`);
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const cleanupDriveExplicit = async () => {
    const companyCode = '20240910002'; // 企業コード
    const shopId = '27';

  // 保持するフォルダのID
  const keepFolderIds = [];

  // 削除するフォルダとファイルのID
  const deleteIds = ['1RDlteeE_dFK2A94NpvL-K6v9muX38MvH'

];
  
    const response = await fetch('/api/drive/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyCode,
        shopId,
        keepFolderIds,
        deleteIds
      }),
    });

    if (!response.ok) {
      throw new Error('Cleanup failed');
    }

    return await response.json();
  };

  const handleCleanup = async () => {
    const confirmCleanup = window.confirm(
      "指定されたファイルとフォルダを削除します。この操作は取り消せません。続行しますか？"
    );
    
    if (!confirmCleanup) {
      setMessage("クリーンアップがキャンセルされました。");
      return;
    }
  
    setIsLoading(true);
    try {
      const result = await cleanupDriveExplicit();
      setMessage(result.message);
      // 削除されたアイテムの詳細をログに記録
    } catch (error) {
      setMessage('クリーンアップ中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPublicPermission = async () => {
    if (!fileId) {
      setPermissionMessage("ファイルIDを入力してください。");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/drive/permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to set public permission');
      }

      const data = await response.json();
      setPermissionMessage(`公開権限を設定しました。公開リンク: ${data.file.webViewLink}`);
    } catch (error) {
      setPermissionMessage('公開権限の設定中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">管理者ダッシュボード</h1>
      
      <div className="stats-overview grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">総店舗数</h3>
          <p className="text-2xl font-bold">{stats.totalShops || 0}</p>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">総メンバー数</h3>
          <p className="text-2xl font-bold">{stats.totalMembers || 0}</p>
        </div>
        <div className="stat-card bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">今月の総予約数</h3>
          <p className="text-2xl font-bold">{stats.monthlyBookings || 0}</p>
        </div>
      </div>

      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* <Link href="/admin/shops" className="dashboard-card bg-blue-500 text-white p-6 rounded-lg flex flex-col items-center justify-center">
          <Building size={48} />
              <h2>マスタ管理</h2>
            </Link> */}
            <Link href="/admin/users" className="dashboard-card">
              <User size={48} />
              <h2>ユーザー管理</h2>
            </Link>
            <Link href="/admin/shops" className="dashboard-card">
              <Store size={48} />
              <h2>店舗管理</h2>
            </Link>
            {/* {session.user.role === 'admin' ? ( */}
              <Link href="/admin/library" className="dashboard-card bg-purple-500 text-white p-6 rounded-lg flex flex-col items-center justify-center">
                <Folder size={48} />
                <h2>ライブラリ</h2>
              </Link>
            {/* ) : (
              <Link href={`/admin/shops/${session.user.shopId}/library`} className="dashboard-card bg-purple-500 text-white p-6 rounded-lg flex flex-col items-center justify-center">
                <Folder size={48} />
                <h2>店舗ライブラリ</h2>
              </Link>
            )} */}
            <Link href="/admin/analytics" className="dashboard-card bg-purple-500 text-white p-6 rounded-lg flex flex-col items-center justify-center">
              <BarChart size={48} />
              <h2 className="mt-2 text-xl font-semibold">全体分析</h2>
            </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">ファイルの公開権限設定</h2>
        <input
          type="text"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="ファイルIDを入力"
          className="border p-2 mr-2"
        />
        <button 
          onClick={handleSetPublicPermission} 
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isLoading ? '処理中...' : '公開権限を設定'}
        </button>
        {permissionMessage && <p className="mt-2">{permissionMessage}</p>}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Google Driveクリーンアップ</h2>
        <button 
          onClick={handleCleanup} 
          disabled={isLoading}
          className="bg-red-500 text-white p-2 rounded"
        >
          {isLoading ? 'クリーンアップ中...' : 'クリーンアップ実行'}
        </button>
        {message && <p className="mt-2">{message}</p>}
      </div>

    </div>
  );
}