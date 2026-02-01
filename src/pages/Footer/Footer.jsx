import React, { useMemo, useState } from "react";
import { BsInstagram, BsFacebook, BsYoutube, BsTelegram } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";

const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col">
    <h5 className="text-white font-bold text-[14px] sm:text-[15px] mb-3 sm:mb-4">
      {title}
    </h5>
    <ul className="flex flex-col gap-2 sm:gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-slate-400 hover:text-white transition-colors duration-300 text-[13px] sm:text-[14px] font-medium hover:translate-x-1 inline-block"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Mobile accordion item
const MobileAccordion = ({ title, links, open, onToggle }) => (
  <div className="md:hidden rounded-xl overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-4 text-left"
      aria-expanded={open}
    >
      <span className="text-white font-bold text-[14px]">{title}</span>
      <FaChevronDown
        className={`text-white/80 transition-transform duration-300 ${
          open ? "rotate-180" : ""
        }`}
        size={14}
      />
    </button>

    {open && (
      <div className="px-4 pb-4">
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-slate-300 hover:text-white transition-colors duration-300 text-[13px] font-medium inline-block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const Footer = () => {
  const columns = useMemo(
    () => [
      {
        key: "general",
        title: "General",
        links: [
          { label: "Sign up", href: "/registration/step-1" },
          { label: "Contacts", href: "/contacts" },
          { label: "About", href: "/about" },
          { label: "FAQ", href: "/faq" },
          { label: "Partners", href: "/partners" },
        ],
      },
      {
        key: "company",
        title: "Company",
        links: [
          { label: "Post a job", href: "/post-job" },
          { label: "Search talents", href: "/talents" },
          { label: "Company login", href: "/company-login" },
          { label: "Company advice", href: "/company-advice" },
        ],
      },
      {
        key: "talents",
        title: "Talents",
        links: [
          { label: "Search jobs", href: "/jobs" },
          { label: "Talent login", href: "/talent-login" },
          { label: "Talent advice", href: "/talent-advice" },
        ],
      },
    ],
    [],
  );

  const [openKey, setOpenKey] = useState("general"); // default bitta ochiq

  return (
    <footer className="bg-[#1B3B5A] text-white pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col items-start md:col-span-3 lg:col-span-1 lg:col-start-1">
            {/* title + contact (mobile yonma-yon) */}
            <div className="w-full flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-3">
              <h2 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight">
                workify
              </h2>

              {/* CONTACT – mobile da shu yerda */}
              <button className="bg-white text-[#1B3B5A] px-4 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[13px] sm:text-[14px] lg:text-[15px] hover:bg-slate-100 transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap lg:hidden">
                Contacts
              </button>
            </div>

            {/* description */}
            <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">
              Job posting platform
            </p>

            {/* CONTACT – desktop da eng pastda */}
            <button className="hidden lg:inline-block mt-4 bg-white text-[#1B3B5A] px-4 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-xl font-bold text-[14px] hover:bg-slate-100 transition-all duration-300 shadow-md active:scale-95 whitespace-nowrap">
              Contacts
            </button>
          </div>

          <div className="hidden md:block xs:col-start-1 xs:row-start-2 md:col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1 lg:ml-auto">
            <FooterColumn title="General" links={columns[0].links} />
          </div>

          <div className="hidden md:block xs:col-start-2 xs:row-start-2 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1 lg:ml-auto">
            <FooterColumn title="Company" links={columns[1].links} />
          </div>

          <div className="hidden md:block xs:col-start-1 xs:row-start-3 md:col-start-3 md:row-start-2 lg:col-start-4 lg:row-start-1 lg:ml-auto">
            <FooterColumn title="Talents" links={columns[2].links} />
          </div>

          <div className="hidden lg:block lg:col-start-5"></div>

          <div className="md:hidden col-span-1 xs:col-span-2 flex flex-col gap-3">
            {columns.map((c) => (
              <MobileAccordion
                key={c.key}
                title={c.title}
                links={c.links}
                open={openKey === c.key}
                onToggle={() =>
                  setOpenKey((prev) => (prev === c.key ? "" : c.key))
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-slate-700/50 flex flex-col-reverse md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-slate-400 text-xs sm:text-[13px] font-medium text-center md:text-left">
            All rights reserved 2021
          </p>

          <div className="flex gap-4 sm:gap-5 items-center">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="Instagram"
            >
              <BsInstagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="Facebook"
            >
              <BsFacebook size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="YouTube"
            >
              <BsYoutube size={19} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              aria-label="Telegram"
            >
              <BsTelegram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
