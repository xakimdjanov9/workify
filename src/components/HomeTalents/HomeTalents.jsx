import React, { useEffect, useState } from "react";
import { talentApi } from "../../services/api";
import { CiLocationOn } from "react-icons/ci";
import Header from "../../pages/Header/Header";
import Footer from "../../pages/Footer/Footer";
import img from "../../assets/img.jpg";

const HomeTalents = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      try {
        setLoading(true);
        const res = await talentApi.getAll();
        setTalents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAll();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow w-full bg-slate-50 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-950 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading talents...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow w-full bg-slate-50">
        <div className="px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-6 md:py-8 lg:py-10">
          {/* Header section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-lg sm:text-xl md:text-2xl text-gray-600 border-b-2 border-gray-300 font-semibold pb-2 md:pb-3">
              {talents.length} talents
            </h1>
          </div>

          {/* Talents list */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {talents.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Top section - responsive layout */}
                <div className="p-4 xs:p-5 sm:p-6 flex flex-col xs:flex-row justify-between gap-4 sm:gap-6">
                  {/* Left side: Profile info */}
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Profile image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || img}
                        alt={`${item.first_name} ${item.last_name}`}
                        className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = img;
                        }}
                      />
                    </div>

                    {/* Name and specialty */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 truncate xs:break-words">
                        {item.specialty} {item.occupation}
                      </h3>
                      <p className="text-gray-600 text-sm xs:text-base mt-1">
                        {item.first_name} {item.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Location and salary */}
                  <div className="flex flex-col xs:items-end gap-2 xs:gap-3 flex-shrink-0">
                    {/* Location */}
                    <div className="flex items-center text-gray-600 text-sm xs:text-base">
                      <CiLocationOn className="inline-block mr-1.5 flex-shrink-0" />
                      <span className="truncate max-w-[200px] xs:max-w-[150px] sm:max-w-none">
                        {item.location}
                      </span>
                    </div>
                    
                    {/* Salary */}
                    <div className="text-start xs:text-end">
                      <h1 className="font-semibold text-lg xs:text-xl text-gray-800">
                        ${item.minimum_salary}
                      </h1>
                      <p className="text-xs xs:text-sm text-gray-500 mt-0.5">minimum salary</p>
                    </div>
                  </div>
                </div>

                {/* About section */}
                <div className="px-4 xs:px-5 sm:px-6 py-4 sm:py-5 border-t border-gray-100">
                  <p className="text-sm xs:text-base text-gray-700 line-clamp-2 xs:line-clamp-3">
                    {item.about}
                  </p>
                </div>

                {/* Skills section */}
                <div className="px-4 xs:px-5 sm:px-6 py-4 sm:py-5 border-t border-gray-100">
                  <h2 className="text-gray-500 pb-2 sm:pb-3 text-sm xs:text-base font-medium">
                    Required skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {item.skills &&
                      JSON.parse(item.skills).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs xs:text-sm bg-slate-50 text-gray-700 hover:bg-slate-100 transition-colors duration-200 break-words"
                        >
                          {skill.skill} ({skill.experience_years}y)
                        </span>
                      ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-4 xs:px-5 sm:px-6 py-4 sm:py-5 border-t border-gray-100 bg-gray-50">
                  <div className="flex flex-col xs:flex-row justify-center xs:justify-end gap-3">
                    <button
                      className="
                        bg-blue-950 text-white rounded-lg px-6 xs:px-8 py-2.5 xs:py-3 
                        font-semibold text-sm xs:text-base hover:scale-[1.02] 
                        hover:shadow-lg hover:shadow-blue-950/30 active:scale-95 
                        transition-all duration-300 w-full xs:w-auto
                      "
                    >
                      View profile
                    </button>

                    <button
                      className="
                        bg-white text-blue-950 font-semibold border-2 border-blue-950 
                        px-6 xs:px-8 py-2.5 xs:py-3 rounded-lg text-sm xs:text-base
                        hover:bg-blue-50 hover:scale-[1.02] hover:shadow-md 
                        active:scale-95 transition-all duration-300 w-full xs:w-auto
                      "
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No talents message */}
          {talents.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="text-gray-400 mb-4">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No talents found</h3>
                <p className="text-gray-500 max-w-md mx-auto">Check back later for new talent listings.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeTalents;