
import React from "react";
import group_profiles from "../assets/assets_frontend/group_profiles.png";
import arrow_icon from "../assets/assets_frontend/arrow_icon.svg";
import Header_img from "../assets/assets_frontend/header_img.png"
const Header = () => {
  return (
    <div className = "flex flex-col md:flex-row flex-wrap bg-indigo-600 rounded-lg px-6 md:px-10">
      {/* Left Side  */}
      <div className = "md:w-1/2 flex flex-col items-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className = "text-2xl md:text-3xl lg:text-4xl text-white font-semibold leading-tight md:leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className = "flex flex-col md:flex-row items-center gap-3 text-white text-sm">
          <img src={group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className = "hidden sm:block"/>
            schedule your appointment hassle-free.
          </p>
        </div>
        <a href="#speciality" className = "flex items-center gap-2 bg-white px-8 py-3 rounded-full  text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">
          Book appointments
          <img src={arrow_icon} alt="" />
        </a>
      </div>

      {/* Right Side */}
      <div className = "md:w-1/2 relative">
  <img src={Header_img} alt="" className= "w-full md:absolute bottom-0 h-auto rounded-lg"/>
      </div>
    </div>
  );
};

export default Header;
