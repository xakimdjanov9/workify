import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { IoMdLock, IoMdMail } from "react-icons/io";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { talentApi } from "../../services/api";
import verifyImg from "../../assets/verify.png";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 daqiqa
  const [isError, setIsError] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 3 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Kodni qayta yuborish funksiyasi
  const handleResendCode = async () => {
    setLoading(true);
    try {
      await talentApi.sendResetCode(email);
      setTimeLeft(300); // Taymerni qayta boshlash
      setCode(Array(6).fill("")); // Inputlarni tozalash
      setIsError(false);
      toast.success("Kod qayta yuborildi!");
    } catch (err) {
      toast.error("Kodni yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;
    setIsError(false);

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!newCode[index] && index > 0) {
        newCode[index - 1] = "";
        inputRefs.current[index - 1].focus();
      } else {
        newCode[index] = "";
      }
      setCode(newCode);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newCode = pasteData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    inputRefs.current[Math.min(pasteData.length - 1, 5)].focus();
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!email.includes("@")) return toast.error("Email noto'g'ri");
      setLoading(true);
      try {
        await talentApi.sendResetCode(email);
        localStorage.setItem("verify_email", email);
        setStep(2);
      } catch (err) {
        toast.error("Xatolik: Email topilmadi");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const finalCode = code.join("");
      if (finalCode.length < 6) return toast.error("Kodni to'liq kiriting");
      if (timeLeft === 0) return toast.error("Vaqt tugagan, kodni qayta yuboring!");

      setLoading(true);
      try {
        const res = await talentApi.checkResetCode(email, finalCode);
        if (res.status === 200 || res.data?.success) {
          toast.success("Kod tasdiqlandi!");
          setStep(4);
        }
      } catch (err) {
        setIsError(true);
        toast.error("Kod noto'g'ri");
      } finally {
        setLoading(false);
      }
    } else if (step === 4) {
      if (newPassword.length < 6) return toast.error("Parol juda qisqa");
      setLoading(true);
      try {
        await talentApi.confirmResetPassword(email, code.join(""), newPassword);
        toast.success("Parol yangilandi!");
        navigate("/signin");
      } catch (err) {
        toast.error("Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-[#163D5C]">
            {step === 4 ? "Set New Password" : "Reset your password"}
          </h1>

          {/* STEP 1: Email */}
          {step === 1 && (
            <div className="max-w-sm mx-auto space-y-4">
              <div className="relative">
                <IoMdMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#163D5C]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Bot info */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-gray-600">Start our Telegram bot to get reset code</p>
              <button 
                onClick={() => window.open("https://t.me/Workify1_bot", "_blank")}
                className="bg-[#61C491] text-white px-8 py-2 rounded-lg font-semibold"
              >
                Click here!
              </button>
              <img src={verifyImg} alt="Verify" className="mx-auto w-48" />
            </div>
          )}

          {/* STEP 3: Code & Resend */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {code.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    value={v}
                    maxLength={1}
                    onPaste={handlePaste}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    disabled={timeLeft === 0}
                    className={`w-12 h-14 text-center text-xl border-2 rounded-xl outline-none 
                      ${isError ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#163D5C]"}
                      ${timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  />
                ))}
              </div>
              
              <div className="space-y-2">
                {timeLeft > 0 ? (
                  <p className="text-[#163D5C] font-bold">Kodni kiriting: {formatTime(timeLeft)}</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-500 font-semibold">Vaqt tugadi!</p>
                    <button 
                      onClick={handleResendCode}
                      className="text-blue-600 underline font-medium hover:text-blue-800"
                    >
                      Kodni qayta jo'natish
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Password */}
          {step === 4 && (
            <div className="max-w-sm mx-auto space-y-4">
              <div className="relative">
                <IoMdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yangi parol"
                  className="w-full pl-10 pr-12 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#163D5C]"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleNext}
              disabled={loading || (step === 3 && timeLeft === 0)}
              className="bg-[#163D5C] text-white px-12 py-2 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? "Yuklanmoqda..." : "Next"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}