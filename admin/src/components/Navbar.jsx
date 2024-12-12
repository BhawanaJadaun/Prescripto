import React,{useContext} from "react"
import admin_logo from "../../assets_admin/admin_logo.svg"
import {AdminContext} from "../context/AdminContext.jsx"
import {DoctorContext} from "../context/DoctorContext.jsx"
const Navbar = () => {
const{aToken,setAToken} = useContext(AdminContext)
const{dToken,setDToken} = useContext(DoctorContext)
const logout = () =>{
aToken && setAToken('')
aToken && LocalStorage.removeItem('aToken')
dToken && setDToken('')
dToken && LocalStorage.removeItem('dToken')
}
  return (
    <div className = "flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className = "flex items-center gap-2 text-xs">
        <img className = "w-36 sm:w-40 cursor-pointer "src={admin_logo} alt="Admin Logo" />
        <p className = "border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick = {logout} className = "bg-primary text-white text-sm px-10  py-2 rounded-full">Logout</button>
    </div>
  );
};

export default Navbar;
