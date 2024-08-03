/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function AllUsers() {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFetch = async () => {
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

      const res = await axios.get('https://rra-report-management-system-backend.onrender.com/created-users/', config);
      console.log("Response Data:", res.data); // Log the response data for debugging

      if (Array.isArray(res.data)) {
        setUserData(res.data);
        setFilteredData(res.data);
      } else {
        console.error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    setFilteredData(
      userData.filter(user =>
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      )
    );
  }, [search, userData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Customize format as needed
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('User Data', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Created Date']],
      body: filteredData.map(user => [
        user.first_name,
        user.last_name,
        user.email,
        user.phone,
        user.role,
        formatDate(user.created_at)
      ]),
    });
    doc.save('my_users.pdf');
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(user => ({
      'First Name': user.first_name,
      'Last Name': user.last_name,
      'Email': user.email,
      'Phone': user.phone,
      'Role': user.role,
      'Created Date': formatDate(user.created_at)
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'my_users.xlsx');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <h1 className='text-center text-black text-xl font-bold capitalize mb-4'>Users</h1>
      <div className='flex justify-between mb-4'>
        <div className='flex items-center'>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 text-gray-800 border rounded"
          />
        </div>
        <div className='flex space-x-4'>
          <button onClick={downloadPDF} className='px-4 py-2 bg-blue-600 text-white rounded'>Download PDF</button>
          <button onClick={downloadExcel} className='px-4 py-2 bg-gray-700 text-white rounded'>Download Excel</button>
          <Link to="/division/add_user" className='px-4 py-2 rounded-lg bg-green-500 text-white'>Create User</Link>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">First Name</th>
              <th scope="col" className="px-6 py-3">Last Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
                <tr key={user.id} className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-white border-b dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700">
                    {user.first_name}
                  </th>
                  <td className="px-6 py-4">{user.last_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage} / {Math.ceil(filteredData.length / itemsPerPage)}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default AllUsers;
