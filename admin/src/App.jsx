import React, { useContext } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointments from "./pages/Admin/AllAppointment.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";
import "./App.css";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      {/* Logged-in content */}
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctors-list" element={<DoctorsList />} />

          {/* Doctor Routes */}
          <Route path="/doctors-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctors-appointments" element={<DoctorAppointment />} />
          <Route path="/doctors-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
