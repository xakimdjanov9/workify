import React from "react";
// Rasmni import qilyapmiz
import CongratulationBg from "../../assets/Congratulations-img.png";

const Congratulations = () => {
  return (
    // UMUMIY FON VA JOYLASHTIRISH
    // flex-col va gap-5: Header va Pastki karta orasida joy ochish uchun
    <div className="min-h-screen w-full bg-[#f0f2f5] p-4 flex flex-col items-center gap-5 font-sans">
      {/* 1-QISM: TEPADAGI HEADER (Sening koding) */}
      <div className="w-full max-w-4xl bg-white rounded-[20px] py-4 px-8 shadow-sm z-10">
        <h1 className="text-[#4b5563] text-lg md:text-xl font-semibold tracking-tight">
          Job Matches
        </h1>
      </div>

      {/* 2-QISM: PASTKI KARTA (Rasm va Tabrik) */}
      {/* Bu qism headerdan alohida, pastda turadi */}
      <div className="w-full max-w-4xl bg-white rounded-[30px] shadow-sm overflow-hidden relative h-[600px] md:h-[750px]">
        {/* Orqa fon rasmi */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${CongratulationBg})` }}
        >
          {/* Ustidagi yozuvlar */}
          {/* pt-16: Tepadan joy tashlash */}
          <div className="flex flex-col items-center pt-16 md:pt-20 px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md tracking-wide">
              Congratulations !
            </h2>

            <p className="text-white text-base md:text-lg opacity-95 font-medium leading-relaxed drop-shadow-sm">
              You have submitted a successful application.
              <br className="hidden md:block" />
              Keep up the good work!
            </p>
          </div>
        </div>

        {/* Pastki tugma (Button) */}
        {/* absolute bottom-10: Rasm ustida, eng pastda joylashadi */}
        <div className="absolute bottom-8 w-full flex justify-center z-10">
          <button
            className="
      bg-white 
      border-[1.5px] border-[#6b7280] text-[#4b5563]
      hover:bg-[#f9fafb] hover:text-black
      font-semibold rounded-full 
      px-6 py-1.5 md:px-8 md:py-2 
      text-xs md:text-sm
      transition-all duration-300 ease-in-out shadow-sm
    "
          >
            Back to Job matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;
