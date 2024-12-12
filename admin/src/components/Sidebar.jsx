import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { NavLink } from "react-router-dom";
import home_icon from "../../assets_admin/home_icon.svg";
import appointment_icon from "../../assets_admin/appointment_icon.svg";
import add_icon from "../../assets_admin/add_icon.svg";
import people_icon from "../../assets_admin/people_icon.svg";
import { DoctorContext } from "../context/DoctorContext.jsx";
const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className="min-h-screen bg-white border-r w-[200px]">
      {" "}
      {/* Adjusted width */}
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={home_icon} alt="Dashboard" />
            <p className = 'hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={appointment_icon} alt="Appointment" />
            <p className = 'hidden md:block'>Appointments</p>
          </NavLink>
          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={add_icon} alt="Add Doctor" />
            <p className = 'hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink
            to="/doctors-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={people_icon} alt="Doctors List" />
            <p>Doctors List</p>
          </NavLink>
        </ul>


      )}
      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to={"/doctors-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={home_icon} alt="Dashboard" />
            <p className = 'hidden md:block'>Dashboard</p>
          </NavLink>
          <NavLink
            to={"/doctors-appointments"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={appointment_icon} alt="Appointment" />
            <p className = 'hidden md:block'>Appointments</p>
          </NavLink>
      
          <NavLink
            to={"/doctors-profile"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-2 md:px-4 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={people_icon} alt="Doctors List" />
            <p className = 'hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
