// src/app/admin/analysis/page.js
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import AnalysisDashboard from '@/components/admin/AnalysisDashboard';

export default function AnalysisPage() {
  const { data: session } = useSession();

  if (!session || !['admin', 'shop_manager'].includes(session.user.role)) {
    return <div>Access denied. You must be an admin or shop manager to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">分析ダッシュボード</h1>
      <AnalysisDashboard />
    </div>
  );
}