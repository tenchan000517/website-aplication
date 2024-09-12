'use client';

import { useState, useEffect } from 'react';
import { getSheetData } from '@/utils/googleSheets';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        const data = await getSheetData('attendance');
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    }

    fetchAttendanceData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">勤怠管理</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">日付</th>
            <th className="border border-gray-300 px-4 py-2">ユーザーID</th>
            <th className="border border-gray-300 px-4 py-2">出勤時間</th>
            <th className="border border-gray-300 px-4 py-2">退勤時間</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{record.date}</td>
              <td className="border border-gray-300 px-4 py-2">{record.userId}</td>
              <td className="border border-gray-300 px-4 py-2">{record.clockIn}</td>
              <td className="border border-gray-300 px-4 py-2">{record.clockOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}