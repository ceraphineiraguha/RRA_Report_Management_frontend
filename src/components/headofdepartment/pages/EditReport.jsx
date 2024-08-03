// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DepartmentEditReport = () => {
  const { reportId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const accessToken = userData?.accessToken;

        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };

        const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/report/${reportId}/`, config);
        const { title, description } = res.data;
        setTitle(title);
        setDescription(description);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleUpdateReport = async (e) => {
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
      const res = await axios.put(`https://rra-report-management-system-backend.onrender.com/report/update/${reportId}/`, reportData, config);
      if (res.data) {
        setMessage('Report updated successfully');
        navigate('/departement/report');
      } else {
        setMessage('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      setMessage('Error updating report');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <h1 className="text-center text-black text-xl capitalize mb-4">Edit Report</h1>
      <form onSubmit={handleUpdateReport} className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
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
            Update Report
          </button>
        </div>
        {message && <div className="text-center text-red-500">{message}</div>}
      </form>
    </div>
  );
};

export default DepartmentEditReport;
