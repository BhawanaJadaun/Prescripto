import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay"
// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Save new user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Return success response
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!userId || !name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

    // Handle image upload if provided
    if (imageFile) {
      try {
        // Upload image to cloundinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const imageURL = imageUpload.secure_url
        await userModel.findByIdAndUpdate(userId,{image:imageURL})
      } catch (error) {
       console.log(error);
       res.json({success:false,message:error.message});
      }
      res.json({success:true,message:"Profile Updated"})
    }

    // Update the user in the database
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile Updated", user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "Missing appointment details",
      });
    }

    const userData = await userModel.findById(userId).select("-password");
    const docData = await doctorModel.findById(docId);

    if (!docData || !docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const slotsBooked = docData.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    // Book the slot
    if (!slotsBooked[slotDate]) slotsBooked[slotDate] = [];
    slotsBooked[slotDate].push(slotTime);

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.json({
      success: true,
      message: "Appointment booked",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error in booking appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// API to get user appointments  for fromtend my-appointments page
const listAppointment = async(req,res)=>{
try {
  const{userId} = req.body
  const appointments = await appointmentModel.find({userId})
  res.json({success:true,appointments})
} catch (error) {
  console.log(error)
  res.json({success:false,message:error.message})
  
}
}
// API to cancel appointment
const cancelAppointment = async(req,res)=>{
  try {
    const{userId,appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    // verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({success:false,message:"Unauthorized action"})
    }
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
    res.json({success:false,message:'Unauthorized action'})
  }
}
const razorpayinstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})
// API TO make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Ensure the appointmentId is destructured properly
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" });
    }

    // Creating options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // Razorpay expects amount in paise
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creating an order in Razorpay
    const order = await razorpayinstance.orders.create(options);

    // Respond with the created order
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error in paymentRazorpay:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to verify payment of razorpay
const verifyRazorpay = async(req,res)=>{
  try {
    const{razorpay_order_id} = req.body;
    const orderInfo = await razorpayinstance.orders.fetch(razorpay_order_id)
    console.log(orderInfo);
    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.json({success:true,message:'Payment Successful'})
    }else{
      res.json({success:false,message:'Payment Failed'})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
export { registerUser, loginUser, getProfile,updateProfile, bookAppointment,listAppointment,cancelAppointment ,paymentRazorpay,verifyRazorpay};
