'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from 'react';
import ShiftCalendar from '@/components/admin/ShiftCalendar';
import ShiftSummary from '@/components/admin/ShiftSummary';
import StaffOverview from '@/components/admin/StaffOverview';
import ShiftUpdateForm from '@/components/admin/ShiftUpdateForm';
import DailyStaffView from '@/components/admin/DailyStaffView';

export default function ShiftsPage({ params }) {
  const { data: session, status } = useSession();
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (status === "authenticated") {
      fetchShifts();
      fetchStaff();
    }
  }, [status, params.shopId]);

  const fetchShifts = async () => {
    try {
      const response = await fetch(`/api/shops/${params.shopId}/shifts`);
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch(`/api/shops/${params.shopId}/staff`);
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-xl">Loading...</p>;
  }

  if (status === "unauthenticated") {
    redirect("/admin/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">シフト管理ダッシュボード</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ShiftCalendar shifts={shifts} onDateSelect={setSelectedDate} />
        </div>
        <div>
          <ShiftSummary shifts={shifts} />
          <div className="mt-8">
            <StaffOverview staff={staff} shifts={shifts} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ShiftUpdateForm
          selectedDate={selectedDate}
          staff={staff}
          onUpdate={fetchShifts}
          shopId={params.shopId}
        />
      </div>
      <div className="mt-8">
        <DailyStaffView
          date={selectedDate}
          shifts={shifts}
          staff={staff}
          shopId={params.shopId}
        />
      </div>
    </div>
  );
}