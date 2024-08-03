/* eslint-disable no-unused-vars */
// src/App.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Layout from "./components/admin/Layout.jsx";
import Home from './components/pages/Home.jsx';
import Users from './components/admin/pages/Users.jsx';
import Pdf from './components/pages/Pdf.jsx';
import Excell from './components/pages/Excell.jsx';
import Unity_User_Layout from './components/unityuser/Unity_User_Layout.jsx'
import UnityReport from "./components/unityuser/pages/UnityReport.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import CreateUnityReport from "./components/unityuser/pages/CreateUnityReport.jsx";
import AdminReports from "./components/admin/pages/AdminReports.jsx";
import CreateUser from "./components/admin/pages/CreateUser.jsx";
import Dipartiment_Layout from "./components/headofdepartment/Dipartiment_Layout.jsx";
import DipartmentReport from "./components/headofdepartment/pages/DipartmentReport.jsx";
import CreateDipartimentReport from "./components/headofdepartment/pages/CreateDipartimentReport.jsx";
import Division_Layout from "./components/headofdivision/division_User_Layout.jsx";
import CreateDivisionReport from "./components/headofdivision/pages/CreateDivisionReport.jsx";
import DivisionReport from "./components/headofdivision/pages/DivisionReport.jsx";
import UpdateUser from "./components/admin/pages/UpdateUser.jsx";
import Users_All from "./components/headofdepartment/pages/Users_all.jsx";
import AddUser from "./components/headofdepartment/pages/AddUser.jsx";
import AllUsers from "./components/headofdivision/pages/AllUsers.jsx";
import Add_User from "./components/headofdivision/pages/Add_User.jsx";
import GetReport from "./components/admin/pages/GetReport.jsx";
import UnitUserEditReport from "./components/unityuser/pages/EditReport.jsx";
import DepartmentEditReport from "./components/headofdepartment/pages/EditReport.jsx";
import DeaprtmentDashboard from "./components/headofdepartment/Dashboard.jsx";
import DivisionDashboard from "./components/headofdivision/DivisionDashboard.jsx";
import UnitDashboard from "./components/unityuser/UnitDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";


const App = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in",
      delay: 100,
    });

    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-black dark:text-white text-black overflow-x-hidden">
      <BrowserRouter>
        <Routes>

          {/* Home view */}
          <Route path="/" element={<MainLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/passwordreset" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/pdf" element={<Pdf />} />
            <Route path="/admin/excel" element={<Excell />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/createuser" element={<CreateUser />} />
            <Route path="/admin/edituser/:id" element={<UpdateUser />} />
            <Route path="/admin/viewreport/:id" element={<GetReport />} />
          </Route>

          <Route path="/unityuser" element={<ProtectedRoute><Unity_User_Layout /></ProtectedRoute>}>
            <Route index element={<UnitDashboard />} />
            <Route path="/unityuser/reports" element={<UnityReport />} />
            <Route path="/unityuser/createreport" element={<CreateUnityReport />} />
            <Route path="/unityuser/editreport/:reportId" element={<UnitUserEditReport />} />
          </Route>

          <Route path="/departement" element={<ProtectedRoute><Dipartiment_Layout /></ProtectedRoute>}>
            <Route index element={<DeaprtmentDashboard />} />
            <Route path="/departement/report" element={<DipartmentReport />} />
            <Route path="/departement/createreport" element={<CreateDipartimentReport />} />
            <Route path="/departement/allusers" element={<Users_All />} />
            <Route path="/departement/adduser" element={<AddUser />} />
            <Route path="/departement/editReport/:reportId" element={<DepartmentEditReport />} />
          </Route>

          <Route path="/division" element={<ProtectedRoute><Division_Layout /></ProtectedRoute>}>
            <Route index element={<DivisionDashboard />} />
            <Route path="/division/createreport" element={<CreateDivisionReport />} />
            <Route path="/division/divisionreport" element={<DivisionReport />} />
            <Route path="/division/all_users" element={<AllUsers />} />
            <Route path="/division/add_user" element={<Add_User />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
