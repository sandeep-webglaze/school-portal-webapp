"use client";

// School dashboard — wallet balance, quick stats and recent activity, pulled
// from GET /homepage/school-panel (with a fallback to individual endpoints).

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDashboard,
  getWallet,
  getMyLeads,
  ILead,
  ITransaction,
  DashboardData,
} from "@/api/school-panel/client";
import {
  FaWallet,
  FaFolderOpen,
  FaBullseye,
  FaReceipt,
  FaArrowRight,
  FaUser,
  FaPhone,
  FaLocationDot,
} from "react-icons/fa6";

const money = (n?: number) => `AED ${Number(n || 0).toLocaleString()}`;
const fdate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(0);
  const [myLeads, setMyLeads] = useState<ILead[]>([]);
  const [txns, setTxns] = useState<ITransaction[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getDashboard();
      const d = res.data as DashboardData | undefined;
      if (d) {
        setWallet(d.wallet?.amount ?? 0);
        setMyLeads(d.myLeads?.data ?? []);
        setTxns(d.transactions?.data ?? []);
      } else {
        // fallback if the bundle endpoint isn't available
        const [w, l] = await Promise.all([getWallet(), getMyLeads()]);
        setWallet(w.data?.amount ?? 0);
        setMyLeads(l.data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const stats = [
    {
      icon: FaWallet,
      label: "Wallet Balance",
      value: money(wallet),
      href: "/school-portal/wallet",
      tone: "from-[#173e82] to-green-600",
    },
    {
      icon: FaFolderOpen,
      label: "My Leads",
      value: String(myLeads.length),
      href: "/school-portal/my-leads",
      tone: "from-[#1e4fa3] to-[#3b6fd4]",
    },
    {
      icon: FaReceipt,
      label: "Transactions",
      value: String(txns.length),
      href: "/school-portal/transactions",
      tone: "from-[#0b1f45] to-[#173e82]",
    },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-blacky-light">Dashboard</h1>
        <p className="text-sm text-blacky-light/55">
          Your admissions activity at a glance.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.tone} p-5 text-white shadow-[0_15px_40px_-20px_rgba(15,35,70,0.5)]`}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <s.icon />
            </span>
            <p className="mt-4 text-2xl font-extrabold">{s.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
              {s.label}
              <FaArrowRight className="opacity-0 transition group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      {/* buy leads CTA */}
      <Link
        href="/school-portal/leads"
        className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gold/10 p-5 transition hover:bg-gold/15"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/25 text-gold-dark">
            <FaBullseye />
          </span>
          <div>
            <p className="text-sm font-bold text-blacky-light">
              New parent leads available
            </p>
            <p className="text-xs text-blacky-light/60">
              Browse and buy fresh admission enquiries in your area.
            </p>
          </div>
        </div>
        <FaArrowRight className="text-gold-dark" />
      </Link>

      {/* recent leads */}
      <div className="rounded-2xl bg-white p-5 shadow-light">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-blacky-light">Recent Leads</h2>
          <Link
            href="/school-portal/my-leads"
            className="text-xs font-semibold text-green-600 hover:underline"
          >
            View all
          </Link>
        </div>
        {myLeads.length === 0 ? (
          <p className="py-6 text-center text-sm text-blacky-light/50">
            No leads yet. Buy leads to start receiving parent enquiries.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {myLeads.slice(0, 5).map((l) => (
              <div
                key={l._id}
                className="flex items-center gap-3 py-3 text-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-600">
                  <FaUser className="text-xs" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-blacky-light">
                    {l.name}
                  </p>
                  <p className="flex items-center gap-2 truncate text-xs text-blacky-light/55">
                    <FaPhone className="text-[10px]" /> {l.phoneNumber || "—"}
                    {l.city?.city && (
                      <>
                        <FaLocationDot className="text-[10px]" /> {l.city.city}
                      </>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-blacky-light/45">
                  {fdate(l.generatedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="h-8 w-40 animate-pulse rounded bg-white/70" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/70" />
      ))}
    </div>
    <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
  </div>
);
