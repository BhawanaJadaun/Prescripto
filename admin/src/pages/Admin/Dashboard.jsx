import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import doctor_icon from "../../../assets_admin/doctor_icon.svg";
import appointment_icon from "../../../assets_admin/appointments_icon.svg";
import patient_icon from "../../../assets_admin/patients_icon.svg";
import list_icon from "../../../assets_admin/list_icon.svg";
import cancel_icon from "../../../assets_admin/cancel_icon.svg"; // Import cancel icon
import {AppContext} from "../../context/AppContext.jsx"

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
const {slotDateFormat} = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          {/* Doctors Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={doctor_icon} alt="Doctors" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={appointment_icon} alt="Appointments" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={patient_icon} alt="Patients" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white mt-10">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={list_icon} alt="List Icon" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-100"
              >
                <img
                  src={item.docData.image}
                  alt={item.docData.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600 text-sm">{slotDateFormat(item.slotDate)}</p>
                </div>
                {
              item.cancelled
             ? <p className = "text-red-400 text-xs font-medium">Cancelled</p>
              : item.isCompleted
              ? <p className = "text-green-400 text-xs font-medium">Completed</p>
              : <img onClick = {()=>cancelAppointment(item.id)} src="" alt="" className = "w-10 cursor-pointer"/>
            }
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
