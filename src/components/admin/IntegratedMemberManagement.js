import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function IntegratedMemberManagement({ shops }) {
  const [selectedShop, setSelectedShop] = useState('');
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    height: '',
    bust: '',
    cup: '',
    waist: '',
    hip: '',
    thumbnail: '',
    images: [],
    comment: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (selectedShop) {
      fetchMembers(selectedShop);
    }
  }, [selectedShop]);

  const fetchMembers = async (shopId) => {
    try {
      const response = await fetch(`/api/members?shopId=${shopId}`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData[key].forEach((file) => {
          formDataToSend.append('images', file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append('shopId', selectedShop);

    try {
      const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(editingMember ? 'Failed to update member' : 'Failed to add member');
      }

      const result = await response.json();
      alert(result.message);
      setIsAddingMember(false);
      setEditingMember(null);
      fetchMembers(selectedShop);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      ...member,
      images: [],
    });
    setIsAddingMember(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('本当にこのメンバーを削除しますか？')) {
      try {
        const response = await fetch(`/api/members/${memberId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete member');
        }

        alert('メンバーが削除されました。');
        fetchMembers(selectedShop);
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('メンバーの削除に失敗しました。');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      age: '',
      height: '',
      bust: '',
      cup: '',
      waist: '',
      hip: '',
      thumbnail: '',
      images: [],
      comment: '',
    });
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">メンバー管理</h1>
      
      <div className="mb-6">
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">店舗を選択</option>
          {shops.map(shop => (
            <option key={shop.shopId} value={shop.shopId}>{shop.name}</option>
          ))}
        </select>
      </div>

      {selectedShop && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="メンバーを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={() => {
                setIsAddingMember(true);
                setEditingMember(null);
                resetForm();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              新規メンバー追加
            </button>
          </div>

          {isAddingMember && (
            <div className="mb-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingMember ? 'メンバー編集' : '新規メンバー登録'}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* フォームの内容はMemberRegistrationFormとMemberEditFormを統合 */}
                {/* ここにフォームフィールドを追加 */}
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  {editingMember ? '更新' : '登録'}
                </button>
                <button type="button" onClick={() => {
                  setIsAddingMember(false);
                  setEditingMember(null);
                }} className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
                  キャンセル
                </button>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齢</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身長</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.height}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-900 mr-2">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}