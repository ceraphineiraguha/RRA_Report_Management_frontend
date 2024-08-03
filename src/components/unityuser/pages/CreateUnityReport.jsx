/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

const CreateUnityReport = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateReport = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const accessToken = userData?.accessToken;

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const reportData = {
      title: title,
      description: description
    };

    try {
      const res = await axios.post('https://rra-report-management-system-backend.onrender.com/report/create/', reportData, config);
      if (res.data) {
        setMessage('Report created successfully');
        // Clear the form
        setTitle('');
        setDescription('');
      } else {
        setMessage('Failed to create report');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      setMessage('Error creating report');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <h1 className="text-center text-black text-xl capitalize mb-4">Create Report</h1>
      <form onSubmit={handleCreateReport} className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block text-black w-full mt-1 p-2 border rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="block w-full mt-1 text-black p-2 border rounded-md shadow-sm"
          ></textarea>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700"
          >
            Create Report
          </button>
        </div>
        {message && <div className="text-center text-red-500">{message}</div>}
      </form>
    </div>
  );
};

export default CreateUnityReport;
