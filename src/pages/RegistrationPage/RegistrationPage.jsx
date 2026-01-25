import React, { useState, useEffect } from "react";
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

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("talent");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "male",
    date_of_birth: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("step1_data");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Real-time validation for specific fields
    if (name === "email" && value) {
      validateEmail(value);
    }
    if (name === "password" && value) {
      validatePassword(value);
    }
    if (name === "phone" && value) {
      validatePhone(value);
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation (min 6 characters)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Phone validation (basic)
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Date validation (must be at least 18 years old)
  const validateDateOfBirth = (date) => {
    if (!date) return true;
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // First name validation
    if (!formData.first_name.trim()) {
      errors.first_name = "Ismni kiriting";
      isValid = false;
    } else if (formData.first_name.length < 2) {
      errors.first_name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
      isValid = false;
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      errors.last_name = "Familiyani kiriting";
      isValid = false;
    } else if (formData.last_name.length < 2) {
      errors.last_name = "Familiya kamida 2 ta belgidan iborat bo'lishi kerak";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email manzilini kiriting";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Iltimos, to'g'ri email manzilini kiriting";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Parolni kiriting";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
      isValid = false;
    }

    // Date of birth validation
    if (!formData.date_of_birth) {
      errors.date_of_birth = "Tug'ilgan sanani kiriting";
      isValid = false;
    } else if (!validateDateOfBirth(formData.date_of_birth)) {
      errors.date_of_birth = "Siz kamida 18 yoshda bo'lishingiz kerak";
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = "Manzilni kiriting";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Telefon raqamini kiriting";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Iltimos, to'g'ri telefon raqamini kiriting";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fff',
      },
    });
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #86efac',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#16a34a',
        secondary: '#fff',
      },
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!validateForm()) {
      // Show the first error in toast
      const firstErrorKey = Object.keys(formErrors)[0];
      if (firstErrorKey) {
        showErrorToast(formErrors[firstErrorKey]);
      }
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call or processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save data to localStorage
      localStorage.setItem("step1_data", JSON.stringify(formData));
      localStorage.setItem("user_role", activeTab);

      // Show success message
      showSuccessToast("Ma'lumotlar saqlandi! Keyingi bosqichga o'tilmoqda...");

      // Navigate after delay
      setTimeout(() => {
        navigate("/registration/step-2");
      }, 1500);

    } catch (error) {
      showErrorToast("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get input error class
  const getInputErrorClass = (fieldName) => {
    return formErrors[fieldName] 
      ? "border-red-500 focus:ring-red-300 bg-red-50" 
      : "border-gray-200 focus:ring-[#163D5C]";
  };

  return (
    <div>
      {/* Toast Container */}
      <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #86efac',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
        containerStyle={{
          top: 80,
          right: 20,
        }}
      />

      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-[388px] md:max-w-[988px] p-6 md:p-12">
          <div className="relative bg-gray-100 rounded-[50px] border border-gray-200 grid grid-cols-2 p-1 mb-8 overflow-hidden">
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] bg-white rounded-[50px] shadow-md transition-all duration-300"
              style={{
                transform: `translateX(${
                  activeTab === "company" ? "100%" : "0%"
                })`,
              }}
            ></div>

            <button
              type="button"
              onClick={() => setActiveTab("talent")}
              className={`flex items-center justify-center gap-2 px-6 py-3 relative z-10 font-medium transition-colors duration-200 ${
                activeTab === "talent" ? "text-[#163D5C]" : "text-gray-400"
              }`}
            >
              <FaUser className="text-sm" />
              <span>Talent</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`flex items-center justify-center gap-2 px-6 py-3 relative z-10 font-medium transition-colors duration-200 ${
                activeTab === "company" ? "text-[#163D5C]" : "text-gray-400"
              }`}
            >
              <FaBuilding className="text-sm" />
              <span>Company</span>
            </button>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  First name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.first_name ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("first_name")}`}
                  />
                </div>
                {formErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Last name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.last_name ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("last_name")}`}
                  />
                </div>
                {formErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.email ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("email")}`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                  <span className="text-xs text-gray-500 ml-2">(min 6 characters)</span>
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.password ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("password")}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      formErrors.password ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
                {formData.password && !formErrors.password && formData.password.length < 6 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    {6 - formData.password.length} ta belgi qoldi
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender
                </label>
                <div className="relative bg-gray-100 rounded-[50px] border border-gray-200 grid grid-cols-2 p-1 overflow-hidden">
                  <div
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.5rem)] bg-white rounded-[50px] shadow-md transition-all duration-300"
                    style={{
                      transform: `translateX(${
                        formData.gender === "female" ? "100%" : "0%"
                      })`,
                    }}
                  ></div>

                  <button
                    type="button"
                    onClick={() => handleGenderChange("male")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 relative z-10 font-medium transition-colors duration-200 ${
                      formData.gender === "male"
                        ? "text-[#163D5C]"
                        : "text-gray-400"
                    }`}
                  >
                    <FaUser className="text-sm" />
                    <span>Male</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderChange("female")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 relative z-10 font-medium transition-colors duration-200 ${
                      formData.gender === "female"
                        ? "text-[#163D5C]"
                        : "text-gray-400"
                    }`}
                  >
                    <FaUser className="text-sm" />
                    <span>Female</span>
                  </button>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Date of birth
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.date_of_birth ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("date_of_birth")}`}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  />
                </div>
                {formErrors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.date_of_birth}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.location ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Tashkent, Uzbekistan"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("location")}`}
                  />
                </div>
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    formErrors.phone ? "text-red-500" : "text-[#163D5C]"
                  }`} />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getInputErrorClass("phone")}`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full md:w-auto px-12 py-3 border-2 border-[#163D5C] text-[#163D5C] rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-12 py-3 bg-[#163D5C] text-white rounded-lg font-medium transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? "opacity-70 cursor-not-allowed" 
                      : "hover:bg-[#1a4d73]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tekshirilmoqda...
                    </>
                  ) : (
                    "Next Step"
                  )}
                </button>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                * bilan belgilangan maydonlar majburiy
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}