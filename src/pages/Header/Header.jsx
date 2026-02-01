import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiBriefcase,
  FiMenu,
  FiX,
  FiLayout,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { talentApi } from "../../services/api";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 850) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const res = await talentApi.getById(decoded.id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogoutModal(false);
    navigate("/signin");
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <nav
        className={`px-4 sm:px-6 md:px-8 lg:px-16 py-3 bg-white border-b border-gray-100 sticky top-0 z-[60] transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              workify<span className="text-[#163D5C]">.</span>
            </h1>
          </Link>

          <div className="hidden min-[850px]:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-gray-500">
            <Link
              to="/talents"
              className="flex items-center gap-2 hover:text-[#163D5C] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <FiUser className="text-base" />
              <span className="hidden sm:inline">Talents</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 hover:text-[#163D5C] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <FiBriefcase className="text-base" />
              <span className="hidden sm:inline">Jobs</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#163D5C] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <FiLayout className="text-base" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-1 pr-2 sm:pr-4 rounded-full border border-gray-100 hover:shadow-md transition-all duration-200 hover:bg-white"
                >
                  <img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt="profile"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-800 leading-none truncate max-w-[100px] lg:max-w-none">
                      {user.first_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Profile
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/signin"
                  className="hidden sm:block text-sm font-bold text-slate-700 hover:text-[#163D5C] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/registration/step-1"
                  className="hidden min-[850px]:block px-4 sm:px-5 py-2 sm:py-2.5 bg-[#163D5C] text-white text-sm rounded-xl font-bold hover:opacity-90 transition-all duration-200 hover:shadow-md"
                >
                  Join Now
                </Link>
              </div>
            )}

            {!user && (
              <Link
                to="/registration/step-1"
                className="min-[850px]:hidden px-3 sm:px-4 py-2 bg-[#163D5C] text-white text-xs sm:text-sm rounded-xl font-bold hover:opacity-90 transition-all duration-200"
              >
                Join
              </Link>
            )}

            <button
              className="min-[850px]:hidden text-2xl text-slate-800 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-1"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[70] transition-all duration-300 ${
          open
            ? "opacity-100 visible bg-black/20"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <span className="font-bold text-lg sm:text-xl">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 bg-gray-100 rounded-full text-xl sm:text-2xl hover:bg-gray-200 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            {user ? (
              <>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-2xl">
                  <img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt={user.first_name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base sm:text-lg truncate">
                      {user.first_name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiLayout className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiUser className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/talents"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiUser className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>Talents</span>
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiBriefcase className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>Jobs</span>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 p-3 sm:p-4 mt-4 text-red-500 font-bold border border-red-100 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                  >
                    <FiLogOut />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    to="/talents"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiUser className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>Talents</span>
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-slate-700 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FiBriefcase className="text-[#163D5C] text-lg sm:text-xl" />
                    <span>Jobs</span>
                  </Link>
                </div>
                <div className="pt-2 sm:pt-4 flex flex-col gap-3">
                  <Link
                    to="/signin"
                    onClick={closeMobileMenu}
                    className="w-full py-3 sm:py-4 text-center font-bold text-slate-700 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/registration/step-1"
                    onClick={closeMobileMenu}
                    className="w-full py-3 sm:py-4 text-center font-bold text-white bg-[#163D5C] rounded-2xl hover:opacity-90 transition-colors duration-200"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 max-w-xs sm:max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="text-2xl sm:text-3xl text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Log out
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                Are you sure you want to log out? You will need to log in again
                to access your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-slate-700 font-bold rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
                >
                  No, cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors duration-200 shadow-lg shadow-red-500/30 text-sm sm:text-base"
                >
                  Yes, log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
