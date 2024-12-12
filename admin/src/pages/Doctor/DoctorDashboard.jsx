import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import earning_icon from "../../../assets_admin/earning_icon.svg";
import appointment_icon from "../../../assets_admin/appointments_icon.svg";
import patient_icon from "../../../assets_admin/patients_icon.svg";
import list_icon from "../../../assets_admin/list_icon.svg";
import cancel_icon from "../../../assets_admin/cancel_icon.svg";
import ticket_icon from "../../../assets_admin/tick_icon.svg"


const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken, getDashData]);

  if (!dashData) {
    return <p className="text-gray-500 text-center">Loading dashboard data...</p>;
  }

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        {/* Earnings Card */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={earning_icon} alt="Earnings" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency} {dashData.earnings}
            </p>
            <p className="text-gray-400">Earnings</p>
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
          {dashData.latestAppointments?.length ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-100"
              >
                <img
                  src={item.userData.image || defaultUserImage}
                  alt={item.userData.name || "User"}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.userData.name || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {slotDateFormat(item.slotDate) || "N/A"}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex">
                    <img
                      className="w-8 cursor-pointer"
                      src={cancel_icon}
                      alt="Cancel Appointment"
                      title="Cancel Appointment"
                      onClick={() => cancelAppointment(item._id)}
                    />
                    <img
                      className="w-8 cursor-pointer"
                      src={ticket_icon}
                      alt="Complete Appointment"
                      title="Complete Appointment"
                      onClick={() => completeAppointment(item._id)}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 px-4 py-2">No recent bookings available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;



