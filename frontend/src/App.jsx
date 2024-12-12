import { useState } from 'react'
import{Route,Routes} from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Doctor from "./pages/Doctor.jsx"
import Login from "./pages/Login.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import MyProfile from "./pages/MyProfile.jsx"
import MyAppointments from "./pages/MyAppointments.jsx"
import Appointment from "./pages/Appointment.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  

  return (
    <>
   
     <div className="mx-4 sm:mx-[6%]">
     <Navbar/>
   
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/doctors' element = {<Doctor/>}/>
        <Route path = '/doctors/:speciality' element = {<Doctor/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/about' element = {<About/>}/>
        <Route path = '/contact' element = {<Contact/>}/>
        <Route path = '/my-profile' element = {<MyProfile/>}/>
        <Route path = '/my-appointments' element = {<MyAppointments/>}/>
        <Route path='/appointment/:docId' element={<Appointment />} />



      </Routes>
      <Footer/>
      <ToastContainer />
     </div>
    </>
  )
}

export default App
