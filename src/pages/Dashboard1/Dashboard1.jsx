import React, { useEffect, useState } from "react";
import { talentApi } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../Context/ThemeContext.jsx";

const Dashboard1 = () => {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { id } = jwtDecode(token);
        const res = await talentApi.getById(id);
        const data = res.data;

        const values = Object.values(data);
        const filtered = values.filter(
          (v) =>
            typeof v !== "number" &&
            v !== data.createdAt &&
            v !== data.updatedAt
        );

        const filled = filtered.filter((v) => {
          if (v === null || v === "") return false;
          if (typeof v === "string" && (v === "[]" || v === "{}")) return false;
          if (Array.isArray(v)) return v.length > 0;
          if (typeof v === "object") return Object.keys(v).length > 0;
          return true;
        });

        const completion = Math.round((filled.length / filtered.length) * 100);
        setPercent(Math.min(completion, 100));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getProgressColor = (percentage) => {
    if (percentage <= 30) return "#f7481d";
    if (percentage <= 70) return "#FB959D";
    return "#5ABF89";
  };

  const CircleProgress = ({ percentage }) => {
    const [size, setSize] = useState(100);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 400) setSize(90);
        else if (window.innerWidth < 500) setSize(100);
        else if (window.innerWidth < 640) setSize(110);
        else if (window.innerWidth < 768) setSize(120);
        else if (window.innerWidth < 1024) setSize(130);
        else setSize(144);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const strokeWidth = Math.max(12, size * 0.1);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? "#FFFFFF22" : "#FFFFFF33"}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor(percentage)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s, stroke 0.4s" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-xl xs:text-2xl sm:text-3xl font-bold">
            {percentage}%
          </p>
          <p className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider mt-1">
            Complete
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[250px] xs:h-[280px] sm:h-[350px]">
        <div className="animate-spin h-6 w-6 xs:h-7 xs:w-7 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pt-0 lg:pt-6">
        <div
          className={`w-full lg:max-w-[350px] mx-auto lg:mx-0 
          h-[250px] xs:h-[280px] sm:h-[350px] rounded-xl flex flex-col items-center justify-center px-3 xs:px-4
          ${
            isDark
              ? "bg-gradient-to-b from-[#0F172A] to-[#1E293B]"
              : "bg-gradient-to-b from-[#163D5C] to-[#6D89CF]"
          }`}
        >
          <h1 className="text-white text-base xs:text-lg sm:text-xl font-bold text-center">
            Profile completed
          </h1>

          <div className="py-4 xs:py-5 sm:py-6 md:py-8">
            <CircleProgress percentage={percent} />
          </div>

          <p className="text-white/90 text-[11px] xs:text-xs sm:text-sm text-center px-2 xs:px-3 sm:px-4 leading-tight">
            Complete all parts of your profile and{" "}
            <br className="hidden xs:block" />
            increase your chances of finding a job
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
