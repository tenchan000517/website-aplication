'use client';

import '@/styles/admin.css'
import { SessionProvider } from "next-auth/react"
import AdminNavigation from '@/components/admin/AdminNavigation'

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <div className="admin-layout">
        <AdminNavigation />
        <main className="admin-content">{children}</main>
      </div>
    </SessionProvider>
  );
}