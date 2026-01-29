import React, { useEffect, useState } from "react";
import { talentApi } from "../../services/api";
import { CiLocationOn } from "react-icons/ci";
import Header from "../../pages/Header/Header";
import Footer from "../../pages/Footer/Footer";
import img from "../../assets/img.jpg";

const HomeTalents = () => {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await talentApi.getAll();
        setTalents(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAll();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow w-full bg-slate-200 flex flex-col px-4 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8">
        <h1 className="text-lg md:text-xl text-gray-600 border-b-2 border-gray-300 font-semibold mb-2 md:mb-3">
          {talents.length} talents
        </h1>
        {talents.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-lg py-4 md:py-6 my-3 md:my-4"
          >
            <div className="flex flex-col md:flex-row justify-between px-4 md:px-6 gap-4 md:gap-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <img
                  src={item.image || img}
                  alt={item.first_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = img;
                  }}
                />
                <div className="sm:max-w-xs md:max-w-md lg:max-w-lg">
                  <h3 className="text-lg sm:text-xl font-semibold break-words">
                    {item.specialty} {item.occupation}
                  </h3>
                  <p className="text-gray-600">
                    {item.first_name} {item.last_name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2 sm:gap-4 md:gap-0">
                <p className="flex items-center text-sm md:text-base">
                  <CiLocationOn className="inline-block mr-1" /> {item.location}
                </p>
                <h1 className="text-start sm:text-center md:text-end font-semibold text-lg md:text-xl">
                  ${item.minimum_salary}
                </h1>
              </div>
            </div>

            <div className="py-4 md:py-6 border-b-2 px-4 md:px-6">
              <p className="text-sm md:text-base text-gray-700 line-clamp-3 md:line-clamp-none">
                {item.about}
              </p>
            </div>

            <div className="px-4 md:px-6 py-4 md:py-6">
              <h2 className="text-gray-500 pb-2 md:pb-3 text-sm md:text-base">
                Required skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {item.skills &&
                  JSON.parse(item.skills).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 md:px-3 py-1 md:py-2 border rounded-lg text-xs md:text-sm bg-slate-100 text-gray-600 break-words"
                    >
                      {skill.skill} ({skill.experience_years})
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex justify-center sm:justify-end px-4 md:px-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  className="
  bg-blue-950 text-white rounded-lg px-8 py-2 font-semibold 
  hover:scale-105 hover:shadow-lg hover:shadow-blue-950/30 
  active:scale-95 transition-all duration-300
"
                >
                  View profile
                </button>

                <button
                  className="
  bg-white text-blue-950 font-semibold border-2 border-blue-950 px-5 py-2 rounded-lg
  hover:bg-blue-50 hover:scale-105 hover:shadow-md 
  active:scale-95 transition-all duration-300
"
                >
                  Resume
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default HomeTalents;
