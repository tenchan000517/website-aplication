// src/components/admin/UserManagementClient.js
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import UserManagement from './UserManagement';

export default function UserManagementClient() {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'admin') {
    return <div>Access denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserManagement />
    </div>
  );
}