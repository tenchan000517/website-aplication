import React, { useState } from 'react';

export default function ShiftUpdateForm({ selectedDate, staff, onUpdate, shopId }) {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/shops/${shopId}/shifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staffId: selectedStaff,
          date: selectedDate.toISOString().split('T')[0],
          startTime,
          endTime,
        }),
      });
      if (response.ok) {
        onUpdate();
        setSelectedStaff('');
        setStartTime('');
        setEndTime('');
      } else {
        console.error('Failed to update shift');
      }
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">シフト登録・更新</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          required
          className="border rounded px-3 py-2"
        >
          <option value="">スタッフを選択</option>
          {staff.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          readOnly
          className="border rounded px-3 py-2 bg-gray-100"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        シフト登録
      </button>
    </form>
  );
}