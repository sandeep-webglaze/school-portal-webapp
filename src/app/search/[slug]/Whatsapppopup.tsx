"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import useConfigStore from "@/hooks/useConfigStore";
import { CONTACT_WHATSAPP_NUMBER } from "@/constants";

interface WhatsappProps {
  side?: "left" | "right";
}

const Whatsapp: React.FC<WhatsappProps> = ({ side = "right" }) => {
  const { config } = useConfigStore();
  const whatsappNumber =
    config?.contactUs?.phoneNumber?.replace(/\D/g, "") ||
    CONTACT_WHATSAPP_NUMBER;
  return (
    <Link
      href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed z-40 bottom-6 ${side === "left" ? "left-6" : "right-6"} flex items-center`}
    >
      {/* Hover label */}
      <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-full bg-blacky-light px-3 py-1.5 text-xs font-semibold text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg">
        Chat on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/20 transition-transform group-hover:scale-110">
          <FaWhatsapp className="text-3xl" />
        </span>
      </span>
      <span className="sr-only">Contact via WhatsApp</span>
    </Link>
  );
};

export default Whatsapp;
