import React, { useState, useEffect } from "react";
import {
  FaBriefcase, FaSuitcase, FaIdCard, FaLightbulb,
  FaLanguage, FaChartBar, FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function RegistrationFormStepTwo() {
  const navigate = useNavigate();

  // States
  const [occupation, setOccupation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [skils, setskils] = useState([{ skill: "", experience_years: "" }]);
  const [languages, setLanguages] = useState([{ language: "", level: "" }]);

  // Dropdown visibility
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState([false]);
  const [showExpDropdown, setShowExpDropdown] = useState([false]);
  const [showLangDropdown, setShowLangDropdown] = useState([false]); // Tillari uchun
  const [showLevelDropdown, setShowLevelDropdown] = useState([false]);

  // Data Lists
  const occupations = ["Designer", "Programmer", "Businessman", "Manager", "Doctor", "Teacher"];
  const specialtyMap = {
    "Manager": ["Product Manager", "Project Manager", "Operations Manager", "Sales Manager", "HR Manager"],
    "Programmer": ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer", "DevOps"],
    "Designer": ["UX/UI Designer", "Graphic Designer", "Motion Designer", "3D Artist"],
  };
  const skilsList = ["Figma", "Photoshop", "React", "Node.js", "Python", "Marketing", "Illustrator"];
  const expList = ["1 year", "2 years", "3 years", "4 years", "5+ years"];
  const levels = ["Beginner", "Intermediate", "Advanced", "Native"];
  const popularLanguages = ["Uzbek", "English", "Russian", "German", "Turkish", "French", "Chinese"];

  const getFiltered = (list, query) => {
    const filtered = list.filter(item => item.toLowerCase().includes(query.toLowerCase()));
    return filtered.length > 0 ? filtered : ["Other"];
  };

  useEffect(() => {
    const savedData = localStorage.getItem("talent_step2");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOccupation(parsed.occupation || "");
        setSpecialty(parsed.specialty || "");
        if (parsed.skils?.length) setskils(parsed.skils);
        if (parsed.language?.length) setLanguages(parsed.language);
      } catch (e) { console.error(e); }
    }
  }, []);

  const addSkill = () => {
    if (skils.length < 5) {
      setskils([...skils, { skill: "", experience_years: "" }]);
      setShowSkillDropdown([...showSkillDropdown, false]);
      setShowExpDropdown([...showExpDropdown, false]);
    } else { toast.error("Maksimum 5 ta skill"); }
  };

  const addLanguage = () => {
    if (languages.length < 3) {
      setLanguages([...languages, { language: "", level: "" }]);
      setShowLangDropdown([...showLangDropdown, false]);
      setShowLevelDropdown([...showLevelDropdown, false]);
    } else { toast.error("Maksimum 3 ta til"); }
  };

  const handleNext = () => {
    if (!occupation) return toast.error("Occupation tanlang");
    if (!specialty) return toast.error("Specialty tanlang");
    if (!skils[0].skill) return toast.error("Kamida bitta skill kiriting");
    if (!languages[0].language) return toast.error("Kamida bitta til kiriting");

    const step2Data = { occupation, specialty, skils, language: languages };
    localStorage.setItem("talent_step2", JSON.stringify(step2Data));
    toast.success("Saqlandi!");
    setTimeout(() => navigate("/registration/step-3"), 1000);
  };

const handleBack = () => {
  // if (!occupation) return toast.error("Please select an occupation");
  // if (!specialty) return toast.error("Please select a specialty");
  // if (!skils[0].skill) return toast.error("Please enter at least one skill");
  // if (!languages[0].language) return toast.error("Please enter at least one language");

  const step2Data = {
    occupation,
    specialty,
    skils,
    language: languages,
  };

  localStorage.setItem("talent_step2", JSON.stringify(step2Data));
  toast.success("Returned to previous step!");

  setTimeout(() => navigate("/registration/step-1"), 1000);
};


  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow bg-gray-50 flex items-center justify-center p-4 md:p-10">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-6 md:p-12">
          
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#163D5C] mb-6">Professional Details</h2>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#163D5C]"></div>
              <div className="w-16 md:w-32 h-1 bg-[#163D5C] rounded"></div>
              <div className="w-5 h-5 rounded-full bg-[#163D5C] ring-4 ring-blue-100"></div>
              <div className="w-16 md:w-32 h-1 bg-gray-200 rounded"></div>
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Occupation */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C]" />
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => { setOccupation(e.target.value); setShowOccupationDropdown(true); }}
                    onFocus={() => setShowOccupationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowOccupationDropdown(false), 200)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#163D5C]"
                    placeholder="Search occupation"
                  />
                  {showOccupationDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                      {getFiltered(occupations, occupation).map((item, i) => (
                        <div key={i} onMouseDown={() => setOccupation(item)} className="px-5 py-2 hover:bg-blue-50 cursor-pointer text-gray-700">{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Specialty */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialty</label>
                <div className="relative">
                  <FaSuitcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C]" />
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => { setSpecialty(e.target.value); setShowSpecialtyDropdown(true); }}
                    onFocus={() => setShowSpecialtyDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSpecialtyDropdown(false), 200)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#163D5C]"
                    placeholder="Search specialty"
                  />
                  {showSpecialtyDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                      {getFiltered(specialtyMap[occupation] || ["Generalist", "Specialist"], specialty).map((item, i) => (
                        <div key={i} onMouseDown={() => setSpecialty(item)} className="px-5 py-2 hover:bg-blue-50 cursor-pointer text-gray-700">{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Skills & Experience</h3>
              {skils.map((s, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end animate-fadeIn">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Skill</label>
                    <div className="relative">
                      <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C]" />
                      <input
                        type="text"
                        value={s.skill}
                        onChange={(e) => {
                          const updated = [...skils];
                          updated[index].skill = e.target.value;
                          setskils(updated);
                        }}
                        onFocus={() => { let arr = [...showSkillDropdown]; arr[index] = true; setShowSkillDropdown(arr); }}
                        onBlur={() => setTimeout(() => { let arr = [...showSkillDropdown]; arr[index] = false; setShowSkillDropdown(arr); }, 200)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="Type skill"
                      />
                      {showSkillDropdown[index] && (
                        <div className="absolute z-40 w-full mt-1 bg-white border rounded-xl shadow-xl max-h-32 overflow-y-auto">
                          {getFiltered(skilsList, s.skill).map((item, i) => (
                            <div key={i} onMouseDown={() => {
                              const updated = [...skils];
                              updated[index].skill = item;
                              setskils(updated);
                            }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{item}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <div className="flex-1 relative">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Experience</label>
                      <div className="relative">
                        <FaLightbulb className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C]" />
                        <input
                          type="text"
                          value={s.experience_years}
                          readOnly
                          onFocus={() => { let arr = [...showExpDropdown]; arr[index] = true; setShowExpDropdown(arr); }}
                          onBlur={() => setTimeout(() => { let arr = [...showExpDropdown]; arr[index] = false; setShowExpDropdown(arr); }, 200)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                          placeholder="Select"
                        />
                        {showExpDropdown[index] && (
                          <div className="absolute z-40 w-full mt-1 bg-white border rounded-xl shadow-xl">
                            {expList.map((item, i) => (
                              <div key={i} onMouseDown={() => {
                                const updated = [...skils];
                                updated[index].experience_years = item;
                                setskils(updated);
                              }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">{item}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {index > 0 && (
                      <button onClick={() => setskils(skils.filter((_, i) => i !== index))} className="mt-5 p-3 text-red-500 hover:bg-red-50 rounded-xl"><FaTimes /></button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button onClick={addSkill} className="text-sm font-bold text-white bg-[#4AD395] px-6 py-2 rounded-full">+ Add Skill</button>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Languages</h3>
              {languages.map((l, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Language</label>
                    <div className="relative">
                      <FaLanguage className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C] text-xl" />
                      <input
                        type="text"
                        value={l.language}
                        onChange={(e) => {
                          const updated = [...languages];
                          updated[index].language = e.target.value;
                          setLanguages(updated);
                          let arr = [...showLangDropdown]; arr[index] = true; setShowLangDropdown(arr);
                        }}
                        onFocus={() => { let arr = [...showLangDropdown]; arr[index] = true; setShowLangDropdown(arr); }}
                        onBlur={() => setTimeout(() => { let arr = [...showLangDropdown]; arr[index] = false; setShowLangDropdown(arr); }, 200)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                        placeholder="Search language"
                      />
                      {showLangDropdown[index] && (
                        <div className="absolute z-40 w-full mt-1 bg-white border rounded-xl shadow-xl max-h-32 overflow-y-auto">
                          {getFiltered(popularLanguages, l.language).map((item, i) => (
                            <div key={i} onMouseDown={() => {
                              const updated = [...languages];
                              updated[index].language = item;
                              setLanguages(updated);
                            }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">{item}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <div className="flex-1 relative">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Level</label>
                      <div className="relative">
                        <FaChartBar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#163D5C]" />
                        <input
                          type="text"
                          value={l.level}
                          readOnly
                          onFocus={() => { let arr = [...showLevelDropdown]; arr[index] = true; setShowLevelDropdown(arr); }}
                          onBlur={() => setTimeout(() => { let arr = [...showLevelDropdown]; arr[index] = false; setShowLevelDropdown(arr); }, 200)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                          placeholder="Select Level"
                        />
                        {showLevelDropdown[index] && (
                          <div className="absolute z-40 w-full mt-1 bg-white border rounded-xl shadow-xl">
                            {levels.map((item, i) => (
                              <div key={i} onMouseDown={() => {
                                const updated = [...languages];
                                updated[index].level = item;
                                setLanguages(updated);
                              }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">{item}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {index > 0 && (
                      <button onClick={() => setLanguages(languages.filter((_, i) => i !== index))} className="mt-5 p-3 text-red-500 hover:bg-red-50 rounded-xl"><FaTimes /></button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button onClick={addLanguage} className="text-sm font-bold text-white bg-[#4AD395] px-6 py-2 rounded-full">+ Add Language</button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-10">
              <button onClick={handleBack} className="flex-1 py-4 border-2 border-[#163D5C] text-[#163D5C] rounded-2xl font-bold hover:bg-gray-50 transition-all">Previous Step</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-[#163D5C] text-white rounded-2xl font-bold hover:bg-[#1a4d73] shadow-lg transition-all">Next Step</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}