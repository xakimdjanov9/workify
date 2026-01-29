import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { talentApi } from "../../services/api";
import {
  FaBriefcase,
  FaClock,
  FaFileContract,
  FaUserTie,
  FaBuilding,
  FaDollarSign,
  FaFlag,
  FaCity,
  FaHome,
} from "react-icons/fa";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function RegistrationFormStepThree() {
  const navigate = useNavigate();

  const [employmentType, setEmploymentType] = useState("fulltime");
  const [workplaceType, setWorkplaceType] = useState("");
  const [minimumSalary, setMinimumSalary] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    workplaceType: false,
    minimumSalary: false,
    city: false,
  });

  useEffect(() => {
    const savedData = localStorage.getItem("talent_step3");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setEmploymentType(parsed.employmentType || "fulltime");
      setWorkplaceType(parsed.workplaceType || "");
      setMinimumSalary(parsed.minimumSalary || "");
      setCountry(parsed.country || "");
      setCity(parsed.city || "");
    }
  }, []);

  useEffect(() => {
    if (errors.workplaceType && workplaceType) {
      setErrors(prev => ({ ...prev, workplaceType: false }));
    }
    if (errors.minimumSalary && minimumSalary && Number(minimumSalary) > 0) {
      setErrors(prev => ({ ...prev, minimumSalary: false }));
    }
    if (errors.city && city.trim()) {
      setErrors(prev => ({ ...prev, city: false }));
    }
  }, [workplaceType, minimumSalary, city, errors]);

  const handleFinish = async () => {
    const newErrors = {
      workplaceType: !workplaceType,
      minimumSalary: !minimumSalary || Number(minimumSalary) <= 0,
      city: !city.trim(),
    };

    setErrors(newErrors);

    if (newErrors.workplaceType || newErrors.minimumSalary || newErrors.city) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const step1 = JSON.parse(localStorage.getItem("step1_data") || "{}");
      const step2 = JSON.parse(localStorage.getItem("talent_step2") || "{}");

      const step3 = {
        work_type: employmentType,
        workplace_type: workplaceType,
        minimum_salary: Number(minimumSalary) || 0,
        country,
        city,
      };

      const allData = { ...step1, ...step2, ...step3 };

      if (!allData.email) {
        toast.error("Email not found. Please restart the registration process.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(allData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if ((key === "image" || key === "profileimg") && value instanceof File) {
          formData.append("image", value);
          return;
        }
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          return;
        }
        formData.append(key, value);
      });

      const response = await talentApi.registerTalent(formData);

      if (response.status === 200 || response.status === 201) {
        // Ma'lumotlarni tozalash, lekin emailni tasdiqlash uchun saqlab qolamiz
        localStorage.setItem("verify_email", allData.email);
        
        localStorage.removeItem("step1_data");
        localStorage.removeItem("talent_step2");
        localStorage.removeItem("talent_step3");

        toast.success("Info saved! Redirecting to verification...");
        
        setTimeout(() => {
          navigate("/verify-account"); // Tasdiqlash sahifasiga o'tish
        }, 1500);
      }
    } catch (error) {
      console.error("Backend error:", error.response?.data);
      toast.error(`Error: ${error.response?.data?.message || "Server error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster toastOptions={{ duration: 4000, position: "top-right" }} />
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-[988px] p-6 md:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              How do you imagine your dream job?
            </h2>
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="w-3 h-3 rounded-full bg-[#163D5C]"></div>
              <div className="w-16 md:w-32 h-0.5 bg-[#163D5C]"></div>
              <div className="w-3 h-3 rounded-full bg-[#163D5C]"></div>
              <div className="w-16 md:w-32 h-0.5 bg-[#163D5C]"></div>
              <div className="w-4 h-4 rounded-full bg-[#163D5C] border-4 border-white shadow-lg"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-3">Employment type</label>
              <div className="relative bg-gray-100 rounded-[50px] border border-gray-200 grid grid-cols-4 p-1 overflow-hidden">
                <div
                  className="absolute top-1 bottom-1 left-1 w-[calc(25%-0.5rem)] bg-white rounded-[50px] shadow-md transition-all duration-300"
                  style={{ transform: `translateX(${["fulltime", "parttime", "contract", "freelance"].indexOf(employmentType) * 100}%)` }}
                ></div>
                {[
                  { id: "fulltime", label: "Full time", icon: <FaBriefcase /> },
                  { id: "parttime", label: "Part time", icon: <FaClock /> },
                  { id: "contract", label: "Contract", icon: <FaFileContract /> },
                  { id: "freelance", label: "Freelance", icon: <FaUserTie /> },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEmploymentType(type.id)}
                    className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 md:py-4 relative z-10 font-medium transition-all duration-200 ${employmentType === type.id ? "text-[#163D5C]" : "text-gray-400"}`}
                  >
                    <span className="text-sm md:text-lg">{type.icon}</span>
                    <span className="text-[10px] sm:text-xs md:text-base whitespace-nowrap">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Workplace type *</label>
                <div className={`relative bg-gray-100 rounded-[50px] border flex overflow-hidden ${errors.workplaceType ? "border-red-500" : "border-gray-200"}`}>
                  <div
                    className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-[50px] shadow-md transition-all duration-300"
                    style={{ transform: `translateX(${["Onsite", "Remote", "Hybrid"].indexOf(workplaceType) * 100}%)` }}
                  ></div>
                  {["Onsite", "Remote", "Hybrid"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWorkplaceType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 relative z-10 font-semibold transition-colors duration-200 ${workplaceType === type ? "text-[#163D5C]" : "text-gray-400"}`}
                    >
                      {type === "Onsite" && <FaBuilding />}
                      {type === "Remote" && <FaHome />}
                      {type === "Hybrid" && <FaFlag />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Minimum salary *</label>
                <div className="relative">
                  <FaDollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.minimumSalary ? "text-red-500" : "text-[#163D5C]"}`} />
                  <input
                    type="number"
                    value={minimumSalary}
                    onChange={(e) => setMinimumSalary(e.target.value)}
                    className={`w-full pl-12 pr-10 py-3 border rounded-lg outline-none ${errors.minimumSalary ? "border-red-500 bg-red-50" : "border-gray-200 focus:ring-2 focus:ring-[#163D5C]"}`}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">City *</label>
                <div className="relative">
                  <FaCity className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.city ? "text-red-500" : "text-[#163D5C]"}`} />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg outline-none ${errors.city ? "border-red-500 bg-red-50" : "border-gray-200 focus:ring-2 focus:ring-[#163D5C]"}`}
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4 justify-center">
              <button
                type="button"
                onClick={() => navigate("/registration/step-2")}
                disabled={loading}
                className="w-full md:w-auto px-12 py-3 border-2 border-[#163D5C] text-[#163D5C] rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="w-full md:w-auto px-12 py-3 bg-[#163D5C] text-white rounded-lg font-medium hover:bg-[#1a4d73] flex items-center justify-center min-w-[180px] disabled:opacity-70"
              >
                {loading ? "Processing..." : "Finish & Verify"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}