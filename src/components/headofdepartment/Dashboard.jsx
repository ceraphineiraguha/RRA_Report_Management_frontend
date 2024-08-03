/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DepartmentDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [userReports, setUserReports] = useState([]);
  const [subordinateReports, setSubordinateReports] = useState([]);
  const [reportData, setReportData] = useState({
    labels: [],
    datasets: []
  });
  const [reportCounts, setReportCounts] = useState({ userReports: 0, subordinateReports: 0 });

  const fetchUserCount = async () => {
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

      // Fetch user count
      const res = await axios.get('https://rra-report-management-system-backend.onrender.com/created-users/', config);
      if (Array.isArray(res.data)) {
        setUserCount(res.data.length);
      } else {
        console.error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching user count", err);
    }
  };

  const fetchReports = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      const accessToken = userData?.accessToken;
      const userId = userData?.id;

      if (!accessToken || !userId) {
        console.error("No access token or user ID found");
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      // Fetch reports created by the HOD
      const userRes = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/by_creator/${userId}/`, config);
      setUserReports(userRes.data);

      // Fetch reports created by the HOD's subordinates
      const subordinateRes = await axios.get(`https://rra-report-management-system-backend.onrender.com/report/reports/by_subordinates/${userId}/`, config);
      setSubordinateReports(subordinateRes.data);

      // Process the data for charts
      processReports(userRes.data, subordinateRes.data);

    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  const processReports = (userReports, subordinateReports) => {
    const currentMonth = new Date().getMonth();
    const userMonthlyData = Array(31).fill(0);
    const subordinateMonthlyData = Array(31).fill(0);

    userReports.forEach(report => {
      const reportDate = new Date(report.created_date);
      if (reportDate.getMonth() === currentMonth) {
        userMonthlyData[reportDate.getDate() - 1]++;
      }
    });

    subordinateReports.forEach(report => {
      const reportDate = new Date(report.created_date);
      if (reportDate.getMonth() === currentMonth) {
        subordinateMonthlyData[reportDate.getDate() - 1]++;
      }
    });

    setReportData({
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      datasets: [
        {
          label: 'User Reports',
          data: userMonthlyData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Subordinate Reports',
          data: subordinateMonthlyData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    });

    setReportCounts({
      userReports: userReports.length,
      subordinateReports: subordinateReports.length
    });
  };

  useEffect(() => {
    fetchUserCount();
    fetchReports();
  }, []);

  return (
    <div className='mt-20'>
      <h1 className='text-center text-black text-xl font-bold capitalize mb-4'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-xl text-gray-700 font-bold mb-2'>Total Users Created</h2>
          <p className='text-3xl text-yellow-400 font-semibold'>{userCount}</p>
        </div>

        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-xl text-gray-700 font-bold mb-2'>Reports Overview</h2>
          <Pie
            data={{
              labels: ['User Created Reports', 'Subordinate Created Reports'],
              datasets: [{
                data: [reportCounts.userReports || 0, reportCounts.subordinateReports || 0],
                backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
              }]
            }}
            options={{ responsive: true }}
          />
        </div>

        <div className='bg-white shadow-md rounded-lg p-4'>
          <h2 className='text-xl text-gray-700 font-bold mb-2'>Monthly Report Trends</h2>
          <Bar
            data={reportData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Reports'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
