/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdminReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchReports = async () => {
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

      const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/`, config);
      setReports(res.data);
      setFilteredReports(res.data);

    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    setFilteredReports(
      reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.level.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, reports]);

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

      await axios.put(`https://rra-report-management-system-backend.onrender.com/report/approve/${reportId}/`, {}, config);
      fetchReports(); // Refresh the list of reports
    } catch (err) {
      console.error("Error approving report", err);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('All Reports', 14, 16);
    doc.autoTable({
      head: [['Title', 'Level', 'Status', 'Created Date', 'Created By']],
      body: filteredReports.map(report => [
        report.title,
        report.level,
        report.status ? 'Approved' : 'Pending',
        new Date(report.created_date).toLocaleString(),
        report.created_by.phone
      ])
    });
    doc.save('all_reports.pdf');
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredReports.map(report => ({
      Title: report.title,
      Level: report.level,
      Status: report.status ? 'Approved' : 'Pending',
      'Created Date': new Date(report.created_date).toLocaleString(),
      'Created By': report.created_by.phone
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'all_reports.xlsx');
  };

  const handleChangePage = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next' && prevPage < Math.ceil(filteredReports.length / rowsPerPage)) {
        return prevPage + 1;
      }
      if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const displayedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border text-gray-700 rounded"
      />
      <div className='flex justify-end mb-4 row-auto'>
        <div className='flex space-x-4'>
          <button
            onClick={handleDownloadPDF}
            className='px-4 py-1 rounded-lg bg-blue-700 text-white'
          >
            Download PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className='px-4 py-1 rounded-lg bg-gray-700 text-white'
          >
            Download Excel
          </button>
        </div>
      </div>

      <h2 className="text-center text-black text-lg font-bold capitalize mb-4">All Available Reports</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Level</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Created Date</th>
              <th scope="col" className="px-6 py-3">Created By</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedReports.length > 0 ? (
              displayedReports.map((report) => (
                <tr key={report.id} className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-gray-50 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {report.title}
                  </th>
                  <td className="px-6 py-4">{report.level}</td>
                  <td className="px-6 py-4">{report.status ? 'Approved' : 'Pending'}</td>
                  <td className="px-6 py-4">{new Date(report.created_date).toLocaleString()}</td>
                  <td className="px-6 py-4">{report.created_by.phone}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowDetails(report.id)}
                      className='px-4 py-1 rounded-lg bg-gray-500 text-white'
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(report.id)}
                      className='px-4 py-1 rounded-lg bg-green-500 text-white'
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className='px-4 py-1 rounded-lg bg-red-500 text-white'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No reports available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleChangePage('prev')}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => handleChangePage('next')}
            disabled={currentPage >= Math.ceil(filteredReports.length / rowsPerPage)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {showDetails && selectedReport && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Report Details</h3>
            <p className='text-gray-600'><strong>Title:</strong> {selectedReport.title}</p>
            <p className='text-gray-600'><strong>Level:</strong> {selectedReport.level}</p>
            <p className='text-gray-600'><strong>Status:</strong> {selectedReport.status ? 'Approved' : 'Pending'}</p>
            <p className='text-gray-600'><strong>Description:</strong> {selectedReport.description}</p>
            <p><strong>Created Date:</strong> {new Date(selectedReport.created_date).toLocaleString()}</p>
            <p className='text-gray-600'><strong>Created By:</strong> <br /> <span className='text-gray-500'>{selectedReport.created_by.email}</span> <br /> <span className='text-gray-500'>{selectedReport.created_by.phone}</span>  </p>
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


export default AdminReport;
