import React from 'react';

export default function StaffOverview({ staff, shifts }) {
  const staffHours = staff.map(member => {
    const memberShifts = shifts.filter(shift => shift.staffId === member.id);
    const totalHours = memberShifts.reduce((acc, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);
    return { ...member, hours: totalHours };
  });

  const sortedStaff = staffHours.sort((a, b) => b.hours - a.hours).slice(0, 5);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">トップスタッフ（労働時間）</h2>
      <ul className="space-y-2">
        {sortedStaff.map((member) => (
          <li key={member.id} className="flex justify-between items-center">
            <span>{member.name}</span>
            <span className="font-semibold">{member.hours.toFixed(1)}時間</span>
          </li>
        ))}
      </ul>
    </div>
  );
}