/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function Home() {
  const [userData, setUserData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Users Created per Week',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      }
    ]
  });
  const [roleCounts, setRoleCounts] = useState({
    unitUser: 0,
    headOfDivision: 0,
    headOfDepartment: 0
  });
  const [reportCountsByLevel, setReportCountsByLevel] = useState({
    unit: 0,
    division: 0,
    department: 0
  });
  const [reportStatusCounts, setReportStatusCounts] = useState({
    approved: 0,
    pending: 0
  });
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'],
      }
    ]
  });
  const [reportStatusPieData, setReportStatusPieData] = useState({
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        data: [],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      }
    ]
  });

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

      const usersRes = await axios.get('https://rra-report-management-system-backend.onrender.com/users/', config);
      if (usersRes.data) {
        setUserData(usersRes.data);
        calculateWeeklyData(usersRes.data);
        calculateRoleCounts(usersRes.data);
      } else {
        console.log("Error listing users");
      }

      const reportsRes = await axios.get('https://rra-report-management-system-backend.onrender.com/report/reports/', config);
      if (reportsRes.data) {
        setReportsData(reportsRes.data);
        calculateReportCountsByLevel(reportsRes.data);
        calculatePieData(reportsRes.data);
        calculateReportStatusCounts(reportsRes.data);
      } else {
        console.log("Error listing reports");
      }
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const calculateWeeklyData = (users) => {
    const weeks = {};
    users.forEach(user => {
      const createdAt = new Date(user.created_at);
      const year = createdAt.getFullYear();
      const week = getWeekNumber(createdAt);
      const key = `${year}-W${week}`;

      if (!weeks[key]) {
        weeks[key] = 0;
      }
      weeks[key]++;
    });

    const sortedWeeks = Object.keys(weeks).sort((a, b) => {
      const [aYear, aWeek] = a.split('-W').map(Number);
      const [bYear, bWeek] = b.split('-W').map(Number);
      return aYear === bYear ? aWeek - bWeek : aYear - bYear;
    });

    const data = {
      labels: sortedWeeks,
      datasets: [{
        label: 'Users Created per Week',
        data: sortedWeeks.map(week => weeks[week]),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      }]
    };
    setWeeklyData(data);
  };

  const calculateRoleCounts = (users) => {
    const counts = {
      unitUser: 0,
      headOfDivision: 0,
      headOfDepartment: 0
    };

    users.forEach(user => {
      if (user.role === 'unit user') counts.unitUser++;
      else if (user.role === 'head of division') counts.headOfDivision++;
      else if (user.role === 'head of department') counts.headOfDepartment++;
    });

    setRoleCounts(counts);
  };

  const calculateReportCountsByLevel = (reports) => {
    const counts = {
      unit: 0,
      division: 0,
      department: 0
    };

    reports.forEach(report => {
      if (report.level === 'unit') counts.unit++;
      else if (report.level === 'division') counts.division++;
      else if (report.level === 'department') counts.department++;
    });

    setReportCountsByLevel(counts);
  };

  const calculatePieData = (reports) => {
    const counts = {
      unit: 0,
      division: 0,
      department: 0
    };

    reports.forEach(report => {
      if (report.level === 'unit') counts.unit++;
      else if (report.level === 'division') counts.division++;
      else if (report.level === 'department') counts.department++;
    });

    const data = {
      labels: ['Unit', 'Division', 'Department'],
      datasets: [{
        data: [counts.unit, counts.division, counts.department],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'],
      }]
    };
    setPieData(data);
  };

  const calculateReportStatusCounts = (reports) => {
    const counts = {
      approved: 0,
      pending: 0
    };

    reports.forEach(report => {
      if (report.status) counts.approved++;
      else counts.pending++;
    });

    const data = {
      labels: ['Approved', 'Pending'],
      datasets: [{
        data: [counts.approved, counts.pending],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      }]
    };
    setReportStatusPieData(data);
  };

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + days) / 7);
  };

  const histogramData = {
    labels: ['Unit', 'Division', 'Department'],
    datasets: [
      {
        label: 'Reports by Level',
        data: [reportCountsByLevel.unit, reportCountsByLevel.division, reportCountsByLevel.department],
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className='mt-20'>
      <h1 className='text-center text-black text-xl font-bold capitalize mb-4'>Dashboard</h1>

      <div className='flex justify-around mb-4'>
        <div className='px-4 py-2 rounded-lg bg-gray-200 text-center'>
          <h2 className='text-lg font-bold text-gray-700'>Unit Users</h2>
          <p className='text-yellow-600 font-bold'>{roleCounts.unitUser}</p>
        </div>
        <div className='px-4 py-2 rounded-lg bg-gray-200 text-center'>
          <h2 className='text-lg font-bold text-gray-700'>Heads of Division</h2>
          <p className='text-green-500 font-bold'>{roleCounts.headOfDivision}</p>
        </div>
        <div className='px-4 py-2 rounded-lg bg-gray-200 text-center'>
          <h2 className='text-lg font-bold text-gray-700'>Heads of Department</h2>
          <p className='text-blue-700 font-bold'>{roleCounts.headOfDepartment}</p>
        </div>
      </div>

      <div className='flex justify-around'>
        <div className='w-2/5'>
          <h2 className='text-lg font-bold text-gray-700 text-center mb-2'>Reports by Level</h2>
          <Bar data={histogramData} />
        </div>
        <div className='w-2/2'>
          <h2 className='text-lg font-bold text-gray-700 text-center mb-2'>Reports by Status</h2>
          <Pie data={reportStatusPieData} />
        </div>
      </div>

      <div className='w-4/5 mx-auto mt-6'>
        <h2 className='text-lg font-bold text-gray-700 text-center mb-2'>Users Created per Week</h2>
        <Line data={weeklyData} />
      </div>
    </div>
  );
}

export default Home;
