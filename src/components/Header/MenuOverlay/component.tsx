"use client";
import React, { FC, Fragment, useState } from "react";
import { HeaderProps } from "../types";
import { getMediaDetails, navList } from "@/_mocks_/NavJson";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useConfigStore from "@/hooks/useConfigStore";
import useRegisterSchoolEnq from "@/hooks/useRegisterSchoolEnq";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
// Import icons

const MenuOverlay: FC<HeaderProps> = ({
  navbarOpen,
  setNavbarOpen,
  user = {},
  config: configProp,
}) => {
  const pathname = usePathname();
  // Prefer server-passed config, fall back to the client store. Keeps the
  // mobile social links correct on first paint instead of bare domains.
  const { config: storeConfig } = useConfigStore();
  const config = configProp ?? storeConfig;
  const media = getMediaDetails(config);
  const openRegisterSchoolModal = useRegisterSchoolEnq().onOpen;

  const [openCities, setOpenCities] = useState<string | null>(null);

  const handleCitiesToggle = (title: string) => {
    setOpenCities(openCities === title ? null : title);
  };

  return (
    <Fragment>
      <div
        className={`${
          navbarOpen
            ? "opacity-100 w-full max-h-screen overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none bg-neutral-800/70"
            : "opacity-0"
        }`}
        onClick={() => setNavbarOpen(false)}
      />
      <nav
        className={`xl:hidden max-w-[70%] md:max-w-[400px] z-30 border shadow-2xl fixed w-full h-[100dvh] bg-white text-black bg-opacity-100 transform delay-100 transition-all duration-300 ${
          navbarOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full"
        }`}
      >
        <ul className="pt-6 md:items-center overflow-auto max-h-[83%]">
          {/* Exclude footerOnly items (e.g. About Us) so the mobile nav link
              set matches the desktop <Header> exactly. Previously the two
              navs rendered different link sets in the markup, which the audit
              flagged as a duplicate/inconsistent navigation issue. About Us
              remains reachable via the footer on every page. */}
          {navList
            .filter((navItem) => !navItem.footerOnly)
            .map((navItem, idx) => (
            <Fragment key={idx}>
              <div
                className={`flex flex-col border-b ${
                  navItem.hasDropdown ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  navItem.hasDropdown && handleCitiesToggle(navItem.title)
                }
              >
                {!navItem.hasDropdown ? (
                  <Link
                    href={navItem.path ?? "/"}
                    className="flex items-center justify-between p-4 max-h-max"
                    onClick={() => setNavbarOpen(false)}
                  >
                    <li className=" lg:leading-5 max-h-max flex-1">
                      <p
                        className={`flex items-center font-medium rounded-md hover:text-greenish-light ease-in line duration-300 ${
                          pathname === navItem.path
                            ? "text-greenish-light"
                            : "text-blacky-light"
                        }`}
                      >
                        {navItem.title}
                      </p>
                    </li>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between p-4 max-h-max">
                    <li className=" lg:leading-5 max-h-max flex-1">
                      <p
                        className={`flex items-center font-medium rounded-md hover:text-greenish-light ease-in line duration-300 ${
                          pathname === navItem.path
                            ? "text-greenish-light"
                            : "text-blacky-light"
                        }`}
                      >
                        {navItem.title}
                      </p>
                    </li>
                    <span className="ml-2">
                      {openCities === navItem.title ? (
                        <BiChevronUp size={20} />
                      ) : (
                        <BiChevronDown size={20} />
                      )}
                    </span>
                  </div>
                )}
                {navItem.hasDropdown && openCities === navItem.title && (
                  <ul className="px-4 rounded-md">
                    {navItem.dropdownItems?.map((navCities, subIdx) => (
                      <Link
                        href={navCities.path}
                        key={subIdx}
                        className="block p-1 hover:bg-gray-200"
                        onClick={() => setNavbarOpen(false)}
                      >
                        <li className="text-sm ">
                          <p
                            className={` rounded-md hover:text-greenish-light ease-in line duration-300 ${
                              pathname === navCities.path
                                ? "text-greenish-light"
                                : "text-gray-500"
                            }`}
                          >
                            {navCities.title}
                          </p>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            </Fragment>
          ))}
          {/* Footer */}
          <div className="flex justify-between items-center p-4 text-xl sm:text-2xl w-full fixed bottom-12">
            {media.map((item, idx) => (
              <a
                href={item.path}
                key={item.path + idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon />
              </a>
            ))}
          </div>
        </ul>
      </nav>
    </Fragment>
  );
};

export { MenuOverlay };
