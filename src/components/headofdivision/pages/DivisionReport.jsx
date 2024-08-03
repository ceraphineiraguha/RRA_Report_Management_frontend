/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DivisionReport = () => {
  const [reports, setReports] = useState([]);
  const [subordinateReports, setSubordinateReports] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Function to fetch reports created by the head of department
  const fetchReports = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const accessToken = userData?.accessToken;
      const userId = userData?.id;

      if (!accessToken || !userId) {
        console.error("No access token or user ID found");
        return;
      }

      setUserId(userId);

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      // Fetch reports created by the HOD
      const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/by_creator/${userId}/`, config);
      setReports(res.data);

      // Fetch reports created by the HOD's subordinates
      const subordinateRes = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/by_subordinates/${userId}/`, config);
      setSubordinateReports(subordinateRes.data);

    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  // Handle report deletion
  const handleDelete = async (reportId) => {
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

      await axios.delete(`https://rra-report-management-system-backend.onrender.com/report/delete/${reportId}/`, config);
      fetchReports(); // Refresh the list of reports
    } catch (err) {
      console.error("Error deleting report", err);
    }
  };

  // Handle showing report details
  const handleShowDetails = async (reportId) => {
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
      setSelectedReport(res.data);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching report details", err);
    }
  };

  // Handle approving report
  const handleApprove = async (reportId) => {
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

      await axios.patch(`https://rra-report-management-system-backend.onrender.com/report/approve/${reportId}/`, {}, config);
      fetchReports(); // Refresh the list of reports
    } catch (err) {
      console.error("Error approving report", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      {/* <h1 className="text-center text-black text-xl text-bold capitalize mb-4">Reports</h1> */}

      {/* Section for reports created by subordinates */}
      <h2 className="text-center text-black text-lg font-bold capitalize mb-4">Subordinate Reports</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Level</th>
              <th scope="col" className="px-6 py-3">Created Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subordinateReports.length > 0 ? (
              subordinateReports.map((report) => (
                <tr key={report.id} className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {report.title}
                  </th>
                  <td className="px-6 py-4">{report.level}</td>
                  <td className="px-6 py-4">{new Date(report.created_date).toLocaleString()}</td>
                  <td className="px-6 py-4">{report.status ? 'Approved' : 'Pending'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowDetails(report.id)}
                      className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                      Explore
                    </button>
                    {!report.status && (
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="ml-2 px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No subordinate reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for report details */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-lg text-black font-bold mb-4">Report Details</h2>
            <p className='text-gray-700'><strong>Title:</strong> <span className='text-md'>{selectedReport.title}</span></p>
            <p className='text-gray-700'><strong>Description:</strong> <br /> <span className='text-sm'>{selectedReport.description}</span></p>
            <p className='text-gray-700'><strong>Level:</strong> <span className='text-sm'>{selectedReport.level}</span></p>
            <p className='text-gray-700'><strong>Created Date:</strong> <span className='text-sm text-yellow-500'>{new Date(selectedReport.created_date).toLocaleString()}</span></p>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionReport;
