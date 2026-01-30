import React, { useState, useEffect } from "react";
import { jobApi, talentApi } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronDown, FaCity, FaThumbsDown } from "react-icons/fa";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import NonImg from '../../assets/img.jpg'

export default function HomeJob() {
    const [allJobs, setAllJobs] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                let lowerUserSkills = [];

                // 1. Foydalanuvchi mahoratlarini olish (agar token bo'lsa)
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        const userRes = await talentApi.getById(decoded.id);
                        const rawSkills = userRes.data?.skills || [];
                        lowerUserSkills = (Array.isArray(rawSkills) 
                            ? rawSkills 
                            : rawSkills.split(",").map(s => s.trim())
                        ).map(s => s.toLowerCase());
                        setUserSkills(lowerUserSkills);
                    } catch (e) { console.error("User skills error:", e); }
                }

                // 2. Ishlarni olish (Hamma uchun ochiq)
                const jobRes = await jobApi.getAll();
                const jobs = Array.isArray(jobRes.data) ? jobRes.data : [];

                // 3. Saralash (Skills bo'yicha)
                const sortedJobs = [...jobs].sort((a, b) => {
                    const aMatch = lowerUserSkills.some(s => 
                        a.specialty?.toLowerCase().includes(s) || a.occupation?.toLowerCase().includes(s)
                    );
                    const bMatch = lowerUserSkills.some(s => 
                        b.specialty?.toLowerCase().includes(s) || b.occupation?.toLowerCase().includes(s)
                    );
                    return bMatch - aMatch;
                });

                setAllJobs(sortedJobs);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const filteredJobs = allJobs.filter((job) => {
        return searchQuery
            ? job.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
    });

    return (
        <div className="bg-[#F9FAFB] min-h-screen font-sans text-[#1E293B]">
            <Header />
            
            <div className="max-w-5xl mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-0 py-4 sm:py-6 md:py-8">
                {/* --- SEARCH BAR --- */}
                <div className="relative mb-6 sm:mb-8">
                    <FaSearch className="absolute left-4 xs:left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl z-10" />
                    <input
                        type="text"
                        className="w-full pl-11 xs:pl-12 sm:pl-16 pr-28 xs:pr-32 sm:pr-40 py-3.5 xs:py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-sm focus:outline-none border border-gray-100 bg-white text-sm xs:text-base"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 px-4 xs:px-6 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-3 rounded-lg sm:rounded-xl font-bold bg-[#163D5C] text-white hover:bg-[#0f2d45] transition-all text-xs xs:text-sm sm:text-base whitespace-nowrap">
                        Search
                    </button>
                </div>

                {/* --- JOB LIST HEADER --- */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0 px-2 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#163D5C]">Available Jobs</h2>
                    <p className="font-bold text-gray-500 text-sm sm:text-base">{filteredJobs.length} results</p>
                </div>

                {/* --- JOB LIST --- */}
                <div className="space-y-4 sm:space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-12 sm:py-16 md:py-20">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#163D5C] rounded-full animate-spin"></div>
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                            const isMatch = userSkills.some(s => 
                                job.specialty?.toLowerCase().includes(s) || 
                                job.occupation?.toLowerCase().includes(s)
                            );

                            return (
                                <div key={job.id} className={`rounded-2xl sm:rounded-[32px] p-4 xs:p-5 sm:p-6 md:p-8 border bg-white transition-all shadow-sm hover:shadow-md ${isMatch ? "border-blue-200 bg-blue-50/5" : "border-gray-50"}`}>
                                    {/* Company Info */}
                                    <div className="flex flex-col xs:flex-row justify-between gap-4 sm:gap-6">
                                        <div className="flex gap-3 sm:gap-5 items-start sm:items-center">
                                            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-50 bg-white p-1.5 xs:p-2 shrink-0">
                                                <img 
                                                    src={job.company?.profileimg_url || NonImg} 
                                                    alt={`${job.company?.company_name || 'Company'} logo`} 
                                                    className="w-full h-full object-contain" 
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = NonImg;
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 truncate xs:break-words">
                                                    {job.company?.company_name || "Company"}
                                                </h3>
                                                <p className="text-gray-400 text-xs sm:text-sm font-bold mt-1 flex items-center">
                                                    <FaCity className="inline mr-1.5" size={12} />
                                                    {job.location || "Remote"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start xs:items-end gap-2">
                                            <span className="px-3 py-1 rounded-full text-[10px] xs:text-[11px] font-black uppercase bg-[#E7F8F0] text-[#52D394] whitespace-nowrap">
                                                {job.workplace_type || "Onsite"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Job Title and Salary */}
                                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-0 mt-4 sm:mt-6 mb-3 sm:mb-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 truncate xs:break-words">
                                                {job.occupation || "Job Title"}
                                            </h2>
                                            {isMatch && (
                                                <span className="bg-blue-600 text-white text-[10px] xs:text-[11px] px-2.5 xs:px-3 py-1 rounded-full font-black uppercase whitespace-nowrap shrink-0">
                                                    Best Match
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
                                                ${job.salary_min || "0"} - ${job.salary_max || "0"}
                                            </span>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">per month</p>
                                        </div>
                                    </div>

                                    {/* Job Description */}
                                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-4 sm:mb-6 line-clamp-2 xs:line-clamp-3">
                                        {job.description || "No description available"}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-50">
                                        <button 
                                            className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-50 transition-colors self-start xs:self-auto"
                                            aria-label="Not interested"
                                        >
                                            <FaThumbsDown size={18} sm:size={20} />
                                        </button>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3 w-full xs:w-auto">
                                            <button 
                                                onClick={() => navigate(`/job-post/${job.id}`)} 
                                                className="px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black bg-[#163D5C] text-white hover:bg-[#0f2d45] transition-all shadow-lg shadow-blue-900/10 text-sm xs:text-base w-full sm:w-auto text-center"
                                            >
                                                Quick apply
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/job-details/${job.id}`)} 
                                                className="px-6 xs:px-8 sm:px-8 py-3 xs:py-3.5 sm:py-4 border-2 border-[#163D5C] text-[#163D5C] rounded-xl sm:rounded-2xl font-black hover:bg-gray-50 transition-all text-sm xs:text-base w-full sm:w-auto text-center"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // No jobs found state
                        <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-2xl border border-gray-100">
                            <div className="text-gray-400 mb-4">
                                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No jobs found</h3>
                                <p className="text-gray-500 max-w-md mx-auto px-4">
                                    {searchQuery ? `No jobs matching "${searchQuery}"` : "No job listings available"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}