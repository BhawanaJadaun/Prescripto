import { useState ,useContext} from "react";
import logo from "../assets/assets_frontend/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import profile_pic from "../assets/assets_frontend/profile_pic.png";
import drop_icon from "../assets/assets_frontend/dropdown_icon.svg";
import menu_icon from "../assets/assets_frontend/menu_icon.svg";
import cross_icon from "../assets/assets_frontend/cross_icon.png";
import {AppContext} from "../context/AppContext.jsx"

const Navbar = () => {
  const navigate = useNavigate();
  const{token,setToken,userData} = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false);
  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="Logo"
        className="w-44 cursor-pointer"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-indigo-500 w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img src={userData.image} alt="" className="w-8 rounded-full" />
            <img src={drop_icon} alt="" className="w-2.5" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={menu_icon}
          alt=""
        />
        {/* Mobile_menu */}
        <div className = {`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className = "flex items-center justify-between px-5 py-6">
            <img className = "w-36" onClick={() => setShowMenu(true)} src={logo} alt="" />
            <img className = "w-7" onClick={() => setShowMenu(false)} src={cross_icon} alt="" />
          </div>
          <ul className = "flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick = {()=>setShowMenu(false)} to = '/'><p className = 'px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick = {()=>setShowMenu(false)}to = '/doctors'><p  className = 'px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>      
            <NavLink  onClick = {()=>setShowMenu(false)}to = '/about'><p  className = 'px-4 py-2 rounded inline-block'>About</p></NavLink>
            <NavLink onClick = {()=>setShowMenu(false)} to = '/contact'><p className = 'px-4 py-2 rounded inline-block'>Contact</p></NavLink>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
