import React, { useState } from 'react';
import { Clock, Tag } from 'lucide-react';

export default function BulkShopManagement({ shops, onUpdate }) {
  const [selectedShops, setSelectedShops] = useState([]);
  const [action, setAction] = useState('');
  const [value, setValue] = useState('');

  const handleShopSelect = (shopId) => {
    setSelectedShops(prev => 
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setValue('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedShops.length === 0 || !action || !value) return;

    try {
      const response = await fetch('/api/shops/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopIds: selectedShops, action, value }),
      });

      if (!response.ok) throw new Error('Bulk update failed');

      onUpdate();
      alert('一括更新が完了しました。');
    } catch (error) {
      console.error('Bulk update error:', error);
      alert('一括更新中にエラーが発生しました。');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">店舗一括管理</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            店舗を選択:
          </label>
          <div className="max-h-40 overflow-y-auto">
            {shops.map(shop => (
              <label key={shop.shopId} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedShops.includes(shop.shopId)}
                  onChange={() => handleShopSelect(shop.shopId)}
                  className="mr-2"
                />
                {shop.name}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            アクション:
          </label>
          <select
            value={action}
            onChange={handleActionChange}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            <option value="updateOpenTime">営業開始時間の変更</option>
            <option value="updateCloseTime">営業終了時間の変更</option>
            <option value="applyCampaign">キャンペーンの適用</option>
          </select>
        </div>
        {action && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {action === 'updateOpenTime' ? '新しい営業開始時間' :
               action === 'updateCloseTime' ? '新しい営業終了時間' :
               'キャンペーン名'}:
            </label>
            <div className="flex items-center">
              {(action === 'updateOpenTime' || action === 'updateCloseTime') && <Clock className="mr-2" size={20} />}
              {action === 'applyCampaign' && <Tag className="mr-2" size={20} />}
              <input
                type={action === 'applyCampaign' ? 'text' : 'time'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={selectedShops.length === 0 || !action || !value}
        >
          一括更新
        </button>
      </form>
    </div>
  );
}