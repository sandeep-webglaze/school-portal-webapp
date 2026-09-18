import { getMediaDetails } from "@/_mocks_/NavJson";
import Link from "next/link";
import React from "react";
import { FaPhone } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail, MdOutlinePhoneInTalk } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_WHATSAPP_NUMBER,
  SITE_NAME,
} from "@/constants";
import { IAppConfig } from "@/api/AppConfig";

// Contact + social details come ONLY from the constants file — never from the
// API/DB — so no EdHippo data can ever appear here. Update them in
// src/constants/client.ts.
const TopBar = ({ config: _config }: { config?: IAppConfig }) => {
  const media = getMediaDetails();
  const phoneNumber = CONTACT_PHONE;
  const email = CONTACT_EMAIL;
  const whatsappNumber = CONTACT_WHATSAPP_NUMBER;

  return (
    <div className="w-full bg-gradient-to-r from-[#0f1b33] via-blacky-light to-[#0f1b33] border-b-2 border-gold/60">
      <div className="max-w-[1450px] mx-auto">
        <div className="py-[7px] px-3 sm:px-7 lg:px-10 xl:px-14 flex flex-nowrap justify-between items-center gap-3 whitespace-nowrap overflow-x-auto">
          {/* Left: announcement + contact */}
          <div className="flex items-center gap-4 min-w-0">
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-gold/15 text-gold px-3 py-1 text-[12px] font-semibold">
              <HiSparkles /> Admissions open 2026–27
            </span>
            <div className="hidden md:flex items-center gap-4 text-[13px] text-white/80">
              <a
                href={`tel:${phoneNumber}`}
                className="flex gap-x-2 items-center hover:text-gold transition-colors"
              >
                <FaPhone className="text-gold" size={12} />
                <span>{phoneNumber}</span>
              </a>
              <span className="text-white/20">|</span>
              <a
                href={`mailto:${email}`}
                className="flex gap-x-2 items-center hover:text-gold transition-colors"
              >
                <MdEmail size={15} className="text-gold" />
                <span>{email}</span>
              </a>
            </div>

            {/* Mobile contact icons */}
            <div className="md:hidden flex items-center gap-3">
              <a
                href={`tel:${phoneNumber}`}
                className="text-[20px] text-white/80 hover:text-gold transition-colors"
              >
                <MdOutlinePhoneInTalk />
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
                rel="noopener noreferrer"
                target="_blank"
                className="text-[20px] text-white/80 hover:text-gold transition-colors"
              >
                <IoLogoWhatsapp />
              </a>
            </div>
          </div>

          {/* Right: social chips */}
          <div className="flex items-center gap-1.5 text-[14px] text-white/70">
            {media.map((item, id) => {
              const Icon = item.icon;
              return (
                <Link
                  key={id}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE_NAME} social link`}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-gold hover:text-blacky-light transition-all duration-200"
                >
                  <Icon />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
