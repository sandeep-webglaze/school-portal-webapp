/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { SITE_NAME } from "@/constants";
import {
  FaBullseye,
  FaEye,
  FaCircleCheck,
  FaShieldHalved,
  FaHandshake,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa6";

const VALUES = [
  {
    icon: FaShieldHalved,
    title: "Verified & Trusted",
    text: "Every school profile is checked for accurate curriculum, fees and contact details before it goes live.",
  },
  {
    icon: FaHandshake,
    title: "Independent Guidance",
    text: "We are not owned by any school group — our recommendations are unbiased and always free for parents.",
  },
  {
    icon: FaUsers,
    title: "Parents First",
    text: "Real parent reviews and honest comparisons so you can decide with confidence, not guesswork.",
  },
];

const POINTS = [
  "Verified & regularly updated school information",
  "Compare facilities, fees & curriculum side by side",
  "Genuine, moderated parent reviews",
  "Free expert admission guidance",
];

const AboutContent = () => {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-500 text-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            About Us
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
            Helping Dubai&apos;s parents find the right school
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/85 max-w-2xl mx-auto">
            {SITE_NAME} is a school discovery and admission-guidance platform
            built for families in Dubai. We bring every school&apos;s details,
            fees and reviews into one place so choosing the right school is
            simple, transparent and stress-free.
          </p>
        </div>
      </section>

      {/* Intro + image */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            Who we are
          </h2>
          <p className="mt-4 text-sm text-blacky-light/70 leading-relaxed">
            Finding the right school is one of the most important decisions a
            family makes. {SITE_NAME} was created to make that decision easier —
            with verified information, side-by-side comparisons and honest
            reviews across British, American, IB, Indian and other curricula in
            Dubai.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-blacky-light/80">
                <FaCircleCheck className="text-green-500 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors"
          >
            Explore Schools <FaArrowRight />
          </Link>
        </div>
        <img
          src="/images/about2.avif"
          alt={`${SITE_NAME} — school discovery in Dubai`}
          className="w-full h-[320px] object-cover rounded-2xl shadow-spread"
        />
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#eef4fb]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-light">
            <span className="h-12 w-12 rounded-xl bg-[#eaf1fb] text-green-600 flex items-center justify-center text-xl">
              <FaBullseye />
            </span>
            <h3 className="mt-4 text-xl font-bold text-blacky-light">Our Mission</h3>
            <p className="mt-2 text-sm text-blacky-light/70 leading-relaxed">
              To simplify the school search for every parent in Dubai — giving
              them accurate information and free, unbiased guidance so every
              child finds a school where they can thrive.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-light">
            <span className="h-12 w-12 rounded-xl bg-[#fbf3dd] text-gold-dark flex items-center justify-center text-xl">
              <FaEye />
            </span>
            <h3 className="mt-4 text-xl font-bold text-blacky-light">Our Vision</h3>
            <p className="mt-2 text-sm text-blacky-light/70 leading-relaxed">
              A future where choosing a school is transparent and stress-free —
              where families make confident decisions backed by verified data
              and real experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            What we stand for
          </h2>
          <p className="text-sm text-blacky-light/60 mt-2">
            The principles behind everything we build.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-light hover:shadow-spread hover:-translate-y-1 transition-all duration-300"
            >
              <span className="h-12 w-12 rounded-xl bg-green-600/10 text-green-600 flex items-center justify-center text-xl">
                <v.icon />
              </span>
              <h3 className="mt-4 text-lg font-bold text-blacky-light">{v.title}</h3>
              <p className="mt-2 text-sm text-blacky-light/70 leading-relaxed">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500" />
        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to find the perfect school?
          </h2>
          <p className="mt-3 text-sm text-white/85 max-w-xl mx-auto">
            Start exploring verified schools across Dubai with {SITE_NAME}.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-green-600 hover:bg-gold hover:text-white transition-colors"
          >
            Search Schools <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutContent;
