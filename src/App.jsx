import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useTheme } from "../src/Context/ThemeContext.jsx"; 

import MainLayout from "./components/MainLayout";
import Dashboard from "./components/Dashbord/Dashbord";
import TalantHome from "./components/TalantHome/TalantHome";
import SignIn from "./pages/Auth/SignIn";
import RegistrationForm from "./pages/RegistrationPage/RegistrationPage";
import RegistrationFormStepTwo from "./pages/RegistrationFormStepTwo/RegistrationFormStepTwo";
import RegistrationFormStepThree from "./pages/RegistrationFormStepThree/RegistrationFormStepThree";
import JobMatches from "./components/JobMatches/JobMatches";
import ProfilePage from "./components/MyProfile/MyProfile";
import JobDetail from "./components/JobDetail/JobDetail";
import JobAlerts from "./components/JobAlerts/JobAlerts";
import CompanyDetail from "./components/CompanyDetail/CompanyDetail";
import Faq from "./pages/Faq/Faq";
import Contact from "./pages/Contact/Contact";
import VerifyAccount from "./pages/VerifyAccount/VerifyAccount";
import Setting from "./pages/Setting/Setting";
import ForgotPassword from "./pages/ResetPassword/ResetPassword";
import HomeJob from "./pages/HomeJob/HomeJob.jsx";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return <Outlet />;
};

function App() {
  const { settings } = useTheme();

  return (
  
    <div
      className={`min-h-screen transition-colors duration-500 ${settings.darkMode ? "bg-[#121212]" : "bg-[#F8F9FA]"}`}
    >
      <Routes>
        <Route path="/" element={<TalantHome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/registration/step-1" element={<RegistrationForm />} />
        <Route
          path="/registration/step-2"
          element={<RegistrationFormStepTwo />}
        />
        <Route
          path="/registration/step-3"
          element={<RegistrationFormStepThree />}
        />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/jobs" element={<HomeJob/>}/>
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/alerts" element={<JobAlerts />} />
            <Route path="/matches" element={<JobMatches />} />
            <Route path="/job-post/:id" element={<JobDetail />} />
            <Route path="/job-details/:id" element={<CompanyDetail />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contacts" element={<Contact />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
