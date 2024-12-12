import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: localProfile.address,
        fees: localProfile.fees,
        available: localProfile.available,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken, getProfileData]);

  useEffect(() => {
    // Initialize local state with profileData when it's available
    if (profileData) {
      setLocalProfile(profileData);
    }
  }, [profileData]);

  if (!localProfile) {
    return <p className="text-gray-500 text-center">Loading profile data...</p>;
  }

  return (
    <div className="p-5">
      <div className="flex flex-col sm:flex-row gap-5 bg-white rounded-lg shadow-lg p-6">
        {/* Doctor Image */}
        <div className="flex-shrink-0">
          <img
            className="bg-primary/80 w-full sm:w-64 rounded-lg object-cover"
            src={localProfile.image}
            alt={`${localProfile.name}'s profile`}
          />
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          {/* Name, Degree, Experience */}
          <div className="border-b pb-4 mb-4">
            <p className="text-3xl font-medium text-gray-700">
              {localProfile.name}
            </p>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <p className="text-lg">
                {localProfile.degree} - {localProfile.speciality}
              </p>
              <span className="py-1 px-3 bg-primary/10 text-primary text-xs rounded-full">
                {localProfile.experience} years experience
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800">About:</p>
            <p className="text-gray-600 mt-1">{localProfile.about}</p>
          </div>

          {/* Appointment Fee */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800 inline">
              Appointment Fee:
            </p>
            <p className="text-gray-600 inline ml-2">
              <span className="font-bold text-primary">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setLocalProfile({ ...localProfile, fees: e.target.value })
                    }
                    value={localProfile.fees}
                    className="ml-1 border border-gray-300 rounded px-1"
                  />
                ) : (
                  localProfile.fees
                )}
              </span>
            </p>
          </div>

          {/* Address */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800 inline">Address:</p>
            <p className="text-gray-600 inline ml-2">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        address: {
                          ...localProfile.address,
                          line1: e.target.value,
                        },
                      })
                    }
                    value={localProfile.address.line1}
                    className="ml-1 border border-gray-300 rounded px-1"
                  />
                  <input
                    type="text"
                    onChange={(e) =>
                      setLocalProfile({
                        ...localProfile,
                        address: {
                          ...localProfile.address,
                          line2: e.target.value,
                        },
                      })
                    }
                    value={localProfile.address.line2}
                    className="ml-1 border border-gray-300 rounded px-1"
                  />
                </>
              ) : (
                <>
                  {localProfile.address.line1}, {localProfile.address.line2}
                </>
              )}
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="availability"
              name="availability"
              className="w-5 h-5 accent-primary"
              checked={localProfile.available}
              onChange={(e) =>
                isEdit &&
                setLocalProfile({
                  ...localProfile,
                  available: e.target.checked,
                })
              }
            />
            <label htmlFor="availability" className="text-gray-700">
              Available
            </label>
          </div>

          {isEdit ? (
            <button
              onClick={updateProfile}
              className="w-full sm:w-auto bg-primary text-white py-2 px-4 rounded shadow hover:bg-primary/90 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="w-full sm:w-auto bg-primary text-white py-2 px-4 rounded shadow hover:bg-primary/90 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
