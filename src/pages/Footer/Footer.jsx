import React from "react";
import {
  BsInstagram,
  BsFacebook,
  BsYoutube,
  BsTelegram,
} from "react-icons/bs";

// Ustunlar uchun yordamchi komponent
const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col gap-4">
    <h5 className="text-white font-bold text-[15px] mb-2">{title}</h5>
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-slate-400 hover:text-white transition-colors duration-300 text-[14px] font-medium"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[#1B3B5A] text-white pt-20 pb-10 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          <div className="flex flex-col items-start lg:col-span-1">
            <h2 className="text-[28px] font-bold tracking-tight mb-1">
              workify
            </h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">
              Job posting platform
            </p>
            <button className="bg-white text-[#1B3B5A] px-10 py-3 rounded-xl font-bold text-[15px] hover:bg-slate-100 transition-all duration-300 shadow-md active:scale-95">
              Contacts
            </button>
          </div>

          <div className="lg:ml-auto">
            <FooterColumn
              title="General"
              links={[
                { label: "Sign up", href: "/registration/step-1" },
                { label: "Contacts", href: "/contacts" },
                { label: "About", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Partners", href: "/partners" },
              ]}
            />
          </div>

          <div className="lg:ml-auto">
            <FooterColumn
              title="Company"
              links={[
                { label: "Post a job", href: "/post-job" },
                { label: "Search talents", href: "/talents" },
                { label: "Company login", href: "/company-login" },
                { label: "Company advice", href: "/company-advice" },
              ]}
            />
          </div>

          <div className="lg:ml-auto">
            <FooterColumn
              title="Talents"
              links={[
                { label: "Search jobs", href: "/jobs" },
                { label: "Talent login", href: "/talent-login" },
                { label: "Talent advice", href: "/talent-advice" },
              ]}
            />
          </div>

          <div className="hidden lg:block"></div>
        </div>

        <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[13px] font-medium order-2 md:order-1">
            All rights reserved 2021
          </p>

          <div className="flex gap-5 items-center order-1 md:order-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-transform hover:-translate-y-1"
            >
              <BsInstagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-transform hover:-translate-y-1"
            >
              <BsFacebook size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-transform hover:-translate-y-1"
            >
              <BsYoutube size={22} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-transform hover:-translate-y-1"
            >
              <BsTelegram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;