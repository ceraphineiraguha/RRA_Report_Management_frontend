/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from "chart.js";
import "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UnitDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [userReports, setUserReports] = useState([]);
  const [totalUserReports, setTotalUserReports] = useState(0);
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchReports = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const accessToken = userData?.accessToken;
      const userId = userData?.id;

      if (!accessToken || !userId) {
        console.error("No access token or user ID found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Fetch reports created by the HOD
      const userRes = await axios.get(
        `https://rra-report-management-system-backend.onrender.com/report/reports/by_creator/${userId}/`,
        config
      );
      setUserReports(userRes.data);
      setTotalUserReports(userRes.data.length); // Set total reports by user

      // Process the data for charts
      processReports(userRes.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  const processReports = (userReports) => {
    const currentMonth = new Date().getMonth();
    const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate();

    const userMonthlyData = Array(daysInMonth).fill(0);
    const pendingData = Array(daysInMonth).fill(0);
    const approvedData = Array(daysInMonth).fill(0);

    userReports.forEach((report) => {
      const reportDate = new Date(report.created_date);
      if (reportDate.getMonth() === currentMonth) {
        const day = reportDate.getDate() - 1;
        userMonthlyData[day]++;
        if (report.status_display === "pending") {
          pendingData[day]++;
        } else if (report.status_display === "approved") {
          approvedData[day]++;
        }
      }
    });

    setLineData({
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets: [
        {
          label: "User Reports",
          data: userMonthlyData,
          borderColor: "rgba(53, 162, 235, 0.5)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          fill: false,
          tension: 0.1,
        },
      ],
    });

    setBarData({
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      datasets: [
        {
          label: "Pending Reports",
          data: pendingData,
          backgroundColor: "rgba(255, 206, 86, 0.5)",
        },
        {
          label: "Approved Reports",
          data: approvedData,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="mt-20">
      <h1 className="text-center text-black text-xl font-bold capitalize mb-4">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Reports Created by You */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl text-gray-700 font-bold mb-2">
            Total Reports Created by You
          </h2>
          <p className="text-3xl text-green-400 font-semibold">
            {totalUserReports}
          </p>
        </div>

        {/* Monthly Report Trends */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl text-gray-700 font-bold mb-2">
            Monthly Report Trends
          </h2>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.raw}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Reports",
                  },
                },
              },
            }}
          />
        </div>

        {/* Reports by Status */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl text-gray-700 font-bold mb-2">
            User Created Reports by Status
          </h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `${context.dataset.label}: ${context.raw}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Reports",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitDashboard;
