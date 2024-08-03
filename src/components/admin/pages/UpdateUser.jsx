/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    // Retrieve access token from session storage
    const userDataFromSession = JSON.parse(sessionStorage.getItem('userData'));
    const accessToken = userDataFromSession?.accessToken;

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    // Fetch user data by ID
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/user/${id}/`, config);
        if (res.data) {
          setUserData(res.data);
        } else {
          console.log("Error fetching user data");
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve access token from session storage
    const userDataFromSession = JSON.parse(sessionStorage.getItem('userData'));
    const accessToken = userDataFromSession?.accessToken;

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    // Update user data
    try {
      const res = await axios.put(`https://rra-report-management-system-backend.onrender.com/update/${id}/`, userData, config);
      if (res.data) {
        alert('User updated successfully');
        navigate('/admin/users');
      } else {
        alert('Failed to update user');
      }
    } catch (err) {
      console.error("Error updating user", err);
      alert('An error occurred while updating the user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-center text-yellow-300 mb-6">Update User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">First Name:</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            required
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            required
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone:</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role:</label>
          <input
            type="text"
            name="role"
            value={userData.role}
            onChange={handleChange}
            required
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Update User
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;