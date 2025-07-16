"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (session?.user) {
      setUserData({
        username: session.user.username || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleInputChange = (e, field) => {
    setUserData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        message.success('User data updated successfully');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      message.error('Failed to update user data');
    }
  };

  return (
    <div className="p-1">
      <h3 className="text-xl font-medium text-black">Admins</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            value={userData.username}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <input
            value={userData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            placeholder="Enter your email"
            type="email"
          />
        </div>

       
        <button 
          type="primary"
          onClick={handleSubmit}
          className="w-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Page;
