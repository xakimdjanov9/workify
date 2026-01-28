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
                        const rawSkills = userRes.data?.skils || [];
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
            
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                {/* --- SEARCH BAR --- */}
                <div className="relative mb-8">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        className="w-full pl-16 pr-40 py-5 rounded-2xl shadow-sm focus:outline-none border border-gray-100 bg-white"
                        placeholder="Search jobs by title or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-10 py-3 rounded-xl font-bold bg-[#163D5C] text-white hover:bg-[#0f2d45] transition-all">
                        Search
                    </button>
                </div>

                {/* --- JOB LIST --- */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl font-bold text-[#163D5C]">Available Jobs</h2>
                        <p className="font-bold text-gray-500">{filteredJobs.length} results</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#163D5C] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        filteredJobs.map((job) => {
                            const isMatch = userSkills.some(s => 
                                job.specialty?.toLowerCase().includes(s) || 
                                job.occupation?.toLowerCase().includes(s)
                            );

                            return (
                                <div key={job.id} className={`rounded-[32px] p-8 border bg-white transition-all shadow-sm hover:shadow-md ${isMatch ? "border-blue-200 bg-blue-50/5" : "border-gray-50"}`}>
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-50 bg-white p-2 shrink-0">
                                                <img src={job.company?.profileimg_url || NonImg} alt="logo" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{job.company?.company_name}</h3>
                                                <p className="text-gray-400 text-sm font-bold">{job.location || "Remote"}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end gap-2">
                                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-[#E7F8F0] text-[#52D394]">
                                                {job.workplace_type || "Onsite"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-between items-center mt-6 mb-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-slate-800">{job.occupation}</h2>
                                            {isMatch && <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">Best Match</span>}
                                        </div>
                                        <span className="text-2xl font-black text-slate-800">${job.salary_min} - ${job.salary_max}</span>
                                    </div>

                                    <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2">{job.description}</p>

                                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
                                        <button className="text-gray-400 hover:text-red-400 mr-auto"><FaThumbsDown size={20} /></button>
                                        <button onClick={() => navigate(`/job-post/${job.id}`)} className="px-10 py-4 rounded-2xl font-black bg-[#163D5C] text-white hover:bg-[#0f2d45] transition-all shadow-lg shadow-blue-900/10">
                                            Quick apply
                                        </button>
                                        <button onClick={() => navigate(`/job-details/${job.id}`)} className="px-8 py-4 border-2 border-[#163D5C] text-[#163D5C] rounded-2xl font-black hover:bg-gray-50 transition-all">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}