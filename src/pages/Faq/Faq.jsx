import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import FAQimg from "../../assets/FAQimg.png";
import { useTheme } from "../../Context/ThemeContext.jsx"; // Context ulandi

const Faq = () => {
  const { settings } = useTheme(); // Dark mode holati olindi
  const isDark = settings.darkMode;
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question:
        "It is a long established fact that a reader will be distracted by the readable content of a page when?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    },
    {
      question:
        "It is a long established fact that a reader will be distracted by the readable content of a page when?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It helps focus on the structure rather than the text itself.",
    },
    {
      question:
        "It is a long established fact that a reader will be distracted by the readable content of a page when?",
      answer:
        "This is another sample answer to demonstrate the toggle effect of the accordion component. It opens and closes smoothly.",
    },
    {
      question:
        "It is a long established fact that a reader will be distracted by the readable content of a page when?",
      answer:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Many desktop publishing packages and web page editors now use Lorem Ipsum.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className={`min-h-screen py-6 md:py-10 px-4 font-sans transition-colors duration-500 ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F5F5F5] text-[#1E293B]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className={`rounded-2xl py-3 px-6 md:py-4 md:px-8 mb-8 shadow-sm border transition-colors duration-500 ${
            isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <h1
            className={`text-xl md:text-2xl font-bold ${isDark ? "text-gray-100" : "text-[#1E293B]"}`}
          >
            FAQ
          </h1>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="h-44 md:h-72 w-full flex items-center justify-center">
            <img
              src={FAQimg}
              alt="FAQ Illustration"
              className={`max-h-full w-auto object-contain transition-opacity duration-500 ${isDark ? "opacity-80" : "opacity-100"}`}
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 md:space-y-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl md:rounded-2xl shadow-sm border transition-all duration-500 overflow-hidden ${
                  isDark
                    ? "bg-[#1E1E1E] border-gray-800"
                    : "bg-white border-gray-50"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full flex items-start md:items-center justify-between p-4 md:p-6 text-left transition-all duration-500 ${
                    isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-3 md:gap-5">
                    <span
                      className={`text-lg md:text-2xl mt-1 md:mt-0 transition-all duration-500 ease-in-out ${
                        isOpen
                          ? "text-[#3B82F6] rotate-180"
                          : isDark
                            ? "text-gray-600 rotate-0"
                            : "text-gray-400 rotate-0"
                      }`}
                    >
                      <IoChevronDown />
                    </span>
                    <span
                      className={`font-semibold text-sm md:text-lg leading-tight transition-colors duration-500 ${
                        isOpen
                          ? isDark
                            ? "text-white"
                            : "text-[#1E293B]"
                          : isDark
                            ? "text-gray-400"
                            : "text-[#475569]"
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out px-11 md:px-16 overflow-hidden ${
                    isOpen
                      ? "max-h-[800px] pb-5 md:pb-8 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p
                    className={`leading-relaxed text-xs md:text-base border-t pt-3 md:pt-4 transition-colors duration-500 ${
                      isDark
                        ? "text-gray-400 border-gray-800"
                        : "text-gray-500 border-gray-50"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Faq;
