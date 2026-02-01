import React, { useEffect, useState } from "react";
import { applicationApi } from "../../services/api";
import {
  FaChevronDown,
  FaBriefcase,
  FaClock,
  FaFileContract,
  FaUserTie,
  FaMapMarkerAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import CompImg from "../../assets/bg.png";
import { useTheme } from "../../Context/ThemeContext.jsx";

export default function JobAlerts() {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getAll();
      let allApplications = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const token = localStorage.getItem("token");
      let myFilteredApps = [];

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId =
            payload.id ||
            payload.userId ||
            payload.user_id ||
            payload.talentId ||
            payload.talent_id ||
            payload.applicantId ||
            payload.applicant_id ||
            payload.profileId;

          if (userId) {
            myFilteredApps = allApplications.filter(
              (app) =>
                app.talentId === userId ||
                app.talent_id === userId ||
                app.applicantId === userId ||
                app.applicant_id === userId ||
                app.userId === userId ||
                app.user_id === userId ||
                app.profileId === userId
            );
          } else {
            myFilteredApps = allApplications;
          }
        } catch (e) {
          myFilteredApps = allApplications;
        }
      } else {
        myFilteredApps = allApplications;
      }
      setApplications(myFilteredApps);
    } catch (err) {
      toast.error("Error fetching applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationApi.delete(id);
        toast.success("Application deleted successfully.");
        setApplications(applications.filter((app) => app.id !== id));
      } catch (err) {
        toast.error("Error deleting application.");
      }
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-500 p-4 md:p-8 ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F9FAFB] text-[#1E293B]"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`rounded-3xl shadow-sm border transition-all duration-500 mb-8 overflow-hidden ${
            isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div
            className={`p-6 border-b flex justify-between items-center ${
              isDark ? "border-gray-800" : "border-gray-50"
            }`}
          >
            <h2
              className={`text-xl md:text-2xl font-semibold ${
                isDark ? "text-blue-400" : "text-[##505151]"
              }`}
            >
              Job Alerts
            </h2>
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`p-2 rounded-full transition-all ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isFilterExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isFilterExpanded
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-8">
              <label
                className={`block font-bold mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Filter by Status
              </label>
              <div
                className={`flex flex-wrap rounded-2xl p-1 gap-1 w-fit ${
                  isDark ? "bg-[#252525]" : "bg-[#F1F3F6]"
                }`}
              >
                {[
                  { id: "all", label: "All", icon: <FaBriefcase /> },
                  { id: "pending", label: "Pending", icon: <FaClock /> },
                  {
                    id: "accepted",
                    label: "Accepted",
                    icon: <FaFileContract />,
                  },
                  { id: "rejected", label: "Rejected", icon: <FaUserTie /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                      filterStatus === tab.id
                        ? isDark
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-[#163D5C] shadow-sm"
                        : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p
            className={`font-bold ml-2 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {filteredApps.length} applications found
          </p>

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
          ) : filteredApps.length === 0 ? (
            <div
              className={`text-center py-20 rounded-[32px] border border-dashed ${
                isDark
                  ? "bg-[#1E1E1E] border-gray-700 text-gray-500"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              No applications found for the selected filter.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className={`rounded-[32px] p-8 border transition-all duration-500 hover:shadow-lg ${
                  isDark
                    ? "bg-[#1E1E1E] border-gray-800 hover:border-gray-700"
                    : "bg-white border-gray-50 shadow-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-5">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border p-2 shrink-0 ${
                        isDark
                          ? "bg-[#252525] border-gray-700"
                          : "bg-[#F9FAFB] border-gray-100"
                      }`}
                    >
                      <img
                        src={app.job?.company?.profileimg_url || CompImg}
                        alt="logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-black ${
                          isDark ? "text-gray-100" : "text-slate-800"
                        }`}
                      >
                        {app.job?.occupation}
                      </h3>
                      <p className="text-gray-400 font-bold text-sm">
                        {app.job?.company?.company_name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-bold">
                        <span
                          className={`flex items-center gap-1 ${
                            isDark ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          <FaMapMarkerAlt className="text-blue-400" />{" "}
                          {app.job?.location}
                        </span>
                        <span
                          className={`uppercase px-3 py-1 rounded-lg text-[10px] ${
                            app.status === "accepted"
                              ? "bg-green-500/10 text-green-500"
                              : app.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : isDark
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p
                      className={`text-2xl font-black ${
                        isDark ? "text-blue-400" : "text-slate-800"
                      }`}
                    >
                      ${app.job?.salary_max || 0}.00
                    </p>
                    <p className="text-gray-500 text-xs font-bold mt-1">
                      Applied on:{" "}
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-6 pt-6 border-t flex items-center justify-between ${
                    isDark ? "border-gray-800" : "border-gray-50"
                  }`}
                >
                  <p
                    className={`text-sm italic line-clamp-1 max-w-[70%] ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    "{app.cover_letter || "No cover letter provided."}"
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(app.id)}
                      className={`p-4 rounded-2xl transition-all ${
                        isDark
                          ? "bg-red-900/20 text-red-500 hover:bg-red-900/40"
                          : "bg-red-50 text-red-400 hover:bg-red-100"
                      }`}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
