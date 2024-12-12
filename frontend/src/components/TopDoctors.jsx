import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 w-full max-w-xs mx-auto"
            key={index}
          >
            {/* Fix image size and aspect ratio */}
            <div className="h-48 w-full overflow-hidden">
              <img
                className="bg-blue-50 w-full h-full object-cover"
                src={item.image}
                alt={item.name}
              />
            </div>
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  isAvailable ? "text-green-500" : "text-gray-500"
                }`}
                aria-label={`Status: ${
                  isAvailable ? "Available" : "Not Available"
                }`}
              >
                <p
                  className={`w-2 h-2 ${
                    isAvailable ? "bg-green-500" : "bg-gray-500"
                  } rounded-full`}
                >
                <p>{isAvailable ? "Available" : "Not Available"}</p></p>
              </div>

              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-900 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  );
};

export default RelatedDoctors;
