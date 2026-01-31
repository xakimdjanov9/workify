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
      setErrors((prev) => ({ ...prev, workplaceType: false }));
    }
    if (errors.minimumSalary && minimumSalary && Number(minimumSalary) > 0) {
      setErrors((prev) => ({ ...prev, minimumSalary: false }));
    }
    if (errors.city && city.trim()) {
      setErrors((prev) => ({ ...prev, city: false }));
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
        toast.error(
          "Email not found. Please restart the registration process."
        );
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(allData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (
          (key === "image" || key === "profileimg") &&
          value instanceof File
        ) {
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
        localStorage.setItem("verify_email", allData.email);
        localStorage.removeItem("step1_data");
        localStorage.removeItem("talent_step2");
        localStorage.removeItem("talent_step3");

        toast.success("Info saved! Redirecting to verification...");

        setTimeout(() => {
          navigate("/verify-account");
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
    <div className="min-h-screen flex flex-col">
      <Toaster toastOptions={{ duration: 4000, position: "top-right" }} />
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-100 px-3 xs:px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 xs:p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                How do you imagine your dream job?
              </h2>

              <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4">
                <div className="w-3 h-3 rounded-full bg-[#163D5C] flex-shrink-0"></div>
                <div className="w-8 xs:w-12 sm:w-16 md:w-20 lg:w-32 h-0.5 bg-[#163D5C]"></div>
                <div className="w-3 h-3 rounded-full bg-[#163D5C] flex-shrink-0"></div>
                <div className="w-8 xs:w-12 sm:w-16 md:w-20 lg:w-32 h-0.5 bg-[#163D5C]"></div>
                <div className="w-4 h-4 rounded-full bg-[#163D5C] border-2 sm:border-3 md:border-4 border-white shadow-md sm:shadow-lg flex-shrink-0"></div>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-sm xs:text-base">
                  Employment type
                </label>
                <div className="relative bg-gray-100 rounded-[50px] border border-gray-200 grid grid-cols-4 p-1 overflow-hidden">
                  <div
                    className="absolute top-1 bottom-1 left-1 w-[calc(25%-0.5rem)] bg-white rounded-[50px] shadow-md transition-all duration-300"
                    style={{
                      transform: `translateX(${
                        [
                          "fulltime",
                          "parttime",
                          "contract",
                          "freelance",
                        ].indexOf(employmentType) * 100
                      }%)`,
                      width: "calc(25% - 0.5rem)",
                    }}
                  ></div>
                  {[
                    {
                      id: "fulltime",
                      label: "Full time",
                      icon: <FaBriefcase />,
                    },
                    { id: "parttime", label: "Part time", icon: <FaClock /> },
                    {
                      id: "contract",
                      label: "Contract",
                      icon: <FaFileContract />,
                    },
                    {
                      id: "freelance",
                      label: "Freelance",
                      icon: <FaUserTie />,
                    },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEmploymentType(type.id)}
                      className={`flex flex-col items-center justify-center gap-0.5 xs:gap-1 py-2 xs:py-2.5 sm:py-3 md:py-4 relative z-10 font-medium transition-all duration-200 ${
                        employmentType === type.id
                          ? "text-[#163D5C]"
                          : "text-gray-400"
                      }`}
                    >
                      <span className="text-xs xs:text-sm sm:text-base md:text-lg">
                        {type.icon}
                      </span>
                      <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap truncate px-1">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Workplace type *
                  </label>
                  <div
                    className={`relative bg-gray-100 rounded-[50px] border flex overflow-hidden ${
                      errors.workplaceType
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div
                      className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-[50px] shadow-md transition-all duration-300"
                      style={{
                        transform: `translateX(${
                          ["Onsite", "Remote", "Hybrid"].indexOf(
                            workplaceType
                          ) * 100
                        }%)`,
                      }}
                    ></div>
                    {["Onsite", "Remote", "Hybrid"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setWorkplaceType(type)}
                        className={`flex-1 flex items-center justify-center gap-1 xs:gap-2 py-2.5 xs:py-3 sm:py-3.5 relative z-10 font-semibold transition-colors duration-200 text-xs xs:text-sm sm:text-base ${
                          workplaceType === type
                            ? "text-[#163D5C]"
                            : "text-gray-400"
                        }`}
                      >
                        {type === "Onsite" && (
                          <FaBuilding className="text-xs xs:text-sm sm:text-base" />
                        )}
                        {type === "Remote" && (
                          <FaHome className="text-xs xs:text-sm sm:text-base" />
                        )}
                        {type === "Hybrid" && (
                          <FaFlag className="text-xs xs:text-sm sm:text-base" />
                        )}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Minimum salary *
                  </label>
                  <div className="relative">
                    <FaDollarSign
                      className={`absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-sm xs:text-base ${
                        errors.minimumSalary ? "text-red-500" : "text-[#163D5C]"
                      }`}
                    />
                    <input
                      type="number"
                      value={minimumSalary}
                      onChange={(e) => setMinimumSalary(e.target.value)}
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg outline-none text-sm xs:text-base ${
                        errors.minimumSalary
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-2 focus:ring-[#163D5C]"
                      }`}
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                  {errors.minimumSalary && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid salary amount
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    City *
                  </label>
                  <div className="relative">
                    <FaCity
                      className={`absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-sm xs:text-base ${
                        errors.city ? "text-red-500" : "text-[#163D5C]"
                      }`}
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border rounded-lg outline-none text-sm xs:text-base ${
                        errors.city
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-2 focus:ring-[#163D5C]"
                      }`}
                      placeholder="Enter city"
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter your city
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm xs:text-base">
                    Country
                  </label>
                  <div className="relative">
                    <FaFlag className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-sm xs:text-base" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full pl-9 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#163D5C] text-sm xs:text-base"
                      placeholder="Enter country (optional)"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-8 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/registration/step-2")}
                  disabled={loading}
                  className="w-full xs:w-auto px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 border-2 border-[#163D5C] text-[#163D5C] rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 text-sm xs:text-base"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full xs:w-auto px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 bg-[#163D5C] text-white rounded-lg font-medium hover:bg-[#1a4d73] flex items-center justify-center min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] disabled:opacity-70 transition-all duration-200 text-sm xs:text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Finish & Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
