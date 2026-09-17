"use client";
import Link from "next/link";
import Image from "next/image";
import { IoMdArrowDropright } from "react-icons/io";
import { getMediaDetails, navList } from "@/_mocks_/NavJson";
import { FaCaretDown } from "react-icons/fa";
import { Fragment, useState } from "react";
import { FaCaretUp } from "react-icons/fa6";
import { Container } from "../Container";
import { IAppConfig } from "@/api/AppConfig";
import { FaLocationDot, FaPhone, FaEnvelope } from "react-icons/fa6";
import ContactUs from "../ContactUs/component";
import { usePathname } from "next/navigation";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/constants";

// Contact details come ONLY from constants (never the API/DB) so no EdHippo
// data can appear. Update them in src/constants/client.ts.
export function Footer({ config: _config }: { config?: IAppConfig }) {
  const phoneNumber = CONTACT_PHONE;
  const email = CONTACT_EMAIL;
  const address = "Dubai, United Arab Emirates";
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);
  const [expanded2, setExpanded2] = useState(false);
  const toggleExpanded2 = () => setExpanded2((current) => !current);
  const pathName = usePathname();
  const media = getMediaDetails();
  const currentYear = new Date().getFullYear();

  return (
    <Fragment>
      {pathName !== "/thank-you" && pathName !== "/register-school" && (
        <ContactUs />
      )}
      <div className="bg-blacky-light">
        <Container bgColor="bg-blacky-light !py-4">
          <footer className="text-white bg-blacky-light">
            <div className="pt-10 sm:py-12 flex flex-col md:flex-row flex-wrap justify-between gap-8 md:gap-6">
              {/* Logo + Contact */}
              <div className="flex flex-col lg:w-max gap-4">
                <Link href={"/"} className="flex items-center gap-2">
                  <Image
                    src={"/images/logo.svg"}
                    alt={SITE_NAME}
                    width={44}
                    height={44}
                    className="w-11 h-auto rounded-lg"
                  />
                  <div className="flex flex-col leading-tight">
                    <p className="text-lg lg:text-xl font-extrabold tracking-wide">
                      {SITE_NAME}
                    </p>
                    <p className="text-[10px] lg:text-[11px] font-semibold tracking-[0.25em] uppercase text-greenish-light">
                      Dubai
                    </p>
                  </div>
                </Link>

                <p className="text-sm text-white/70 max-w-[220px] leading-5">
                  {SITE_NAME} helps parents find and compare the best schools in
                  Dubai.
                </p>

                <ul className="flex flex-col gap-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <FaLocationDot className="text-greenish-light mt-[2px] shrink-0" />
                    <span className="max-w-[200px] leading-4">{address}</span>
                  </li>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex items-center gap-2 hover:text-green-400 transition-colors"
                  >
                    <FaPhone className="text-greenish-light shrink-0" />
                    {phoneNumber}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 hover:text-green-400 transition-colors"
                  >
                    <FaEnvelope className="text-greenish-light shrink-0" />
                    {email}
                  </a>
                </ul>

                {/* Social Media */}
                <div className="flex items-center gap-2 text-blacky-light">
                  {media.map((item, id) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={id}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${SITE_NAME} social link`}
                        className="p-[5px] bg-white rounded-full hover:bg-greenish-light hover:text-white transition-all duration-300 text-[14px]"
                      >
                        <Icon />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-start">
                <div
                  className="flex md:block items-center justify-between w-full"
                  onClick={toggleExpanded}
                >
                  <h4 className="text-base font-semibold uppercase tracking-widest text-white/90">
                    Quick Links
                  </h4>
                  <div className="w-full md:hidden">
                    <div className="float-right">
                      {expanded ? <FaCaretUp /> : <FaCaretDown />}
                    </div>
                  </div>
                </div>
                <div className="my-2 border-b-2 border-greenish-light w-10"></div>
                <div
                  className={`overflow-hidden transition-[height] duration-500 ease-in ${expanded ? "h-42" : "h-0 md:h-full"}`}
                >
                  {navList.map((item, id) => {
                    if (item.path)
                      return (
                        <Link key={id} href={item.path}>
                          <li className="my-2 list-none flex items-center text-sm text-white/80 hover:text-greenish-light transition-colors duration-200">
                            <IoMdArrowDropright className="text-greenish-light" />
                            {item.title}
                          </li>
                        </Link>
                      );
                  })}
                </div>
              </div>

              {/* Impt Links */}
              <div className="flex flex-col items-start">
                <div
                  className="flex md:block items-center justify-between w-full"
                  onClick={toggleExpanded2}
                >
                  <h4 className="text-base font-semibold uppercase tracking-widest text-white/90">
                    Impt. Links
                  </h4>
                  <div className="w-full md:hidden">
                    <div className="float-right">
                      {expanded2 ? <FaCaretUp /> : <FaCaretDown />}
                    </div>
                  </div>
                </div>
                <div className="my-2 border-b-2 border-greenish-light w-10"></div>
                <div
                  className={`overflow-hidden transition-[height] duration-500 ease-in ${expanded2 ? "h-20" : "h-0 md:h-full"}`}
                >
                  {[
                    { title: "Privacy Policy", path: "/privacy-policy" },
                    { title: "Terms & Conditions", path: "/terms" },
                    { title: "Refund Policy", path: "/refund-policy" },
                  ].map((item, id) => (
                    <Link key={id} href={item.path}>
                      <li className="my-2 list-none flex items-center text-sm text-white/80 hover:text-greenish-light transition-colors duration-200">
                        <IoMdArrowDropright className="text-greenish-light" />
                        {item.title}
                      </li>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-sm text-white/60">
                &#169; {currentYear}
                <Link href={"/"} className="text-greenish-light mx-1">
                  {SITE_NAME}
                </Link>
                All Rights Reserved.
              </p>
            </div>
          </footer>
        </Container>
      </div>
    </Fragment>
  );
}
