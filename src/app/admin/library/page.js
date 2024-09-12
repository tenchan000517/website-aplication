import LibraryManagement from '@/components/admin/LibraryManagement';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function AllShopsLibraryPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-end mb-8 w-full border-b-2 border-gray-500 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">ライブラリ</h1>
        
        {/* ダッシュボードに戻るボタン */}
        <Link href="/admin/dashboard">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Home className="mr-2" size={20} />
            ダッシュボードに戻る
          </button>
        </Link>
      </div>

      <LibraryManagement />
    </div>
  );
}
