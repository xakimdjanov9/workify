import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaBuilding,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UZBEKISTAN_CITIES = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg'ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog'iston Respublikasi",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
];

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("talent");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "male",
    date_of_birth: "",
    location: "",
    phone: "+998",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("step1_data");
    if (savedData) setFormData(JSON.parse(savedData));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const size = phoneNumber.length;

    if (size <= 3) return `+${phoneNumber}`;
    if (size <= 5)
      return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}`;
    if (size <= 8)
      return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}`;
    if (size <= 10)
      return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 10)}`;
    return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 10)}-${phoneNumber.slice(10, 12)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value.startsWith("+998") ? value : "+998");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validatePassword = (password) => {
    const hasLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLength && hasUpperCase && hasNumber;
  };

  const validateAge = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 14;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim())
      errors.first_name = "Enter your first name";
    if (!formData.last_name.trim()) errors.last_name = "Enter your last name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email address";

    if (!formData.password) {
      errors.password = "Enter your password";
    } else if (!validatePassword(formData.password)) {
      if (formData.password.length < 6)
        errors.password = "Must be at least 6 characters";
      else if (!/[A-Z]/.test(formData.password))
        errors.password = "Must contain at least 1 UPPERCASE letter";
      else if (!/\d/.test(formData.password))
        errors.password = "Must contain at least 1 number";
    }

    if (!formData.location) errors.location = "Select your location";

    if (!formData.date_of_birth) {
      errors.date_of_birth = "Enter your date of birth";
    } else if (!validateAge(formData.date_of_birth)) {
      errors.date_of_birth = "You must be at least 14 years old";
    }

    const digits = formData.phone.replace(/[^\d]/g, "");
    if (digits.length < 12) errors.phone = "Invalid phone number";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem("step1_data", JSON.stringify(formData));
      localStorage.setItem("user_role", activeTab);
      toast.success("Information saved successfully!");
      navigate("/registration/step-2");
    } catch (error) {
      toast.error("Error saving data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputErrorClass = (fieldName) => {
    return formErrors[fieldName]
      ? "border-red-500 focus:ring-red-300 bg-red-50"
      : "border-gray-200 focus:ring-[#163D5C]";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-3 xs:px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 xs:p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Tab Switcher */}
            <div className="relative bg-gray-100 rounded-[50px] border border-gray-200 grid grid-cols-2 p-1 mb-6 sm:mb-8 overflow-hidden">
              <div
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] bg-white rounded-[50px] shadow-md transition-all duration-300"
                style={{
                  transform: `translateX(${activeTab === "company" ? "100%" : "0%"})`,
                }}
              ></div>
              <button
                type="button"
                onClick={() => setActiveTab("talent")}
                className={`flex items-center justify-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-3 relative z-10 font-medium text-sm xs:text-base ${activeTab === "talent" ? "text-[#163D5C]" : "text-gray-400"}`}
              >
                <FaUser className="text-sm xs:text-base" /> 
                <span className="truncate">Talent</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("company")}
                className={`flex items-center justify-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-3 relative z-10 font-medium text-sm xs:text-base ${activeTab === "company" ? "text-[#163D5C]" : "text-gray-400"}`}
              >
                <FaBuilding className="text-sm xs:text-base" /> 
                <span className="truncate">Company</span>
              </button>
            </div>

            <form onSubmit={handleNext} className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    First name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("first_name")}`}
                    />
                  </div>
                  {formErrors.first_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Last name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("last_name")}`}
                    />
                  </div>
                  {formErrors.last_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.last_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("email")}`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Password *{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      (min 6, uppercase, number)
                    </span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-10 xs:pr-12 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("password")}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash className="text-sm xs:text-base" /> : <FaEye className="text-sm xs:text-base" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Gender
                  </label>
                  <div className="relative bg-gray-100 rounded-[50px] border grid grid-cols-2 p-1 overflow-hidden">
                    <div
                      className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] bg-white rounded-[50px] shadow-sm transition-all duration-300"
                      style={{
                        transform: `translateX(${formData.gender === "female" ? "100%" : "0%"})`,
                      }}
                    ></div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: "male" })}
                      className={`relative z-10 py-1.5 xs:py-2 text-xs xs:text-sm font-medium ${formData.gender === "male" ? "text-[#163D5C]" : "text-gray-400"}`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, gender: "female" })
                      }
                      className={`relative z-10 py-1.5 xs:py-2 text-xs xs:text-sm font-medium ${formData.gender === "female" ? "text-[#163D5C]" : "text-gray-400"}`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Date of birth *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      max={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 14),
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("date_of_birth")}`}
                    />
                  </div>
                  {formErrors.date_of_birth && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.date_of_birth}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Location *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        setShowDropdown(true);
                      }}
                      placeholder="Search city..."
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("location")}`}
                      autoComplete="off"
                    />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-40 xs:max-h-48 overflow-y-auto">
                      {UZBEKISTAN_CITIES.filter((c) =>
                        c.toLowerCase().includes(formData.location.toLowerCase()),
                      ).map((city) => (
                        <div
                          key={city}
                          onClick={() => {
                            setFormData({ ...formData, location: city });
                            setShowDropdown(false);
                          }}
                          className="p-2 xs:p-3 hover:bg-gray-50 cursor-pointer text-xs xs:text-sm border-b last:border-0"
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Phone *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg focus:outline-none text-sm xs:text-base ${getInputErrorClass("phone")}`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 sm:pt-6 flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 border-2 border-[#163D5C] text-[#163D5C] rounded-lg font-medium hover:bg-gray-50 transition-all text-sm xs:text-base w-full xs:w-auto"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 bg-[#163D5C] text-white rounded-lg font-medium hover:bg-[#1a4d73] shadow-md flex items-center justify-center gap-2 text-sm xs:text-base w-full xs:w-auto min-w-[120px] xs:min-w-[140px] sm:min-w-[160px]"
                >
                  {isSubmitting ? "Processing..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}