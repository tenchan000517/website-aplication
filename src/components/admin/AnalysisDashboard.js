// src/components/admin/AnalysisDashboard.js
"use client"; // ← これを追加

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalysisDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    const res = await fetch('/api/analysis');
    const analysisData = await res.json();
    setData(analysisData);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">予約数推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reservations" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">人気キャストランキング</h2>
        <ul>
          {data.popularCasts && data.popularCasts.map((cast, index) => (
            <li key={cast.id} className="mb-2">
              {index + 1}. {cast.name} - 予約数: {cast.reservations}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}