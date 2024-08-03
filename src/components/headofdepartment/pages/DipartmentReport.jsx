/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const DipartmentReport = () => {
  const [reports, setReports] = useState([]);
  const [subordinateReports, setSubordinateReports] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [subordinateSearch, setSubordinateSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  // Function to fetch reports created by the head of department
  const fetchReports = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const accessToken = userData?.accessToken;
      const userId = userData?.id;

      if (!accessToken || !userId) {
        console.error("No access token or user ID found");
        return;
      }

      setUserId(userId);

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Fetch reports created by the HOD
      const res = await axios.get(
        `https://rra-report-management-system-backend.onrender.com/report/reports/by_creator/${userId}/`,
        config
      );
      setReports(res.data);

      // Fetch reports created by the HOD's subordinates
      const subordinateRes = await axios.get(
        `https://rra-report-management-system-backend.onrender.com/report/reports/by_subordinates/${userId}/`,
        config
      );
      setSubordinateReports(subordinateRes.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  // Handle report deletion
  const handleDelete = async (reportId) => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const accessToken = userData?.accessToken;

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.delete(
        `https://rra-report-management-system-backend.onrender.com/report/delete/${reportId}/`,
        config
      );
      fetchReports(); // Refresh the list of reports
    } catch (err) {
      console.error("Error deleting report", err);
    }
  };

  // Handle showing report details
  const handleShowDetails = async (reportId) => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const accessToken = userData?.accessToken;

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await axios.get(
        `https://rra-report-management-system-backend.onrender.com/report/report/${reportId}/`,
        config
      );
      setSelectedReport(res.data);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching report details", err);
    }
  };

  // Handle report approval
  const handleApprove = async (reportId) => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const accessToken = userData?.accessToken;

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.put(
        `https://rra-report-management-system-backend.onrender.com/report/approve/${reportId}/`,
        {},
        config
      );
      fetchReports(); // Refresh the list of reports
    } catch (err) {
      console.error("Error approving report", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const indexOfLastSubordinateReport = currentPage * reportsPerPage;
  const indexOfFirstSubordinateReport =
    indexOfLastSubordinateReport - reportsPerPage;
  const currentSubordinateReports = subordinateReports.slice(
    indexOfFirstSubordinateReport,
    indexOfLastSubordinateReport
  );

  // // Search functionality
  // const handleSearchReports = (e) => {
  //   setReportSearch(e.target.value);
  //   setCurrentPage(1);
  // };

  // const handleSearchSubordinateReports = (e) => {
  //   setSubordinateSearch(e.target.value);
  //   setCurrentPage(1);
  // };

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(reportSearch.toLowerCase())
  );

  const filteredSubordinateReports = subordinateReports.filter((report) =>
    report.title.toLowerCase().includes(subordinateSearch.toLowerCase())
  );

  // Convert table data to PDF
  const downloadPDF = (data, title) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Title", "Level", "Created Date", "Status", "Created By"]],
      body: data.map((report) => [
        report.title,
        report.level,
        new Date(report.created_date).toLocaleString(),
        report.status ? "Approved" : "Pending",
        report.created_by || "",
      ]),
    });
    doc.save(`${title}.pdf`);
  };

  // Convert table data to Excel
  const downloadExcel = (data, title) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  // Download all data in PDF
  const downloadAllPDF = () => {
    const allData = [
      ...reports.map((report) => ({
        Title: report.title,
        Level: report.level,
        "Created Date": new Date(report.created_date).toLocaleString(),
        Status: report.status ? "Approved" : "Pending",
        "Created By": "",
      })),
      ...subordinateReports.map((report) => ({
        Title: report.title,
        Level: report.level,
        "Created Date": new Date(report.created_date).toLocaleString(),
        Status: report.status ? "Approved" : "Pending",
        "Created By": report.created_by.phone,
      })),
    ];

    downloadPDF(allData, "AllReports");
  };

  // Download all data in Excel
  const downloadAllExcel = () => {
    const allData = [
      ...reports.map((report) => ({
        Title: report.title,
        Level: report.level,
        "Created Date": new Date(report.created_date).toLocaleString(),
        Status: report.status ? "Approved" : "Pending",
        "Created By": "",
      })),
      ...subordinateReports.map((report) => ({
        Title: report.title,
        Level: report.level,
        "Created Date": new Date(report.created_date).toLocaleString(),
        Status: report.status ? "Approved" : "Pending",
        "Created By": report.created_by.phone,
      })),
    ];

    downloadExcel(allData, "AllReports");
  };

  return (
    <div>
      {/* <h1 className="text-center text-black font-bold text-xl capitalize mb-4">
        Reports
      </h1> */}
      <div className="flex justify-end mb-4">
        <Link
          to="/departement/createreport"
          className="px-4 py-1 rounded-lg bg-black text-white"
        >
          Create report
        </Link>
      </div>

      {/* Section for reports created by the HOD */}
      <h2 className="text-center text-black font-bold text-lg capitalize mb-4">
        My Reports
      </h2>
      <div className="mb-4 flex flex-auto">
        {/* <input
          type="text"
          placeholder="Search reports..."
          value={reportSearch}
          onChange={handleSearchReports}
          className="px-4 py-2 border rounded-lg w-1/6 mb-2"
        /> */}
        <div className="row-end-auto justify-end">
          <button
            onClick={() => downloadPDF(filteredReports, "MyReports")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
          >
            Download PDF
          </button>
          <button
            onClick={() => downloadExcel(filteredReports, "MyReports")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Download Excel
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Level
              </th>
              <th scope="col" className="px-6 py-3">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr
                  key={report.id}
                  className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {report.title}
                  </th>
                  <td className="px-6 py-4">{report.level}</td>
                  <td className="px-6 py-4">
                    {new Date(report.created_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {report.status ? "Approved" : "Pending"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowDetails(report.id)}
                      className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                      Explore
                    </button>
                    <Link
                      to={`/departement/editReport/${report.id}`}
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
                    {/* {!report.status && (
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700 ml-2"
                      >
                        Approve
                      </button>
                    )} */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-500 text-gray-700 rounded-lg"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={indexOfLastReport >= reports.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* Section for reports created by subordinates */}
      <h2 className="text-center text-black text-lg capitalize font-bold mb-4">
        Subordinate Reports
      </h2>
      <div className="mb-4 flex">
        {/* <input
          type="text"
          placeholder="Search subordinate reports..."
          value={subordinateSearch}
          onChange={handleSearchSubordinateReports}
          className="px-4 py-2 border text-gray-700 rounded-lg w-1/6 mb-2"
        /> */}
        <div className="row-auto justify-end">
          <button
            onClick={() =>
              downloadPDF(filteredSubordinateReports, "SubordinateReports")
            }
            className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
          >
            Download PDF
          </button>
          <button
            onClick={() =>
              downloadExcel(filteredSubordinateReports, "SubordinateReports")
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Download Excel
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Level
              </th>
              <th scope="col" className="px-6 py-3">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Created By
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubordinateReports.length > 0 ? (
              currentSubordinateReports.map((report) => (
                <tr
                  key={report.id}
                  className="odd:bg-white odd:dark:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {report.title}
                  </th>
                  <td className="px-6 py-4">{report.level}</td>
                  <td className="px-6 py-4">
                    {new Date(report.created_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {report.status ? "Approved" : "Pending"}
                  </td>
                  <td className="px-6 py-4">{report.created_by.phone}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowDetails(report.id)}
                      className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                      Explore
                    </button>
                    {/* <Link
                      to={`/departement/editReport/${report.id}`}
                      className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-700 ml-2"
                    >
                      Edit
                    </Link> */}
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700 ml-2"
                    >
                      Delete
                    </button>
                    {!report.status && (
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700 ml-2"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={indexOfLastSubordinateReport >= subordinateReports.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-500 text-gray-600 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for showing report details */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-50 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{selectedReport.title}</h3>
            <p className="text-gray-500">
              <strong>Level:</strong> {selectedReport.level}
            </p>
            <p className="text-gray-500">
              <strong>Created Date:</strong>{" "}
              <span className="text-red-600">
                {new Date(selectedReport.created_date).toLocaleString()}
              </span>{" "}
            </p>
            <p className="text-gray-500">
              <strong>Status:</strong>{" "}
              {selectedReport.status ? "Approved" : "Pending"}
            </p>
            <p className="text-gray-500">
              <strong>Description:</strong> <br />{" "}
              <span className="text-sm">{selectedReport.description}</span>{" "}
            </p>
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 mt-4 text-white bg-gray-500 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DipartmentReport;
