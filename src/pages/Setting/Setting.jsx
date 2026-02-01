import React, { useState } from "react";
import {
  TbWorld,
  TbBrandTelegram,
  TbMail,
  TbHeadset,
  TbLogout,
} from "react-icons/tb";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import Theme from "../../components/Theme/Theme.jsx";

const Setting = () => {
  const { settings, toggleSwitch } = useTheme();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSupportClick = () => {
    window.open("https://t.me/Xakimdjanov7", "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/");
  };

  const CustomToggle = ({ isOn, onToggle }) => (
    <div
      onClick={onToggle}
      className={`relative w-[46px] h-[24px] md:w-[50px] md:h-[26px] flex items-center rounded-full cursor-pointer transition-colors duration-500 ${
        isOn ? "bg-[#55B985]" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute bg-white w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full shadow-sm transition-all duration-500 ${
          isOn ? "translate-x-[24px]" : "translate-x-[4px]"
        }`}
      />
    </div>
  );

  return (
    <div
      className={`min-h-full p-4 sm:p-6 md:p-8 pb-[100px] md:pb-8 font-sans transition-colors duration-500 ${
        settings.darkMode
          ? "bg-[#121212] text-white"
          : "bg-[#F8F9FA] text-gray-800"
      }`}
    >
      <div className="max-w-[900px] mx-auto relative">
        <div
          className={`${
            settings.darkMode
              ? "bg-[#1E1E1E] border-gray-700"
              : "bg-white border-gray-100"
          } p-3 md:p-4 rounded-xl shadow-sm mb-6 border transition-colors`}
        >
          <h1
            className={`text-xl md:text-2xl font-semibold ${
              settings.darkMode ? "text-gray-200" : "text-{#505151}"
            } ml-1`}
          >
            Settings
          </h1>
        </div>

        <div className="mb-8">
          <h2
            className={`text-[16px] md:text-[18px] font-bold mb-4 ${
              settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Notification settings
          </h2>
          <div className="flex flex-col gap-3 md:gap-4">
            <SettingItem
              icon={<TbWorld />}
              title="Website"
              desc="..."
              isOn={settings.website}
              onToggle={() => toggleSwitch("website")}
              CustomToggle={CustomToggle}
              isDark={settings.darkMode}
            />
            <SettingItem
              icon={<TbBrandTelegram />}
              title="Telegram"
              desc="..."
              isOn={settings.telegram}
              onToggle={() => toggleSwitch("telegram")}
              CustomToggle={CustomToggle}
              isDark={settings.darkMode}
            />
            <SettingItem
              icon={<TbMail />}
              title="Email"
              desc="..."
              isOn={settings.email}
              onToggle={() => toggleSwitch("email")}
              CustomToggle={CustomToggle}
              isDark={settings.darkMode}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2
            className={`text-[16px] md:text-[18px] font-bold mb-4 ${
              settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Support
          </h2>
          <div
            onClick={handleSupportClick}
            className={`${
              settings.darkMode
                ? "bg-[#1E1E1E] border-gray-800"
                : "bg-white border-gray-50"
            } p-4 md:p-6 rounded-[22px] flex justify-between items-center shadow-sm border cursor-pointer group`}
          >
            <div className="flex items-start gap-4">
              <TbHeadset
                className={`text-2xl mt-1 ${
                  settings.darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h3
                  className={`text-[15px] md:text-[17px] font-bold ${
                    settings.darkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Connect with support
                </h3>
                <p
                  className={`text-[11px] md:text-[14px] ${
                    settings.darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Our team is always ready to help you
                </p>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                settings.darkMode
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              Chat
            </div>
          </div>
        </div>

        <div className="mb-8 md:hidden">
          <h2 className="text-[16px] font-bold mb-4 text-red-500">Account</h2>
          <div
            onClick={() => setShowLogoutModal(true)}
            className={`${
              settings.darkMode
                ? "bg-[#1E1E1E] border-gray-800"
                : "bg-white border-gray-50"
            } p-4 rounded-[22px] flex items-center gap-4 shadow-sm border cursor-pointer active:bg-red-50 transition-colors`}
          >
            <TbLogout className="text-2xl text-red-500" />
            <span className="font-bold text-[15px] text-red-500">Log Out</span>
          </div>
        </div>

        <Theme CustomToggle={CustomToggle} SettingItem={SettingItem} />

        {showLogoutModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
              className={`${
                settings.darkMode ? "bg-[#1E1E1E] border-gray-700" : "bg-white"
              } w-full max-w-sm rounded-[24px] p-6 shadow-2xl border animate-in zoom-in duration-200`}
            >
              <h3
                className={`text-xl font-bold mb-2 text-center ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Log Out?
              </h3>
              <p
                className={`text-center mb-6 ${
                  settings.darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    settings.darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  No, stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingItem = ({
  icon,
  title,
  desc,
  isOn,
  onToggle,
  CustomToggle,
  isDark,
}) => (
  <div
    className={`${
      isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-50"
    } p-4 md:p-6 rounded-[22px] flex justify-between items-center shadow-sm border transition-all hover:shadow-md`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`text-2xl mt-1 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3
          className={`text-[15px] md:text-[17px] font-bold ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[11px] md:text-[14px] ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {desc}
        </p>
      </div>
    </div>
    <CustomToggle isOn={isOn} onToggle={onToggle} />
  </div>
);

export default Setting;
