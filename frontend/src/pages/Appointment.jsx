import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import verified_icon from "../assets/assets_frontend/verified_icon.svg";
import info_icon from "../assets/assets_frontend/info_icon.svg";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [doctInfo, setDocInfo] = useState(null);
  const [doctSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    if (docInfo) {
      setDocInfo(docInfo);
    } else {
      toast.error("Doctor not found.");
      navigate("/doctors"); // Redirect to a doctors list
    }
  };

  const getAvailableSlots = async () => {
    if (!doctInfo) return;
  
    const slots = [];
    const today = new Date();
  
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // End time: 9 PM
  
      // Adjust starting time for today
      if (i === 0) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0); // Start time: 10 AM
      }
  
      const timeSlots = [];
  
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Correct month
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        
        try {
          // Check slot availability
          const { data } = await axios.post(
            `${backendUrl}/api/user/check-slot-availability`, 
            { docId, slotDate, slotTime: formattedTime },
            { headers: { Authorization: `Bearer ${token}` } }
          );
  
          // Add slot to the array
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
            available: data.success, // True if slot is available
          });
  
        } catch (error) {
          console.error(`Error checking slot ${formattedTime} on ${slotDate}:`, error.message);
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
            available: false, // Mark as unavailable if an error occurs
          });
        }
  
        // Increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
  
      slots.push(timeSlots);
    }
  
    setDocSlots(slots); // Update state with collected slots
    console.log("Available Slots:", slots);
  };
  
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book an appointment.");
      return navigate("/login");
    }

    try {
      const date = doctSlots[slotIndex][0]?.dateTime;
      if (!date) {
        toast.error("Invalid date selected.");
        return;
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors && docId) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (doctInfo) {
      getAvailableSlots();
    }
  }, [doctInfo]);

  return (
    doctInfo ? (
      <>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Doctor's Details */}
          <div>
            <img className="bg-indigo-700 w-full sm:max-w-72 rounded-lg" src={doctInfo.image} alt={`${doctInfo.name}`} />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-10 mt-[-80px] sm:mt-0">
            {/* Doc Info: name, degree, experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{doctInfo.name}
              <img className="w-5" src={verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{doctInfo.degree} - {doctInfo.speciality}</p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{doctInfo.experience} years</button>
            </div>
            {/* Doctor about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About
                <img src={info_icon} alt="info-icon" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{doctInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium">
              Appointment fee: <span className="text-gray-600">{currencySymbol}{doctInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {doctSlots.length > 0 && doctSlots.map((item, index) => (
              <div 
                onClick={() => setSlotIndex(index)} 
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-indigo-700 text-white' : 'border border-gray-200'}`} 
                key={index}
              >
                <p>{item[0] && daysofWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {doctSlots.length > 0 && doctSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-indigo-700 text-white' : 'text-gray-600 border border-gray-300'}`} 
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <div>
        <button onClick = {bookAppointment} className = "bg-indigo-600 hover:bg-indigo-800 text-white text-sm font-light px-14 py-3 rounded-full mt-8">Book an appointment</button>
        </div>
<RelatedDoctors docId = {docId} speciality = {doctInfo.speciality}/>
      </>
    ) : <p>Loading doctor info...</p>
  );
};

export default Appointment;
