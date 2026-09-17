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
  {
    ssr: false,
  }
);

export function Header({ navbarOpen, setNavbarOpen }: HeaderProps) {
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

  const handleDropdownToggle = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <Fragment>
      <RegisterSchoolEnquiry />
      <header
        className={`w-full ${navbarOpen ? "fixed" : "sticky"} top-[-1px] right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-[1450px] mx-auto">
          <div className="py-2 px-3 sm:px-7 lg:px-10 xl:px-6 flex justify-between items-center h-[68px]">
            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                priority
                src={"/images/logo.svg"}
                alt={SITE_NAME}
                width={44}
                height={44}
                className="max-[362px]:w-9 w-11 h-auto rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <p className="max-[362px]:text-sm text-lg lg:text-[20px] font-extrabold tracking-wide text-blacky-light">
                  {SITE_NAME}
                </p>
                <p className="max-[362px]:text-[8px] text-[10px] lg:text-[11px] font-semibold tracking-[0.15em] text-greenish-light">
                  Find. Compare. Enroll.
                </p>
              </div>
            </Link>

            <div className="xl:hidden flex items-center md:gap-x-6">
              <UserMenu />
              {/* Menu Button */}
              <button
                className="xl:hidden flex top-0 right-0 z-50 relative w-10 h-10 text-green-600 focus:outline-none"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <div className="absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  <span
                    className={`absolute h-0.5 w-5 bg-green-600 transform transition duration-300 ease-in-out ${
                      navbarOpen ? "rotate-45 delay-200" : "-translate-y-1.5"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 bg-green-600 transform transition-all duration-200 ease-in-out ${
                      navbarOpen ? "w-0 opacity-50" : "w-5 delay-200 opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-5 bg-green-600 transform transition duration-300 ease-in-out ${
                      navbarOpen ? "-rotate-45 delay-200" : "translate-y-1.5"
                    }`}
                  ></span>
                </div>
              </button>
            </div>

            {/* Desktop nav — pill style */}
            <div className="hidden xl:flex items-center gap-3">
              <ul className="flex flex-row items-center gap-1 bg-grayish-light rounded-full p-1">
                {navList.map((navItem, idx) => {
                  if (navItem.hasDropdown) {
                    return (
                      <li key={idx} className="mx-1">
                        <div onClick={() => handleDropdownToggle(navItem.title)}>
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
                      <Link
                        href={navItem.path}
                        key={idx}
                        target={navItem.target}
                        onClick={handleLinkClick}
                      >
                        <li
                          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                            isActive
                              ? "bg-green-600 text-white shadow"
                              : "text-blacky-light hover:bg-white hover:text-green-600"
                          }`}
                        >
                          {navItem.icon && (
                            <navItem.icon className="text-inherit text-base" />
                          )}
                          {navItem.title}
                        </li>
                      </Link>
                    );
                  } else if (!navItem.path) {
                    return (
                      <li
                        key={idx}
                        className="text-sm font-medium px-4 py-2 rounded-full cursor-pointer text-blacky-light hover:bg-white hover:text-green-600 transition-colors"
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
              <div className="pl-1">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
}
