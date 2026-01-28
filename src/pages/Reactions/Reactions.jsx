import React, { useEffect, useMemo, useState } from "react";
import { jobApi } from "../../services/api";
import { useJobReactions } from "../../Context/JobReactionsContext";
import { useTheme } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaCity, FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";

export default function Reactions() {
  const navigate = useNavigate();

  const {
    reactions,
    getReaction,
    toggleLike,
    toggleDislike,
    clearReaction,
    clearAll,
  } = useJobReactions();

  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ filter: all | like | dislike
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobApi.getAll();
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Reactionni bir xil usulda olish
  const getJobReaction = (jobId) =>
    getReaction ? getReaction(jobId) : reactions[jobId];

  // ✅ All reacted jobs
  const reactedJobs = useMemo(() => {
    return jobs.filter((job) => Boolean(getJobReaction(job.id)));
  }, [jobs, reactions]); // getReaction context ichida bo'lishi mumkin, reactions o'zgarsa qayta hisoblanadi

  // ✅ Counts (badge uchun)
  const counts = useMemo(() => {
    let like = 0;
    let dislike = 0;

    for (const job of reactedJobs) {
      const r = getJobReaction(job.id);
      if (r === "like") like++;
      if (r === "dislike") dislike++;
    }

    return { all: reactedJobs.length, like, dislike };
  }, [reactedJobs, reactions]);

  // ✅ Filtered list
  const filteredJobs = useMemo(() => {
    if (filter === "all") return reactedJobs;
    return reactedJobs.filter((job) => getJobReaction(job.id) === filter);
  }, [filter, reactedJobs, reactions]);

  const filterBtnClass = (active) =>
    `px-4 py-2 rounded-xl font-black text-sm border transition-all ${
      active
        ? isDark
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-[#163D5C] border-[#163D5C] text-white"
        : isDark
        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
        : "border-gray-200 text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 p-4 md:p-8 font-sans ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F9FAFB] text-[#1E293B]"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <h1 className="text-2xl font-black">Reactions</h1>

          {/* ✅ FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 md:ml-4">
            <button
              onClick={() => setFilter("all")}
              className={filterBtnClass(filter === "all")}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setFilter("like")}
              className={filterBtnClass(filter === "like")}
            >
              Liked ({counts.like})
            </button>
            <button
              onClick={() => setFilter("dislike")}
              className={filterBtnClass(filter === "dislike")}
            >
              Disliked ({counts.dislike})
            </button>
          </div>

          <button
            onClick={clearAll}
            className={`md:ml-auto px-6 py-3 rounded-xl font-black transition-all border ${
              isDark
                ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            title="Clear all"
          >
            Clear all
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className={`w-10 h-10 border-4 rounded-full animate-spin ${
                isDark
                  ? "border-gray-800 border-t-blue-500"
                  : "border-gray-100 border-t-[#163D5C]"
              }`}
            ></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            {filter === "all"
              ? "No liked or disliked jobs yet."
              : filter === "like"
              ? "No liked jobs yet."
              : "No disliked jobs yet."}
          </p>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => {
              const reaction = getJobReaction(job.id);

              return (
                <div
                  key={job.id}
                  className={`rounded-[32px] p-8 border transition-all duration-500 ${
                    isDark
                      ? "bg-[#1E1E1E] border-gray-800 shadow-sm"
                      : "bg-white border-gray-50 shadow-sm"
                  }`}
                >
                  {/* header */}
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
                            "https://via.placeholder.com/100"
                          }
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

                        {/* reaction badge */}
                        <div className="mt-2">
                          {reaction === "like" ? (
                            <span className="inline-flex items-center gap-2 text-green-500 font-bold text-sm">
                              <FaThumbsUp /> Liked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-red-500 font-bold text-sm">
                              <FaThumbsDown /> Disliked
                            </span>
                          )}
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

                  {/* title + salary */}
                  <div className="flex flex-wrap justify-between items-center mt-6 mb-4">
                    <h2
                      className={`text-2xl font-black ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {job.occupation}
                    </h2>

                    <span
                      className={`text-2xl font-black ${
                        isDark ? "text-blue-400" : "text-slate-800"
                      }`}
                    >
                      ${job.salary_min}-{job.salary_max}
                    </span>
                  </div>

                  {/* description */}
                  <p
                    className={`text-sm font-medium leading-relaxed mb-6 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {job.description || "No description provided..."}
                  </p>

                  {/* skills */}
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
                        {job.skils}
                      </span>
                    </div>
                  </div>

                  {/* actions */}
                  <div
                    className={`flex flex-wrap items-center justify-end gap-4 pt-6 border-t ${
                      isDark ? "border-gray-800" : "border-gray-50"
                    }`}
                  >
                    {/* Like */}
                    <button
                      onClick={() => toggleLike(job.id)}
                      className={`transition-colors mr-auto ${
                        reaction === "like"
                          ? "text-green-500"
                          : "text-gray-500 hover:text-green-400"
                      }`}
                      title="Like"
                    >
                      <FaThumbsUp size={22} />
                    </button>

                    {/* Dislike */}
                    <button
                      onClick={() => toggleDislike(job.id)}
                      className={`transition-colors ${
                        reaction === "dislike"
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-400"
                      }`}
                      title="Dislike"
                    >
                      <FaThumbsDown size={22} />
                    </button>

                    {/* Clear single */}
                    <button
                      onClick={() => clearReaction(job.id)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                      title="Delete"
                    >
                      <FaTrash size={18} />
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
