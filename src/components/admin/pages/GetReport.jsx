import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GetReport() {
  const { id } = useParams();
  const [reportData, setReportData] = useState({
    user: '',
    level: '',
    title: '',
    description: '',
    created_date: ''
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

    // Fetch report data by ID
    const fetchReport = async () => {
      try {
        const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/report/${id}/`, config);
        if (res.data) {
          setReportData(res.data);
        } else {
          console.log("Error fetching report data");
        }
      } catch (err) {
        console.error("Error fetching report data", err);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Report Details</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">User ID:</label>
          <input
            type="text"
            name="user"
            value={reportData.user}
            readOnly
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Level:</label>
          <input
            type="text"
            name="level"
            value={reportData.level}
            readOnly
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={reportData.title}
            readOnly
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description:</label>
          <input
            type="text"
            name="description"
            value={reportData.description}
            readOnly
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Created Date:</label>
          <input
            type="text"
            name="created_date"
            value={new Date(reportData.created_date).toLocaleString()}
            readOnly
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default GetReport;