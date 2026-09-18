"use client";
import Link from "next/link";
import Image from "next/image";
import { IoMdArrowDropright } from "react-icons/io";
import { getMediaDetails, navList } from "@/_mocks_/NavJson";
import { Fragment, useState, FormEvent, ReactNode } from "react";
import { Container } from "../Container";
import { IAppConfig } from "@/api/AppConfig";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaLock,
} from "react-icons/fa6";
import ContactUs from "../ContactUs/component";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/constants";

// Contact details come ONLY from constants (never the API/DB) so no Education Portal
// data can appear. Update them in src/constants/client.ts.

const GET_STARTED = [
  { title: "Register Your School", path: "/register-school" },
  { title: "Search Schools", path: "/schools" },
  { title: "Compare Schools", path: "/schools" },
  { title: "Get Admission Help", path: "#get-admission-help" },
];

const POLICIES = [
  { title: "Privacy Policy", path: "/privacy-policy" },
  { title: "Terms & Conditions", path: "/terms" },
  { title: "Refund Policy", path: "/refund-policy" },
];

export function Footer({ config: _config }: { config?: IAppConfig }) {
  const phoneNumber = CONTACT_PHONE;
  const email = CONTACT_EMAIL;
  const address = "Dubai, United Arab Emirates";
  const pathName = usePathname();
  const media = getMediaDetails();
  const currentYear = new Date().getFullYear();
  const [subMail, setSubMail] = useState("");

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!subMail.trim()) return;
    setSubMail("");
    toast.success("Thanks for subscribing!", { id: "newsletter" });
  };

  const Heading = ({ children }: { children: ReactNode }) => (
    <div className="mb-4">
      <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
        {children}
      </h4>
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-gold" />
    </div>
  );

  const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="group flex items-center gap-1.5 py-1.5 text-sm text-white/65 transition-colors hover:text-gold"
    >
      <IoMdArrowDropright className="text-gold transition-transform group-hover:translate-x-0.5" />
      {label}
    </Link>
  );

  return (
    <Fragment>
      {pathName !== "/thank-you" && pathName !== "/register-school" && (
        <ContactUs />
      )}
      <div className="relative bg-blacky-light">
        {/* top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1e4fa3] via-gold to-[#1e4fa3]" />
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-10 right-1/4 h-40 w-40 rounded-full bg-[#1e4fa3]/20 blur-3xl" />

        <Container bgColor="bg-transparent !py-4">
          <footer className="relative text-white">
            <div className="grid grid-cols-1 gap-10 pt-12 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
              {/* Brand + contact */}
              <div className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt={SITE_NAME}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-lg"
                  />
                  <div className="flex flex-col leading-tight">
                    <p className="text-lg font-extrabold tracking-wide lg:text-xl">
                      {SITE_NAME}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold lg:text-[11px]">
                      Dubai
                    </p>
                  </div>
                </Link>

                <p className="max-w-[240px] text-sm leading-6 text-white/65">
                  {SITE_NAME} helps parents find, compare and choose the best
                  schools in Dubai — simple, transparent and free.
                </p>

                <ul className="flex flex-col gap-2.5 text-sm text-white/75">
                  <li className="flex items-start gap-2.5">
                    <FaLocationDot className="mt-[3px] shrink-0 text-gold" />
                    <span className="max-w-[210px] leading-5">{address}</span>
                  </li>
                  <li>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-gold"
                    >
                      <FaPhone className="shrink-0 text-gold" />
                      {phoneNumber}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-gold"
                    >
                      <FaEnvelope className="shrink-0 text-gold" />
                      {email}
                    </a>
                  </li>
                </ul>

                {/* Social */}
                <div className="mt-1 flex items-center gap-2">
                  {media.map((item, id) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={id}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${SITE_NAME} social link`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[14px] text-white ring-1 ring-white/10 transition-all duration-300 hover:bg-gold hover:text-blacky-light"
                      >
                        <Icon />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <Heading>Quick Links</Heading>
                <div className="flex flex-col">
                  {navList.map(
                    (item, id) =>
                      item.path && (
                        <FooterLink
                          key={id}
                          href={item.path}
                          label={item.title}
                        />
                      ),
                  )}
                </div>
              </div>

              {/* Get Started */}
              <div>
                <Heading>Get Started</Heading>
                <div className="flex flex-col">
                  {GET_STARTED.map((item, id) => (
                    <FooterLink key={id} href={item.path} label={item.title} />
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <Heading>Stay Updated</Heading>
                <p className="mb-3 max-w-[260px] text-sm leading-6 text-white/65">
                  Get new school listings and admission tips in Dubai, straight
                  to your inbox.
                </p>
                <form
                  onSubmit={onSubscribe}
                  className="flex overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15 transition focus-within:ring-2 focus-within:ring-gold"
                >
                  <input
                    value={subMail}
                    onChange={(e) => setSubMail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="inline-flex shrink-0 items-center gap-1 bg-gold px-4 text-sm font-bold text-blacky-light transition hover:opacity-90"
                  >
                    <FaArrowRight className="text-xs" />
                  </button>
                </form>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/40">
                  <FaLock className="text-[10px]" /> We respect your privacy. No
                  spam.
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 sm:flex-row">
              <p className="text-sm text-white/55">
                &#169; {currentYear}{" "}
                <Link href="/" className="mx-1 font-semibold text-gold">
                  {SITE_NAME}
                </Link>
                All Rights Reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                {POLICIES.map((p) => (
                  <Link
                    key={p.title}
                    href={p.path}
                    className="text-[13px] text-white/55 transition-colors hover:text-gold"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </Container>
      </div>
    </Fragment>
  );
}
