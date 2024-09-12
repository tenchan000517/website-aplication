'use client';

import React, { useState, useEffect } from 'react';

export default function StaffProfileCard({ staff, shift }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchProfileImage();
  }, [staff.id]);

  const fetchProfileImage = async () => {
    try {
      const response = await fetch(`/api/staff/profile-image/${staff.id}`);
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
      <img 
        src={imageUrl || '/default-profile.png'} 
        alt={staff.name} 
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <h3 className="text-lg font-semibold">{staff.name}</h3>
      <p className="text-sm text-gray-600">{shift.startTime} - {shift.endTime}</p>
    </div>
  );
}