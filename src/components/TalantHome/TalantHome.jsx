import React from "react";
import {
  HiOutlineUserAdd,
  HiOutlineChatAlt2,
  HiOutlineSearch,
} from "react-icons/hi";
import { FiBriefcase } from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";
import heroImage from "../../assets/homeimg.png";
import Header from "../../pages/Header/Header";
import Footer from "../../pages/Footer/Footer";

const TalantHome = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      <Header />

      <section className="relative px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center max-w-[1440px] mx-auto gap-8 sm:gap-12">
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left order-2 lg:order-1">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[50px] font-extrabold leading-tight sm:leading-tight md:leading-tight text-slate-900 mb-4 sm:mb-6">
            Find aspiring talents{" "}
            <br className="hidden xs:inline-block md:block" /> and great
            employers
          </h2>
          <p className="text-gray-500 text-xs xs:text-sm sm:text-base mb-6 sm:mb-8 max-w-xs xs:max-w-sm sm:max-w-md mx-auto lg:mx-0 leading-relaxed">
            Finding the best candidate is always hard. Tell us what you are
            looking for and choose one from among the best.
          </p>

          {/* <div className="bg-white p-1.5 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center gap-1.5 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg border border-gray-100">
            <div className="flex-1 px-3 py-2 text-left w-full border-b sm:border-b-0 sm:border-r border-gray-100">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Hire a talent
              </label>
              <div className="flex items-center gap-2">
                <HiOutlineSearch className="text-gray-300 text-xs" />
                <input
                  type="text"
                  placeholder="Who are you looking for?"
                  className="w-full outline-none text-xs text-slate-700 placeholder:text-gray-300 bg-transparent"
                />
              </div>
            </div>

            <div className="flex-1 px-3 py-2 text-left w-full">
              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Find a job
              </label>
              <div className="flex items-center gap-2">
                <MdOutlineWorkOutline className="text-gray-300 text-xs" />
                <input
                  type="text"
                  placeholder="What job are you looking for?"
                  className="w-full outline-none text-xs text-slate-700 placeholder:text-gray-300 bg-transparent"
                />
              </div>
            </div>

            <button className="bg-[#1B3B5A] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs w-full sm:w-auto active:scale-95 hover:bg-slate-800 transition-colors duration-300">
              Search
            </button>
          </div> */}
        </div>

        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2 relative px-2 xs:px-4">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-[60px] xs:blur-[80px] sm:blur-[100px] opacity-30 scale-75 xs:scale-90 sm:scale-100 md:scale-110 lg:scale-125 xl:scale-150"></div>
          <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-auto lg:h-[500px] xl:h-[550px] object-contain relative z-10 transition-transform duration-500 hover:scale-105"
          />
        </div>
      </section>

      <section className="px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 sm:py-12 md:py-16 bg-gray-50/40">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl border border-gray-200 bg-white flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-100">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3">
                <HiOutlineUserAdd className="text-xl xs:text-2xl sm:text-3xl text-slate-300" />
              </div>
              <h4 className="font-bold text-sm xs:text-base sm:text-lg mb-1 xs:mb-2">
                Professional recruiter
              </h4>
              <p className="text-gray-400 text-xs xs:text-sm sm:text-sm line-clamp-2">
                Finding the best candidate is always hard.
              </p>
            </div>

            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl border border-gray-200 bg-white flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-100">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-blue-50 flex items-center justify-center rounded-xl xs:rounded-2xl mb-3">
                <FiBriefcase className="text-lg xs:text-xl sm:text-2xl text-[#1B3B5A]" />
              </div>
              <h4 className="font-bold text-sm xs:text-base sm:text-lg mb-1 xs:mb-2">
                Find the right job fast
              </h4>
              <p className="text-gray-400 text-xs xs:text-sm sm:text-sm line-clamp-2">
                Launch your career on Workify.
              </p>
            </div>

            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl border border-gray-200 bg-white flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-100">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3">
                <HiOutlineChatAlt2 className="text-xl xs:text-2xl sm:text-3xl text-slate-300" />
              </div>
              <h4 className="font-bold text-sm xs:text-base sm:text-lg mb-1 xs:mb-2">
                Professionals need help
              </h4>
              <p className="text-gray-400 text-xs xs:text-sm sm:text-sm line-clamp-2">
                You need various skills.
              </p>
            </div>

            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl xs:rounded-3xl border border-gray-200 bg-white flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-100">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3">
                <HiOutlineSearch className="text-xl xs:text-2xl sm:text-3xl text-slate-300" />
              </div>
              <h4 className="font-bold text-sm xs:text-base sm:text-lg mb-1 xs:mb-2">
                Job search can be boring
              </h4>
              <p className="text-gray-400 text-xs xs:text-sm sm:text-sm line-clamp-2">
                Competition is tough.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TalantHome;
