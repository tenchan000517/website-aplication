'use client';

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Calendar, Users, UserPlus, LogOut, BookOpen, Settings, User, Building, BarChart, Folder } from 'lucide-react';

export default function AdminNavigation() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');

    useEffect(() => {
        async function fetchShops() {
            try {
                const res = await fetch('/api/shops');
                if (!res.ok) throw new Error('Failed to fetch shops');
                const data = await res.json();
                setShops(data);
                if (data.length > 0) setSelectedShop(data[0].id);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        }
        fetchShops();
    }, []);

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                await signOut({ redirect: false });
                router.push(data.url);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleShopChange = (e) => {
        setSelectedShop(e.target.value);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('shopId', e.target.value);
        router.push(currentUrl.pathname + currentUrl.search);
    };

    return (
        <nav className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-4">
            <div className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-xl text-center">Overview</h1>
            </div>
            
            {/* {session && session.user.role === 'admin' && (
                <select value={selectedShop} onChange={handleShopChange} className="bg-gray-700 text-white rounded-md w-full p-2 mb-6">
                    {shops.map((shop, index) => (
                    <option key={`${shop.shopId}-${index}`} value={shop.shopId}>{shop.name}</option>
                ))}
                </select>
            )} */}

            <ul className="space-y-4">
                <li>
                    <Link href={`/admin/dashboard?shopId=${selectedShop}`} className={`${pathname === '/admin/dashboard' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                        <Home size={20} /> <span className="ml-2">ダッシュボード</span>
                    </Link>
                </li>

                {session && session.user.role === 'admin' && (
                    <>
                        <li>
                            <Link href={`/admin/library`} className={`${pathname === '/admin/library' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <Folder size={20} /> <span className="ml-2">ライブラリ</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className={`${pathname === '/admin/users' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <User size={20} /> <span className="ml-2">ユーザー管理</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/shops" className={`${pathname === '/admin/shops' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <Building size={20} /> <span className="ml-2">店舗管理</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/analysis" className={`${pathname === '/admin/analytics' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <BarChart size={20} /> <span className="ml-2">全体分析</span>
                            </Link>
                        </li>
                    </>
                )}

                {session && session.user.role === 'shop_manager' && (
                    <>
                        <li>
                            <Link href={`/admin/shops/${selectedShop}/members`} className={`${pathname === '/admin/members' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <Users size={20} /> <span className="ml-2">メンバー管理</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/shops/${selectedShop}/shifts`} className={`${pathname === '/admin/shifts' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <Calendar size={20} /> <span className="ml-2">シフト管理</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/shops/${selectedShop}/library`} className={`${pathname === '/admin/library' ? 'bg-gray-700' : ''} block py-2 px-4 rounded-lg hover:bg-gray-700`}>
                                <Folder size={20} /> <span className="ml-2">ライブラリ</span>
                            </Link>
                        </li>
                    </>
                )}

                {session && (
                    <li>
                        <button onClick={handleSignOut} className="w-full py-2 px-4 rounded-lg hover:bg-gray-700">
                            <LogOut size={20} /> <span className="ml-2">ログアウト</span>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
