import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Star } from 'lucide-react';

export default function ShopPerformanceDashboard({ shops }) {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/shops/performance');
      if (!response.ok) throw new Error('Failed to fetch performance data');
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const metrics = [
    { key: 'revenue', name: '売上', icon: DollarSign },
    { key: 'customers', name: '顧客数', icon: Users },
    { key: 'rating', name: '評価', icon: Star },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">店舗パフォーマンス分析</h2>
      <div className="mb-4">
        {metrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`mr-2 px-4 py-2 rounded ${
              selectedMetric === metric.key 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <metric.icon className="inline-block mr-2" size={16} />
            {metric.name}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={selectedMetric} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}