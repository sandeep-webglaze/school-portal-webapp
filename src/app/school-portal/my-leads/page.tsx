"use client";

// My Leads — enquiries the school has already purchased, with FULL contact
// details (name, phone, email) so they can follow up. Includes search.

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMyLeads, ILead } from "@/api/school-panel/client";
import {
  FaFolderOpen,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaGraduationCap,
  FaMagnifyingGlass,
  FaWhatsapp,
} from "react-icons/fa6";

const fdate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function MyLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    getMyLeads()
      .then((res) => setLeads(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return leads;
    const n = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        l.name?.toLowerCase().includes(n) ||
        l.phoneNumber?.includes(n) ||
        l.city?.city?.toLowerCase().includes(n)
    );
  }, [leads, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-blacky-light">My Leads</h1>
          <p className="text-sm text-blacky-light/55">
            Parent enquiries you&apos;ve unlocked — follow up and convert.
          </p>
        </div>
        <div className="relative">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9aa6ba]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, area…"
            className="h-11 w-64 rounded-xl border border-[#e1e6ee] bg-white pl-9 pr-3 text-sm outline-none focus:border-green-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-light">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
            <FaFolderOpen />
          </span>
          <p className="text-lg font-bold text-blacky-light">
            {leads.length === 0 ? "No purchased leads yet" : "No matches"}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
            {leads.length === 0 ? (
              <>
                Head to{" "}
                <Link
                  href="/school-portal/leads"
                  className="font-semibold text-green-600"
                >
                  Available Leads
                </Link>{" "}
                to buy parent enquiries.
              </>
            ) : (
              "Try a different search term."
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((l) => (
            <div
              key={l._id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-light"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e4fa3]/10 text-[#1e4fa3]">
                    <FaUser />
                  </span>
                  <div>
                    <p className="font-bold text-blacky-light">{l.name}</p>
                    <p className="text-xs text-blacky-light/50">
                      Added {fdate(l.generatedAt)}
                    </p>
                  </div>
                </div>
                {l.phoneNumber && (
                  <a
                    href={`https://wa.me/${l.phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#128C7E] transition hover:bg-[#25D366]/20"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {l.phoneNumber && (
                  <Info icon={FaPhone} label={l.phoneNumber} href={`tel:${l.phoneNumber}`} />
                )}
                {l.email && <Info icon={FaEnvelope} label={l.email} href={`mailto:${l.email}`} />}
                {l.city?.city && <Info icon={FaLocationDot} label={l.city.city} />}
                {(l.class || l.schoolType?.name) && (
                  <Info
                    icon={FaGraduationCap}
                    label={[l.schoolType?.name, l.class && `Class ${l.class}`]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Info = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
}) => {
  const content = (
    <span className="flex items-center gap-2 text-blacky-light/75">
      <Icon className="shrink-0 text-xs text-green-600" />
      <span className="truncate">{label}</span>
    </span>
  );
  return href ? (
    <a href={href} className="hover:text-green-600">
      {content}
    </a>
  ) : (
    content
  );
};
