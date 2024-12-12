import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData,setdashData] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // console.log("Admin token:", aToken); // Debugging
    localStorage.setItem("aToken", aToken);
  }, [aToken]);

  const getAllAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
  
      console.log("Appointments Response:", response.data); // Debugging
      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      } else {
        toast.error(response.data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error); // Log full error
      toast.error(
        error.response?.data?.message || 
        "An error occurred while fetching appointments."
      );
    }
  };
  
  const getAllDoctors = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const data = response.data;

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const changeAvailablitiy = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc.id === docId ? { ...doc, available: !doc.available } : doc
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
      console.log(error);
      
    }
  };
  
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
  
      if (data.success) {
        setdashData(data.message); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    appointments,
    getAllDoctors,
    changeAvailablitiy,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;

