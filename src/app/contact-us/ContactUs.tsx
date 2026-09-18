/* eslint-disable @next/next/no-img-element */
"use client";
import { getMediaDetails } from "@/_mocks_/NavJson";
import { ContactForm } from "@/components/ContactUs";
import useConfigStore from "@/hooks/useConfigStore";
import Link from "next/link";
import React, { Fragment } from "react";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "@/constants";
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaArrowRight,
  FaHeadset,
  FaRegClock,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";

const Contact = () => {
  const { config } = useConfigStore();
  const media = getMediaDetails(config);

  const email = config?.contactUs?.mail || CONTACT_EMAIL;
  const phone = config?.contactUs?.phoneNumber || CONTACT_PHONE;
  const address = config?.contactUs?.address || "Dubai, United Arab Emirates";

  const INFO = [
    {
      icon: FaEnvelope,
      label: "Email us",
      value: email,
      href: `mailto:${email}`,
      bg: "#e7eefc",
      fg: "#1e4fa3",
    },
    {
      icon: FaPhone,
      label: "Call us",
      value: phone,
      href: `tel:${phone}`,
      bg: "#dff3ec",
      fg: "#1a9c78",
    },
    {
      icon: FaLocationDot,
      label: "Visit us",
      value: address,
      href: "#map",
      bg: "#fbf1d9",
      fg: "#c79a2e",
    },
  ];

  return (
    <Fragment>
      {/* ============================= HERO (left aligned) ============================= */}
      <section className="relative overflow-hidden bg-[#0b1f45]">
        <img
          src="/about.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45] via-[#0b1f45]/95 to-[#0b1f45]/60" />
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className={`relative ${CONTAINER} py-16 md:py-20`}>
          <div className="max-w-2xl text-left text-white">
            <span className="inline-flex items-center rounded-lg bg-gold/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-gold/30">
              Contact Us
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] md:text-5xl">
              We&apos;re here to help you find the{" "}
              <span className="text-gold">right school</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
              Have a question about schools, admissions or listing your school
              on {SITE_NAME}? Our Dubai team is happy to help — reach out any way
              you like.
            </p>
          </div>
        </div>
      </section>

      {/* ============================= INFO + FORM ============================= */}
      <section className="bg-[#eef4fb]">
        <div
          className={`${CONTAINER} grid grid-cols-1 gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]`}
        >
          {/* left: info */}
          <div>
            <span className="inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Get in touch
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-blacky-light md:text-3xl">
              Reach out to our team
            </h2>
            <p className="mt-2 max-w-md text-sm text-blacky-light/60">
              Free, friendly and independent guidance for parents and schools
              across Dubai.
            </p>

            <div className="mt-6 space-y-3">
              {INFO.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-light transition hover:-translate-y-0.5 hover:shadow-spread"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: c.bg, color: c.fg }}
                  >
                    <c.icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blacky-light/45">
                      {c.label}
                    </p>
                    <p className="truncate text-sm font-bold text-blacky-light">
                      {c.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* hours + social */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-light">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-lg text-green-600">
                <FaRegClock />
              </span>
              <div>
                <p className="text-sm font-bold text-blacky-light">
                  Sun – Thu, 9:00 AM – 6:00 PM
                </p>
                <p className="text-xs text-blacky-light/55">
                  We reply to most messages within 24 hours.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {media.map((item, id) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE_NAME} social link`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blacky-light shadow-light transition hover:bg-[#17458f] hover:text-white"
                  >
                    <Icon />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* right: form */}
          <div className="rounded-[28px] bg-white p-6 shadow-[0_25px_60px_-25px_rgba(15,35,70,0.3)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                <FaHeadset />
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-blacky-light">
                  Send us a message
                </h3>
                <p className="text-sm text-blacky-light/55">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ContactForm name="contact-form" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================= MAP (Dubai) ============================= */}
      <section id="map" className="bg-white">
        <div className={`${CONTAINER} py-14`}>
          <div className="mb-6 text-left">
            <span className="inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Our Location
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-blacky-light md:text-3xl">
              Find us in Dubai
            </h2>
            <p className="mt-2 max-w-xl text-sm text-blacky-light/60">
              We serve families and schools across all areas of Dubai and the
              UAE.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-spread ring-1 ring-gray-100">
            <iframe
              title="Dubai map"
              src="https://maps.google.com/maps?q=Dubai&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ============================= CTA ============================= */}
      <section className="bg-[#eef4fb]">
        <div
          className={`${CONTAINER} grid grid-cols-1 items-center gap-6 py-14 md:grid-cols-[1.4fr_0.6fr]`}
        >
          <div>
            <h2 className="text-2xl font-extrabold text-blacky-light md:text-3xl">
              Looking for a school for your child?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-blacky-light/60">
              Browse verified schools or let our counsellors guide you — free of
              charge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-self-end">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-500"
            >
              Search Schools <FaArrowRight className="text-[11px]" />
            </Link>
            <Link
              href="/register-school"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-blacky-light transition hover:opacity-90"
            >
              List Your School
            </Link>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Contact;
