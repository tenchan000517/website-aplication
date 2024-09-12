import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ShiftSummary({ shifts }) {
  const currentWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
  });

  const dailyShiftCounts = currentWeekShifts.reduce((acc, shift) => {
    const dayOfWeek = new Date(shift.date).toLocaleString('en-us', {weekday: 'short'});
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(dailyShiftCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">週間シフトサマリー</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}