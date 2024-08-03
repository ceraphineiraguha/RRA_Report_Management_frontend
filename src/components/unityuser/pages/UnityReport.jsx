/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const UnityReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchReports = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));

      console.log('userData:', userData); // Debugging line

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

      const res = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/by_creator/${userId}/`, config);

      if (res.data) {
        setReports(res.data);
        setFilteredReports(res.data);
      } else {
        console.log("No reports found");
      }
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setFilteredReports(
      reports.filter(report =>
        report.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
        report.level.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Reports', 14, 16);
    doc.autoTable({
      head: [['Title', '', 'Level', 'Status', 'Created Date']],
      body: filteredReports.map(report => [
        report.title,
        report.level,
        report.status ? 'Approved' : 'Pending',
        new Date(report.created_date).toLocaleString()
      ])
    });
    doc.save('reports.pdf');
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredReports.map(report => ({
      Title: report.title,
      Level: report.level,
      Status: report.status ? 'Approved' : 'Pending',
      'Created Date': new Date(report.created_date).toLocaleString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'reports.xlsx');
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

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="text-center text-black text-xl capitalize mb-4">Reports</h1>
      <div className='flex justify-between mb-4'>
        <div className='flex space-x-4'>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 border text-gray-700 rounded"
          />
          <button
            onClick={handleDownloadPDF}
            className='px-4  rounded-lg bg-blue-700 text-white'
          >
            Download PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className='px-4  rounded-lg bg-gray-700 text-white'
          >
            Download Excel
          </button>
        </div>
        <Link to="/unityuser/createreport" className='px-4 py-1 rounded-lg bg-black text-white'>Create report</Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Level</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Created Date</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((report) => (
                <tr key={report.id} className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-gray-50 border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                    {report.title}
                  </th>
                  <td className="px-6 py-4">{report.level}</td>
                  <td className="px-6 py-4">{report.status ? 'Approved' : 'Pending'}</td>
                  <td className="px-6 py-4">{new Date(report.created_date).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowDetails(report.id)}
                      className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                      Explore
                    </button>
                    <Link
                      to={`/unityuser/editreport/${report.id}`}
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700 ml-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-lg text-black font-bold justify-between mb-4">Report Details</h2>
            <p className='text-gray-700'><strong>Title:</strong> <span className='text-md'></span> {selectedReport.title}</p>
            <p className='text-gray-700'><strong>Level:</strong> <span className='text-sm'>{selectedReport.level}</span> </p> <br />
            <p className='text-gray-700'><strong>Description:</strong> <br /> <span className='text-sm'>{selectedReport.description}</span> </p> <br />
            <p className='text-gray-700'><strong>Issued by:</strong> <br /> <span className='text-sm'>{selectedReport.created_by.email}</span> <br /> <span className='text-sm'>{selectedReport.created_by.phone}</span> </p>
            <p className='text-gray-700'><strong>Created Date:</strong> <span className='text-sm text-yellow-500'>{new Date(selectedReport.created_date).toLocaleString()}</span> </p>
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

export default UnityReport;
