import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import jwt from "jsonwebtoken" // Importing file system module to manage files

// API for admin to add doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // Debug log to check if req.file is present
    console.log("Image File:", imageFile);

    // Check if the image file exists
    if (!imageFile) {
      return res.json({ success: false, message: "Image file is missing" });
    }

    // Check for all required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a Valid Email",
      });
    }

    // Validate strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    // Hash doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload the image to Cloudinary using the file path
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // Debug log to check the result of the Cloudinary upload
    console.log("Cloudinary Upload Result:", imageUpload);

    // Build the doctor data object
    const doctorData = {
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address), // Assuming address is sent as a JSON string
      date: Date.now(),
    };

    // Save new doctor data to the database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Optionally, remove the temporary file after uploading to Cloudinary
    fs.unlinkSync(imageFile.path); // This deletes the local file after upload

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }
}
// API for admin login
const loginAdmin = async(req,res)=>{
  try {
    const{email,password} = req.body
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
}
// API to get all doctors list for admin panel
const allDoctors = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}
// API to get all appointment list
const appointmentAdmin = async(req,res)=>{
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}
// API for appointment cancellation
const appointmentCancel = async(req,res)=>{
  try {
    const{appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    // realeasing doctor slot 
    const{docId,slotDate,slotTime} = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] =  slots_booked[slotDate].filter(e=>e!==slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:'Appointment Cancelled'})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    
    res.json({ success: true, message: dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error.message);
  }
};


export { addDoctor,loginAdmin ,allDoctors,appointmentAdmin,appointmentCancel,adminDashboard};
