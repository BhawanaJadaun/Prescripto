import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import cancel_icon from "../../../assets_admin/cancel_icon.svg";
import ticket_icon from "../../../assets_admin/tick_icon.svg";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken, getAppointments]);

  if (!appointments) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b ">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.length === 0 ? (
          <p className="text-center py-5 text-gray-500">
            No appointments available
          </p>
        ) : (
          appointments
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-200"
                key={item._id || index}
              >
                <p>{index + 1}</p>
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 rounded-full"
                    src={item.userData.image || "default-image-path.png"}
                    alt={item.userData.name || "Unknown User"}
                  />
                  <p>{item.userData.name || "Unknown Name"}</p>
                </div>
                <div>
                  <p className="text-xs inline border border-primary px-2 rounded-full">
                    {item.payment ? "Online" : "CASH"}
                  </p>
                </div>
                <p className="max-sm:hidden">
                  {calculateAge(item.userData.dob)}
                </p>
                <p>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
                <p>
                  {currency}
                  {item.amount}
                </p>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    completed
                  </p>
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
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
