import React, { useState, useEffect } from "react";
import { jobApi, talentApi } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useJobReactions } from "../../Context/JobReactionsContext.jsx";
import {
  FaBriefcase,
  FaClock,
  FaFileContract,
  FaUserTie,
  FaBuilding,
  FaHome,
  FaFlag,
  FaSearch,
  FaChevronDown,
  FaCity,
  FaDollarSign,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext.jsx"; // Context ulandi
import nonImg from '../../assets/img.jpg'

export default function JobMatches() {
  const { settings } = useTheme(); // Dark mode holati
  const isDark = settings.darkMode;

  const [allJobs, setAllJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter states
  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { getReaction, toggleLike, toggleDislike } = useJobReactions();

  const navigate = useNavigate();

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
          : rawSkills.split(",").map((s) => s.trim());

        const lowerUserSkills = parsedUserSkills.map((s) => s.toLowerCase());
        setUserSkills(lowerUserSkills);

        const jobRes = await jobApi.getAll();
        const jobs = jobRes.data || [];

        const sortedJobs = [...jobs].sort((a, b) => {
          const aMatch = lowerUserSkills.some(
            (s) =>
              a.specialty?.toLowerCase().includes(s) ||
              a.occupation?.toLowerCase().includes(s),
          );
          const bMatch = lowerUserSkills.some(
            (s) =>
              b.specialty?.toLowerCase().includes(s) ||
              b.occupation?.toLowerCase().includes(s),
          );
          return bMatch - aMatch;
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

  return (
    <div
      className={`min-h-screen transition-colors duration-500 p-4 md:p-8 font-sans ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F9FAFB] text-[#1E293B]"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* --- JOB ALERTS FILTER SECTION --- */}
        <div
          className={`rounded-3xl shadow-sm border transition-all duration-500 mb-6 overflow-hidden ${
            isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div
            className={`p-6 border-b flex justify-between items-center ${isDark ? "border-gray-800" : "border-gray-50"}`}
          >
            <h2
              className={`text-xl font-bold ${isDark ? "text-blue-400" : "text-[#163D5C]"}`}
            >
              Job Alerts
            </h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-full transition-all ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <FaChevronDown
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="p-8 space-y-8">
              {/* Employment Type */}
              <div>
                <label
                  className={`block font-bold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Employment type
                </label>
                <div
                  className={`flex flex-wrap rounded-2xl p-1 gap-1 w-fit ${isDark ? "bg-[#252525]" : "bg-[#F1F3F6]"}`}
                >
                  {["Full time", "Part time", "Contract", "Freelance"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setEmploymentType(employmentType === type ? "" : type)
                        }
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
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
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Workplace Type */}
                <div>
                  <label
                    className={`block font-bold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Workplace type
                  </label>
                  <div
                    className={`flex rounded-2xl p-1 gap-1 w-fit ${isDark ? "bg-[#252525]" : "bg-[#F1F3F6]"}`}
                  >
                    {["Onsite", "Remote", "Hybrid"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setWorkplaceType(workplaceType === type ? "" : type)
                        }
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
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

                {/* Salary */}
                <div>
                  <label
                    className={`block font-bold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Minimum salary
                  </label>
                  <div className="relative">
                    <FaDollarSign
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-blue-400" : "text-[#163D5C]"}`}
                    />
                    <input
                      type="number"
                      className={`w-full pl-12 pr-4 py-4 border-none rounded-2xl focus:ring-2 outline-none font-bold transition-all ${
                        isDark
                          ? "bg-[#252525] text-white focus:ring-blue-900"
                          : "bg-[#F9FAFB] focus:ring-blue-100"
                      }`}
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

        {/* --- SEARCH BAR --- */}
        <div className="relative mb-10">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            className={`w-full pl-16 pr-40 py-5 rounded-2xl shadow-sm focus:outline-none font-medium transition-all border ${
              isDark
                ? "bg-[#1E1E1E] border-gray-800 text-white placeholder:text-gray-600"
                : "bg-white border-gray-100 text-gray-600 placeholder:text-gray-300"
            }`}
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className={`absolute right-3 top-1/2 -translate-y-1/2 px-10 py-3 rounded-xl font-bold transition-all ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#163D5C] hover:bg-[#0f2d45]"
            } text-white`}
          >
            Search
          </button>
        </div>

        {/* --- JOB CARDS LIST --- */}
        <div className="space-y-6">
          <p
            className={`font-bold px-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {filteredJobs.length} jobs available
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div
                className={`w-10 h-10 border-4 rounded-full animate-spin ${isDark ? "border-gray-800 border-t-blue-500" : "border-gray-100 border-t-[#163D5C]"}`}
              ></div>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const reaction = getReaction(job.id);
              const isMatch =
                userSkills.length > 0 &&
                userSkills.some(
                  (s) =>
                    job.specialty?.toLowerCase().includes(s) ||
                    job.occupation?.toLowerCase().includes(s),
                );

              return (
                <div
                  key={job.id}
                  className={`rounded-[32px] p-8 border transition-all duration-500 ${
                    isMatch
                      ? isDark
                        ? "border-blue-900/50 bg-blue-900/10 shadow-lg shadow-blue-900/5"
                        : "border-blue-100 bg-blue-50/10 shadow-md"
                      : isDark
                        ? "bg-[#1E1E1E] border-gray-800 shadow-sm"
                        : "bg-white border-gray-50 shadow-sm"
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
                          src={
                            job.company?.profileimg_url ||
                            nonImg
                          }
                          alt="logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}
                        >
                          {job.company?.company_name}
                        </h3>
                        <p className="text-gray-400 text-sm font-bold">
                          {job.company.city}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4].map((i) => (
                            <span key={i} className="text-yellow-500 text-sm">
                              ★
                            </span>
                          ))}
                          <span
                            className={`${isDark ? "text-gray-700" : "text-gray-200"} text-sm`}
                          >
                            ★
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <div
                        className={`flex items-center gap-2 font-bold text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <FaCity className="text-blue-400" />{" "}
                        {job.company.city || "Uzbekistan"}
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
                        className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-800"}`}
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
                      className={`text-2xl font-black ${isDark ? "text-blue-400" : "text-slate-800"}`}
                    >
                      ${job.salary_min}-{job.salary_max}
                    </span>
                  </div>

                  <p
                    className={`text-sm font-medium leading-relaxed mb-6 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {job.description || "No description provided..."}
                  </p>

                  <div className="mb-8">
                    <p
                      className={`font-black text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-800"}`}
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
                        {job.skils}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-end gap-4 pt-6 border-t ${isDark ? "border-gray-800" : "border-gray-50"}`}
                  >
                    <button
                      onClick={() => toggleLike(job.id)}
                      className={`transition-colors mr-3 ${
                        reaction === "like"
                          ? "text-green-500"
                          : "text-gray-500 hover:text-green-400"
                      }`}
                    >
                      <FaThumbsUp size={22} />
                    </button>
                    <button
                      onClick={() => toggleDislike(job.id)}
                      className={`transition-colors mr-auto ${
                        reaction === "dislike"
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-400"
                      }`}
                    >
                      <FaThumbsDown size={22} />
                    </button>

                    <button
                      onClick={() => navigate(`/job-post/${job.id}`)}
                      className={`px-10 py-4 rounded-2xl font-black transition-all shadow-lg ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
                          : "bg-[#163D5C] hover:bg-[#0f2d45] shadow-blue-900/10"
                      } text-white`}
                    >
                      Quick apply
                    </button>

                    <button
                      onClick={() => navigate(`/job-details/${job.company_id}`)}
                      className={`px-8 py-4 border-2 rounded-2xl font-black transition-all ${
                        isDark
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-[#163D5C] text-[#163D5C] hover:bg-gray-50"
                      }`}
                    >
                      View job post
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
