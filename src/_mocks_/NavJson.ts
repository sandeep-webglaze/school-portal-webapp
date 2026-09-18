import { HiMiniHome } from "react-icons/hi2";
import type { IconType } from "react-icons";
import { IAppConfig } from "@/api/AppConfig";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/constants";

type NavItem = {
  title: string;
  path?: string;
  icon?: IconType;
  hasDropdown?: boolean;
  dropdownItems?: { title: string; path: string }[];
  target?: string;
  footerOnly?: boolean;
};

// Navigation trimmed for the redesign: only the pages that should be live for
// now are listed here (Home, Register School, About Us). The extra pages
// (Boarding/Day school dropdowns, Compare Schools, Blogs, Contact Us) are kept
// in the codebase but hidden from the nav — add them back here when ready.
export const navList: NavItem[] = [
  { title: "Home", path: "/", icon: HiMiniHome },
  { title: "Schools", path: "/schools" },
  { title: "Guides", path: "/schools" },
  { title: "About Us", path: "/about" },
  { title: "Contact", path: "/contact-us" },
];

// NOTE: intentionally ignores the API config so no EdHippo social links from
// the backend/DB ever leak into the UI. Always uses the SOCIAL_LINKS constants.
export function getMediaDetails(_config?: IAppConfig) {
  return [
    { path: SOCIAL_LINKS.facebook, icon: FaFacebookF },
    { path: SOCIAL_LINKS.instagram, icon: FaInstagram },
    { path: SOCIAL_LINKS.twitter, icon: FaXTwitter },
    { path: SOCIAL_LINKS.linkedIn, icon: FaLinkedinIn },
    { path: SOCIAL_LINKS.pinterest, icon: FaPinterestP },
    { path: SOCIAL_LINKS.youtube, icon: FaYoutube },
  ];
}
