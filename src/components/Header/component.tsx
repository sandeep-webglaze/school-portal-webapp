"use client";
import React, { Fragment, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { navList } from "@/_mocks_/NavJson";
import { HeaderProps } from "./types";
import UserMenu from "../UserMenu";
import useRegisterSchoolEnq from "@/hooks/useRegisterSchoolEnq";
import dynamic from "next/dynamic";
import Dropdown from "../Dropdown/component";
import { SITE_NAME } from "@/constants";

const RegisterSchoolEnquiry = dynamic(
  () => import("@/components/Modals").then((mod) => mod.RegisterSchoolEnquiry),
  { ssr: false }
);

export function Header({
  navbarOpen,
  setNavbarOpen,
  overlay = false,
}: HeaderProps) {
  const pathname = usePathname();
  const openRegisterSchoolModal = useRegisterSchoolEnq().onOpen;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent light header only on the hero (home) before scrolling.
  const transparent = overlay && !scrolled;

  const handleLinkClick = () => setOpenDropdown(null);

  return (
    <Fragment>
      <RegisterSchoolEnquiry />
      <header
        className={`w-full ${
          overlay || navbarOpen ? "fixed" : "sticky"
        } top-0 right-0 z-40 transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-white shadow-sm"
        }`}
      >
        <div className="w-[90%] max-w-[1550px] mx-auto">
          <div className="py-2 flex justify-between items-center h-[70px]">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                priority
                src={"/logo.png"}
                alt={SITE_NAME}
                width={46}
                height={46}
                className="max-[362px]:w-9 w-12 h-auto rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <p
                  className={`max-[362px]:text-sm text-lg lg:text-[21px] font-extrabold tracking-wide transition-colors ${
                    transparent ? "text-white" : "text-blacky-light"
                  }`}
                >
                  {SITE_NAME}
                </p>
                <p
                  className={`max-[362px]:text-[8px] text-[9px] lg:text-[10px] font-semibold tracking-[0.12em] transition-colors ${
                    transparent ? "text-white/80" : "text-greenish-light"
                  }`}
                >
                  Dubai · Better Schools · Brighter Futures
                </p>
              </div>
            </Link>

            {/* Mobile controls */}
            <div className="xl:hidden flex items-center md:gap-x-6">
              <div className={transparent ? "text-white" : ""}>
                <UserMenu />
              </div>
              <button
                className={`xl:hidden flex relative w-10 h-10 focus:outline-none ${
                  transparent ? "text-white" : "text-green-600"
                }`}
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <div className="absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  <span className={`absolute h-0.5 w-5 transform transition duration-300 ease-in-out ${transparent ? "bg-white" : "bg-green-600"} ${navbarOpen ? "rotate-45 delay-200" : "-translate-y-1.5"}`}></span>
                  <span className={`absolute h-0.5 transform transition-all duration-200 ease-in-out ${transparent ? "bg-white" : "bg-green-600"} ${navbarOpen ? "w-0 opacity-50" : "w-5 delay-200 opacity-100"}`}></span>
                  <span className={`absolute h-0.5 w-5 transform transition duration-300 ease-in-out ${transparent ? "bg-white" : "bg-green-600"} ${navbarOpen ? "-rotate-45 delay-200" : "translate-y-1.5"}`}></span>
                </div>
              </button>
            </div>

            {/* Desktop nav — pill style */}
            <div className="hidden xl:flex items-center gap-3">
              <ul
                className={`flex flex-row items-center gap-1 rounded-full p-1 ${
                  transparent ? "bg-white/10" : "bg-grayish-light"
                }`}
              >
                {navList.map((navItem, idx) => {
                  if (navItem.hasDropdown) {
                    return (
                      <li key={idx} className="mx-1">
                        <div onClick={() => setOpenDropdown(openDropdown === navItem.title ? null : navItem.title)}>
                          <Dropdown
                            title={navItem.title}
                            items={navItem.dropdownItems || []}
                            isOpen={openDropdown === navItem.title}
                            onClose={() => setOpenDropdown(null)}
                          />
                        </div>
                      </li>
                    );
                  } else if (!navItem.footerOnly && navItem.path) {
                    const isActive = pathname === navItem.path;
                    return (
                      <Link href={navItem.path} key={idx} target={navItem.target} onClick={handleLinkClick}>
                        <li
                          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                            isActive
                              ? "bg-green-600 text-white shadow"
                              : transparent
                                ? "text-white hover:bg-white/20"
                                : "text-blacky-light hover:bg-white hover:text-green-600"
                          }`}
                        >
                          {navItem.icon && <navItem.icon className="text-inherit text-base" />}
                          {navItem.title}
                        </li>
                      </Link>
                    );
                  } else if (!navItem.path) {
                    return (
                      <li
                        key={idx}
                        className={`text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-colors ${
                          transparent ? "text-white hover:bg-white/20" : "text-blacky-light hover:bg-white hover:text-green-600"
                        }`}
                        onClick={() => {
                          setNavbarOpen(false);
                          openRegisterSchoolModal();
                        }}
                      >
                        {navItem.title}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
              <div className="pl-1 flex items-center gap-3">
                <div className={transparent ? "text-white" : ""}>
                  <UserMenu />
                </div>
                <Link
                  href="/school-portal/login"
                  className={`hidden md:inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
                    transparent
                      ? "border-white/40 text-white hover:bg-white/15"
                      : "border-[#1e4fa3] text-[#1e4fa3] hover:bg-[#1e4fa3] hover:text-white"
                  }`}
                >
                  School Login
                </Link>
                <Link
                  href="/register-school"
                  className="inline-flex items-center gap-2 rounded-full bg-gold hover:bg-gold-dark px-5 py-2.5 text-sm font-bold text-white transition-colors shadow"
                >
                  Register School
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
}
