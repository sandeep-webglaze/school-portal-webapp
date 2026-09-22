"use client";

// Enquiries — messages/enquiries received for the school (GET /school-enquiry).

import React, { useEffect, useMemo, useState } from "react";
import { getSchoolEnquiries, IEnquiry } from "@/api/school-panel/client";
import {
  FaEnvelopeOpenText,
  FaUser,
  FaEnvelope,
  FaMagnifyingGlass,
  FaLink,
} from "react-icons/fa6";

const fdate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const statusTone = (s?: string) => {
  const v = (s || "").toLowerCase();
  if (v.includes("new") || v.includes("open")) return "bg-green-600/10 text-green-600";
  if (v.includes("progress")) return "bg-amber-100 text-amber-600";
  if (v.includes("closed") || v.includes("done"))
    return "bg-[#eef4fb] text-blacky-light/60";
  return "bg-[#eef4fb] text-blacky-light/60";
};

export default function EnquiriesPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<IEnquiry[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    getSchoolEnquiries()
      .then((res) => setList(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const n = q.trim().toLowerCase();
    return list.filter(
      (e) =>
        e.name?.toLowerCase().includes(n) ||
        e.email?.toLowerCase().includes(n) ||
        e.message?.toLowerCase().includes(n)
    );
  }, [list, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-blacky-light">Enquiries</h1>
          <p className="text-sm text-blacky-light/55">
            Messages and enquiries received for your school.
          </p>
        </div>
        <div className="relative">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9aa6ba]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search enquiries…"
            className="h-11 w-64 rounded-xl border border-[#e1e6ee] bg-white pl-9 pr-3 text-sm outline-none focus:border-green-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-light">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
            <FaEnvelopeOpenText />
          </span>
          <p className="text-lg font-bold text-blacky-light">
            {list.length === 0 ? "No enquiries yet" : "No matches"}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
            {list.length === 0
              ? "Enquiries from parents will appear here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((e) => (
            <div
              key={e._id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-light"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e4fa3]/10 text-[#1e4fa3]">
                    <FaUser />
                  </span>
                  <div>
                    <p className="font-bold text-blacky-light">
                      {e.name || "Parent"}
                    </p>
                    {e.email && (
                      <a
                        href={`mailto:${e.email}`}
                        className="flex items-center gap-1 text-xs text-blacky-light/55 hover:text-green-600"
                      >
                        <FaEnvelope className="text-[10px]" /> {e.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {e.status && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusTone(
                        e.status
                      )}`}
                    >
                      {e.status}
                    </span>
                  )}
                  {e.createdAt && (
                    <span className="text-[11px] text-blacky-light/45">
                      {fdate(e.createdAt)}
                    </span>
                  )}
                </div>
              </div>
              {e.message && (
                <p className="mt-3 rounded-xl bg-[#f4f8fd] p-3 text-sm text-blacky-light/75">
                  {e.message}
                </p>
              )}
              {e.pageUrl && (
                <a
                  href={e.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline"
                >
                  <FaLink className="text-[10px]" /> View page
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
