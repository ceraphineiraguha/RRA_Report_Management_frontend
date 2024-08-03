// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';

const Add_User = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('unit user');
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const userData = {
      first_name,
      last_name,
      email,
      phone,
      role
    };

    try {
      const userDataString = sessionStorage.getItem('userData');
      const user = JSON.parse(userDataString);
      const token = user.accessToken; 

      const res = await axios.post('https://rra-report-management-system-backend.onrender.com/signup/', userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (res.data) {
        setMessage('User created successfully');
        // Clear the form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setRole('unit user');
      } else {
        setMessage('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('Error creating user');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <h1 className="text-center text-black text-xl capitalize mb-4">Create User</h1>
      <form onSubmit={handleCreateUser} className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
            >
              
              <option value="unit user">Unit User</option>
              <option value="head of department">Head of Department</option>
              {/* <option value="head of division">Head of Division</option> */}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700"
          >
            Create User
          </button>
        </div>
        {message && <div className="text-center text-red-500">{message}</div>}
      </form>
    </div>
  );
};

export default Add_User;
