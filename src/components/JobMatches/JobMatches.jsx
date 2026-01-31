import React, { useState, useEffect } from "react";
import { jobApi, talentApi } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useJobReactions } from "../../Context/JobReactionsContext.jsx";
import toast, { Toaster } from "react-hot-toast";
import {
  FaSearch,
  FaChevronDown,
  FaCity,
  FaDollarSign,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext.jsx";
import nonImg from "../../assets/img.jpg";

export default function JobMatches() {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [allJobs, setAllJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { getReaction, toggleLike, toggleDislike } = useJobReactions();
  const navigate = useNavigate();

  const toastOptions = {
    duration: 2200,
    style: {
      background: isDark ? "#1E1E1E" : "#ffffff",
      color: isDark ? "#ffffff" : "#1E293B",
      border: isDark ? "1px solid #374151" : "1px solid #E5E7EB",
      fontWeight: 700,
    },
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);

        const userRes = await talentApi.getById(decoded.id);
        const rawSkills = userRes.data?.skils || [];

        const parsedUserSkills = Array.isArray(rawSkills)
          ? rawSkills
          : String(rawSkills)
              .split(",")
              .map((s) => s.trim());

        const lowerUserSkills = parsedUserSkills
          .map((s) => (typeof s === "string" ? s.toLowerCase() : ""))
          .filter(Boolean);

        setUserSkills(lowerUserSkills);

        const jobRes = await jobApi.getAll();
        const jobs = jobRes.data || [];

        const sortedJobs = [...jobs].sort((a, b) => {
          const aMatch = lowerUserSkills.some(
            (s) =>
              a?.specialty?.toLowerCase?.().includes(s) ||
              a?.occupation?.toLowerCase?.().includes(s)
          );
          const bMatch = lowerUserSkills.some(
            (s) =>
              b?.specialty?.toLowerCase?.().includes(s) ||
              b?.occupation?.toLowerCase?.().includes(s)
          );
          return Number(bMatch) - Number(aMatch);
        });

        setAllJobs(sortedJobs);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredJobs = allJobs.filter((job) => {
    const matchType = employmentType ? job.job_type === employmentType : true;
    const matchWorkplace = workplaceType
      ? job.workplace_type === workplaceType
      : true;
    const matchSalary = minSalary ? job.salary_min >= Number(minSalary) : true;
    const matchCity = city
      ? job.location?.toLowerCase().includes(city.toLowerCase())
      : true;
    const matchSearch = searchQuery
      ? job.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.company_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    return (
      matchType && matchWorkplace && matchSalary && matchCity && matchSearch
    );
  });

  const handleLike = (jobId) => {
    const current = getReaction(jobId);
    toggleLike(jobId);

    if (current === "like") toast("Removed from liked jobs", toastOptions);
    else toast("Added to liked jobs", toastOptions);
  };

  const handleDislike = (jobId) => {
    const current = getReaction(jobId);
    toggleDislike(jobId);

    if (current === "dislike")
      toast("Removed from disliked jobs", toastOptions);
    else toast("Added to disliked jobs", toastOptions);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 p-4 md:p-8 font-sans ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F9FAFB] text-[#1E293B]"
      }`}
    >
      <Toaster position="top-right" toastOptions={toastOptions} />
      <div className="max-w-5xl mx-auto">
        <div
          className={`rounded-3xl shadow-sm border transition-all duration-500 mb-6 overflow-hidden ${
            isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div
            className={`p-5 md:p-6 border-b flex justify-between items-center ${
              isDark ? "border-gray-800" : "border-gray-50"
            }`}
          >
            <h2
              className={`text-xl md:text-2xl font-semibold ${
                isDark ? "text-blue-400" : "text-[#505151]"
              }`}
            >
              Job Matches
            </h2>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2">
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-5 md:p-8 space-y-8">
              <div>
                <label
                  className={`block font-bold mb-3 md:mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Employment type
                </label>
                <div
                  className={`flex flex-wrap gap-2 md:gap-1 rounded-2xl p-1.5 md:p-1 ${
                    isDark ? "bg-[#252525]" : "bg-[#F1F3F6]"
                  }`}
                >
                  {["Full time", "Part time", "Contract", "Freelance"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setEmploymentType(employmentType === type ? "" : type)
                        }
                        className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all flex-1 md:flex-none whitespace-nowrap
                        ${
                          employmentType === type
                            ? isDark
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-[#163D5C] shadow-sm"
                            : isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label
                    className={`block font-bold mb-3 md:mb-4 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Workplace type
                  </label>
                  <div
                    className={`flex flex-wrap md:flex-nowrap gap-2 md:gap-1 rounded-2xl p-1.5 md:p-1 ${
                      isDark ? "bg-[#252525]" : "bg-[#F1F3F6]"
                    }`}
                  >
                    {["Onsite", "Remote", "Hybrid"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setWorkplaceType(workplaceType === type ? "" : type)
                        }
                        className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all flex-1 md:flex-none
                          ${
                            workplaceType === type
                              ? isDark
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-[#163D5C] shadow-sm"
                              : isDark
                              ? "text-gray-500 hover:text-gray-300"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className={`block font-bold mb-3 md:mb-4 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Minimum salary
                  </label>
                  <div className="relative">
                    <FaDollarSign
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        isDark ? "text-blue-400" : "text-[#163D5C]"
                      }`}
                    />
                    <input
                      type="number"
                      className={`w-full pl-12 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base ${
                        isDark
                          ? "bg-[#252525] focus:ring-blue-900"
                          : "bg-[#F9FAFB] focus:ring-blue-100"
                      } border-none focus:ring-2 outline-none`}
                      placeholder="e.g. 500"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-8 md:mb-10">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            className={`w-full pl-16 pr-36 md:pr-44 py-4 md:py-5 rounded-2xl shadow-sm text-sm md:text-base ${
              isDark
                ? "bg-[#1E1E1E] border-gray-800"
                : "bg-white border-gray-100"
            }`}
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base ${
              isDark ? "bg-blue-600" : "bg-[#163D5C]"
            } text-white`}
          >
            Search
          </button>
        </div>

        <div className="space-y-5 md:space-y-6">
          <p
            className={`font-bold px-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {filteredJobs.length} jobs available
          </p>

          {filteredJobs.map((job) => {
            const reaction = getReaction(job.id);
            const isMatch =
              userSkills.length > 0 &&
              userSkills.some(
                (s) =>
                  job.specialty?.toLowerCase().includes(s) ||
                  job.occupation?.toLowerCase().includes(s)
              );

            return (
              <div
                key={job.id}
                className={`rounded-[32px] p-5 md:p-8 border transition-all ${
                  isMatch
                    ? isDark
                      ? "border-blue-900/50 bg-blue-900/10"
                      : "border-blue-100 bg-blue-50/10"
                    : isDark
                    ? "bg-[#1E1E1E] border-gray-800"
                    : "bg-white border-gray-50"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-5">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border p-2 shrink-0 shadow-sm ${
                        isDark
                          ? "bg-[#252525] border-gray-700"
                          : "bg-white border-gray-50"
                      }`}
                    >
                      <img
                        src={job.company?.profileimg_url || nonImg}
                        alt="logo"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          isDark ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        {job.company?.company_name}
                      </h3>
                      <p className="text-gray-400 text-sm font-bold">
                        {job.company?.city}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4].map((i) => (
                          <span key={i} className="text-yellow-500 text-sm">
                            ★
                          </span>
                        ))}
                        <span
                          className={`${
                            isDark ? "text-gray-700" : "text-gray-200"
                          } text-sm`}
                        >
                          ★
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div
                      className={`flex items-center gap-2 font-bold text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FaCity className="text-blue-400" />
                      {job.company?.city || "Uzbekistan"}
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isDark
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-[#E7F8F0] text-[#52D394]"
                      }`}
                    >
                      {job.workplace_type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center mt-6 mb-4">
                  <div className="flex items-center gap-3">
                    <h2
                      className={`text-2xl font-black ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {job.occupation}
                    </h2>
                    {isMatch && (
                      <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-lg shadow-blue-600/20">
                        Best Match
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-2xl font-black ${
                      isDark ? "text-blue-400" : "text-slate-800"
                    }`}
                  >
                    ${job.salary_min}-{job.salary_max}
                  </span>
                </div>

                <p
                  className={`text-sm font-medium leading-relaxed mb-6 line-clamp-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {job.description || "No description provided..."}
                </p>

                <div className="mb-8">
                  <p
                    className={`font-black text-sm mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    Required skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold border ${
                        isDark
                          ? "bg-[#252525] text-gray-400 border-gray-700"
                          : "bg-[#F1F3F6] text-gray-600 border-transparent"
                      }`}
                    >
                      {job.skills}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex flex-col md:flex-row md:justify-between gap-4 md:gap-6 pt-6 border-t ${
                    isDark ? "border-gray-800" : "border-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-5 md:gap-6">
                    <button
                      onClick={() => handleLike(job.id)}
                      className={`transition-all ${
                        reaction === "like"
                          ? "text-green-500 scale-110"
                          : "text-gray-500 hover:text-green-400"
                      }`}
                      title="Like"
                    >
                      <FaThumbsUp size={22} />
                    </button>
                    <button
                      onClick={() => handleDislike(job.id)}
                      className={`transition-all ${
                        reaction === "dislike"
                          ? "text-red-500 scale-110"
                          : "text-gray-500 hover:text-red-400"
                      }`}
                      title="Dislike"
                    >
                      <FaThumbsDown size={22} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => navigate(`/job-post/${job.id}`)}
                      className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-black text-sm md:text-base transition-all shadow-lg ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-[#163D5C] hover:bg-[#0f2d45]"
                      } text-white`}
                    >
                      Quick apply
                    </button>
                    <button
                      onClick={() => navigate(`/job-details/${job.company_id}`)}
                      className={`flex-1 sm:flex-none px-8 py-4 border-2 rounded-2xl font-black text-sm md:text-base transition-all ${
                        isDark
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-[#163D5C] text-[#163D5C] hover:bg-gray-50"
                      }`}
                    >
                      View job post
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
