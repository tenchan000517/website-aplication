'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import styles from './UserManagement.module.css';
import { Home } from 'lucide-react'; // Home アイコンをインポート
import Link from 'next/link';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Fetched data is not an array');
        }
        if (isMounted) {
          setUsers(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        if (isMounted) {
          setError(error.message);
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      reset();
      const res = await fetch('/api/users');
      const updatedUsers = await res.json();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      const res = await fetch('/api/users');
      const updatedUsers = await res.json();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  if (isLoading) return <div className="text-center text-lg text-gray-700 mt-8">Loading...</div>;
  if (error) return <div className="text-center text-lg text-gray-700 mt-8">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-end mb-8 w-full border-b-2 border-green-500 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">ユーザー管理</h1>

        {/* ダッシュボードに戻るボタン */}
        <Link href="/admin/dashboard">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center transition-colors">
            <Home className="mr-2" size={20} />
            ダッシュボードに戻る
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 mb-8 shadow-md">
        <input
          {...register('username')}
          placeholder="ユーザー名"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="パスワード"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <select {...register('role')} className="w-full p-2 mb-4 border border-gray-300 rounded bg-white">
          <option value="admin">管理者</option>
          <option value="shop_manager">店舗管理者</option>
          <option value="staff">スタッフ</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          追加
        </button>
      </form>

      <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr>
            <th className="bg-gray-50 font-semibold text-left p-4 border-b border-gray-200">ユーザー名</th>
            <th className="bg-gray-50 font-semibold text-left p-4 border-b border-gray-200">役割</th>
            <th className="bg-gray-50 font-semibold text-left p-4 border-b border-gray-200">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="p-4 border-b border-gray-200">{user.username}</td>
                <td className="p-4 border-b border-gray-200">{user.role}</td>
                <td className="p-4 border-b border-gray-200">
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                    削除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center border-b border-gray-200">ユーザーが見つかりません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}