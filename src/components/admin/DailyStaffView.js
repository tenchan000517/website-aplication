import React, { useState, useEffect } from 'react';

export default function DailyStaffView({ date, shifts, staff, shopId }) {
  const [profileImages, setProfileImages] = useState({});

  useEffect(() => {
    const fetchProfileImages = async () => {
      const images = {};
      for (const member of staff) {
        try {
          const response = await fetch(`/api/staff/profile-image/${member.id}`);
          const data = await response.json();
          images[member.id] = data.imageUrl;
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
      setProfileImages(images);
    };

    fetchProfileImages();
  }, [staff]);

  const dailyShifts = shifts.filter(shift => 
    new Date(shift.date).toDateString() === date.toDateString()
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{date.toLocaleDateString()} の出勤スタッフ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dailyShifts.map(shift => {
          const staffMember = staff.find(s => s.id === shift.staffId);
          return (
            <div key={shift.id} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <img 
                src={profileImages[staffMember.id] || '/default-profile.png'} 
                alt={staffMember.name} 
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{staffMember.name}</h3>
              <p className="text-sm text-gray-600">{shift.startTime} - {shift.endTime}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}