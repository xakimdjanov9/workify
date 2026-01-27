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
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    navigate("/signin");
  };

  return (
    <>
      <nav className="px-4 sm:px-6 md:px-16 py-3 bg-white border-b border-gray-100 sticky top-0 z-[60]">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              workify<span className="text-[#163D5C]">.</span>
            </h1>
          </Link>

          <div className="hidden min-[850px]:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <Link
              to="/talents"
              className="flex items-center gap-2 hover:text-[#163D5C] transition"
            >
              <FiUser /> Talents
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 hover:text-[#163D5C] transition"
            >
              <FiBriefcase /> Jobs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#163D5C] transition mr-2"
                >
                  <FiLayout /> Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-100 hover:shadow-md transition"
                >
                  <img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-[13px] font-bold text-slate-800 leading-none">
                      {user.first_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Profile
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="hidden sm:block text-sm font-bold text-slate-700 hover:text-[#163D5C] transition px-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/registration/step-1"
                  className="hidden min-[850px]:block px-5 py-2.5 bg-[#163D5C] text-white text-sm rounded-xl font-bold hover:opacity-90 transition"
                >
                  Join Now
                </Link>
              </div>
            )}

            <button
              className="min-[850px]:hidden text-2xl ml-2 text-slate-800"
              onClick={() => setOpen(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-[70] transform transition-transform duration-500 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <span className="font-bold text-xl">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 bg-gray-100 rounded-full text-2xl"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {user ? (
            <>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <img
                  src={user.image || "https://via.placeholder.com/150"}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg">{user.first_name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-slate-700"
                >
                  <FiLayout className="text-[#163D5C]" /> Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-slate-700"
                >
                  <FiUser className="text-[#163D5C]" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 mt-4 text-red-500 font-bold border border-red-100 rounded-2xl bg-red-50"
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Link
                to="/talents"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-lg font-bold text-slate-700 border-b pb-4"
              >
                <FiUser className="text-[#163D5C]" /> Talents
              </Link>
              <Link
                to="/jobs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-lg font-bold text-slate-700 border-b pb-4"
              >
                <FiBriefcase className="text-[#163D5C]" /> Jobs
              </Link>
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 text-center font-bold text-slate-700 bg-gray-50 rounded-2xl"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 text-center font-bold text-white bg-[#163D5C] rounded-2xl"
                >
                  Join Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
