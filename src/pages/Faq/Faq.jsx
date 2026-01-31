import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import FAQimg from "../../assets/FAQimg.png";
import { useTheme } from "../../Context/ThemeContext.jsx";

const Faq = () => {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const [activeTab, setActiveTab] = useState("talents");
  const [activeIndex, setActiveIndex] = useState(null);

  // MA'LUMOTLAR BAZASI
  const faqContent = {
    all: [
      {
        question: "How do I register on the platform?",
        answer:
          "You can register by clicking the 'Sign Up' button on the top right corner. The process is simple: verify your email, choose your role (User or Company), and fill in your profile details to get started.",
      },
      {
        question: "Is the service free to use for everyone?",
        answer:
          "Yes, basic registration and browsing are completely free. However, we offer Premium plans for users who want to access exclusive features, advanced filters, and priority support.",
      },
      {
        question: "What should I do if I forgot my password?",
        answer:
          "Don't worry! Go to the Login page and click on 'Forgot password?'. Enter your registered email address, and we will send you a link to reset your password securely.",
      },
      {
        question: "How can I contact the support team?",
        answer:
          "Our support team is available 24/7. You can reach out via the 'Contact Us' page, use the live chat widget in the bottom corner, or email us directly at support@workify.com.",
      },
    ],
    company: [
      {
        question: "How can I hire a talent efficiently?",
        answer:
          "To hire a talent, browse through the verified profiles using our smart filters. Once you find a match, you can send them an offer directly or schedule an interview through our integrated calendar system.",
      },
      {
        question: "What are the payment methods for companies?",
        answer:
          "We support secure payments via Visa, MasterCard, PayPal, and Bank Transfers. You can choose to pay per hire or subscribe to a monthly plan for unlimited access to talent contacts.",
      },
      {
        question: "Can I post a job vacancy for free?",
        answer:
          "Companies can post their first 3 job vacancies for free. For more listings and to boost your posts to the top of the search results, you will need to upgrade to a Business Plan.",
      },
      {
        question: "How do I verify my company profile?",
        answer:
          "To build trust with talents, go to 'Settings' > 'Verification'. Upload your business registration documents. Our team will review them within 24 hours and grant you a 'Verified Company' badge.",
      },
    ],
    talents: [
      {
        question:
          "It is a long established fact that a reader will be distracted?",
        answer:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
      },
      {
        question: "Why do we use it in our designs?",
        answer:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It helps focus on the structure rather than the text itself.",
      },
      {
        question: "Where does it come from actually?",
        answer:
          "This is another sample answer to demonstrate the toggle effect of the accordion component. It opens and closes smoothly and adapts to any screen size perfectly.",
      },
      {
        question: "Is it safe to use for prototyping?",
        answer:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Many desktop publishing packages and web page editors now use Lorem Ipsum.",
      },
    ],
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const currentFaqs = faqContent[activeTab];

  return (
    <div
      className={`min-h-screen py-6 md:py-10 px-3 sm:px-4 font-sans transition-colors duration-500 ${
        isDark ? "bg-[#121212] text-white" : "bg-[#F5F5F5] text-[#1E293B]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className={`rounded-2xl py-3 px-4 sm:px-6 md:py-4 md:px-8 mb-6 sm:mb-8 shadow-sm border transition-colors duration-500 ${
            isDark ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <h1
            className={`text-lg sm:text-xl md:text-2xl font-bold ${
              isDark ? "text-gray-100" : "text-[#1E293B]"
            }`}
          >
            FAQ
          </h1>
        </div>

        {/* TAB SWITCHER */}
        <div className="mb-6 sm:mb-8">
          <div
            className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl grid grid-cols-3 gap-1 sm:gap-2 w-full transition-colors duration-500 border ${
              isDark
                ? "bg-[#1E1E1E] border-gray-800"
                : "bg-white border-gray-100"
            }`}
          >
            {[
              { id: "all", label: "All users" },
              { id: "company", label: "Company" },
              { id: "talents", label: "Talents" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveIndex(null);
                }}
                className={`py-2 sm:py-3 px-1 sm:px-4 text-[11px] xs:text-xs sm:text-sm md:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 truncate ${
                  activeTab === tab.id
                    ? isDark
                      ? "bg-[#3E3E3E] text-white shadow-sm"
                      : "bg-gray-100 text-gray-900 shadow-sm"
                    : isDark
                      ? "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8 sm:mb-10 md:mb-14">
          <div className="h-32 sm:h-44 md:h-72 w-full flex items-center justify-center">
            <img
              src={FAQimg}
              alt="FAQ Illustration"
              className={`max-h-full w-auto object-contain transition-opacity duration-500 ${
                isDark ? "opacity-80" : "opacity-100"
              }`}
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 md:space-y-4">
          {currentFaqs.map((item, index) => {
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
                  className={`w-full flex items-start md:items-center justify-between p-3 sm:p-4 md:p-6 text-left transition-all duration-500 ${
                    isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-2.5 sm:gap-3 md:gap-5">
                    <span
                      className={`text-base sm:text-lg md:text-2xl mt-0.5 md:mt-0 transition-all duration-500 ease-in-out flex-shrink-0 ${
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
                      className={`font-semibold text-sm sm:text-base md:text-lg leading-snug transition-colors duration-500 ${
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

                {/* Javob qismi: paddinglar moslashtirildi */}
                <div
                  className={`transition-all duration-500 ease-in-out px-4 sm:px-8 md:px-16 overflow-hidden ${
                    isOpen
                      ? "max-h-[800px] pb-4 sm:pb-5 md:pb-8 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p
                    className={`leading-relaxed text-sm sm:text-base border-t pt-3 md:pt-4 transition-colors duration-500 ${
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
