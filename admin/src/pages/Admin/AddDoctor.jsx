import React, { useState, useContext ,useEffect} from "react";
import upload_area from "../../../assets_admin/upload_area.svg";
import { AdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
const AddDoctor = () => {
  const [docImg, setDocImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [aboutDoctor, setAboutDoctor] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);
  // useEffect(() => {
  //   console.log("aToken in AddDoctor.jsx:", aToken);  // Log for debugging
  // }, [aToken]);
  useEffect(() => {
    console.log("aToken in AddDoctor.jsx after context access:", aToken);
  }, [aToken]);
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!docImg) {
      return toast.error("Image not selected");
    }

    try {
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', aboutDoctor);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      //console.log(formData);
      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`);
        
      })
      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`
          }
        }
      );
      
      if (data.success) {
        toast.success(data.message);
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        
      } else {
        toast.error(data.message);
      }
      } catch (error) {
        if (error.response) {
          console.error("Server responded with error:", error.response.data);
          toast.error(error.response.data.message || "Error adding doctor");
        } else {
          console.error("Error adding doctor:", error.message);
          toast.error("Error adding doctor");
        }
      }
    }      
  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium text-gray-700">Add Doctor</p>
      <div className="bg-white px-6 py-8 border rounded w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto ml-10">
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc_img" className="cursor-pointer">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full object-cover"
              src={docImg ? URL.createObjectURL(docImg) : upload_area}
              alt="Upload area"
            />
          </label>
          <input
            type="file"
            id="doc_img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />
          <p className="text-sm text-gray-600">
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-700">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Doctor Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Doctor's Name"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Doctor Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Doctor's Email"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Doctor Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Experience</p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Fees</p>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Enter Fees"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Specialty</p>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Education</p>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Enter Education"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">Address</p>
              <input
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Enter Address Line 1"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                required
              />
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Enter Address Line 2"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full mt-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">About Doctor</p>
              <textarea
                value={aboutDoctor}
                onChange={(e) => setAboutDoctor(e.target.value)}
                placeholder="Enter About Doctor"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
                rows="4"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark transition duration-300 ease-in-out"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
