"use client";

// Available Leads — parent admission enquiries the school can BUY. Contact
// details stay masked until purchased. Select leads, see the total, and buy
// them with the wallet balance (POST /transactions/purchase-leads).

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAvailableLeads,
  purchaseLeads,
  getWallet,
  ILead,
} from "@/api/school-panel/client";
import {
  FaBullseye,
  FaUser,
  FaLocationDot,
  FaGraduationCap,
  FaVenusMars,
  FaLock,
  FaWallet,
  FaCircleCheck,
} from "react-icons/fa6";

const money = (n?: number) => `AED ${Number(n || 0).toLocaleString()}`;
const maskName = (name?: string) => {
  if (!name) return "Parent";
  const parts = name.trim().split(" ");
  return parts.map((p) => p[0] + "•••").join(" ");
};

export default function AvailableLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [wallet, setWallet] = useState(0);
  const [buying, setBuying] = useState(false);

  const load = async () => {
    setLoading(true);
    const [l, w] = await Promise.all([getAvailableLeads(), getWallet()]);
    setLeads(l.data ?? []);
    setWallet(w.data?.amount ?? 0);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const toggle = (id: string) =>
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const total = leads
    .filter((l) => sel.includes(l._id))
    .reduce((sum, l) => sum + (l.currentPrice || 0), 0);

  const buy = async () => {
    if (!sel.length) return;
    if (total > wallet)
      return toast.error("Not enough wallet balance. Please top up.");
    setBuying(true);
    const res = await purchaseLeads(sel);
    setBuying(false);
    if (res.error) return toast.error(res.error.message || "Purchase failed");
    toast.success(`${sel.length} lead(s) purchased!`);
    setSel([]);
    load();
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-blacky-light">
            Available Leads
          </h1>
          <p className="text-sm text-blacky-light/55">
            Fresh parent enquiries — buy to unlock full contact details.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eef4fb] px-4 py-2 text-sm font-bold text-[#1e4fa3]">
          <FaWallet /> {money(wallet)}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {leads.map((l) => {
            const on = sel.includes(l._id);
            return (
              <button
                key={l._id}
                onClick={() => toggle(l._id)}
                className={`relative rounded-2xl border-2 bg-white p-5 text-left shadow-light transition ${
                  on ? "border-green-600" : "border-transparent hover:border-green-200"
                }`}
              >
                <span
                  className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                    on
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-[#cdd8ea] text-transparent"
                  }`}
                >
                  <FaCircleCheck className="text-xs" />
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/10 text-green-600">
                    <FaUser className="text-sm" />
                  </span>
                  <div>
                    <p className="font-bold text-blacky-light">
                      {maskName(l.name)}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-blacky-light/50">
                      <FaLock className="text-[9px]" /> Unlocks after purchase
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {l.schoolType?.name && (
                    <Tag icon={FaGraduationCap} text={l.schoolType.name} />
                  )}
                  {l.class && <Tag icon={FaGraduationCap} text={`Class ${l.class}`} />}
                  {l.city?.city && <Tag icon={FaLocationDot} text={l.city.city} />}
                  {l.gender && <Tag icon={FaVenusMars} text={l.gender} />}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-blacky-light/50">Lead price</span>
                  <span className="text-lg font-extrabold text-[#1e4fa3]">
                    {money(l.currentPrice)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* sticky buy bar */}
      {sel.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e1e6ee] bg-white/95 p-4 backdrop-blur lg:pl-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-blacky-light">
                {sel.length} lead(s) selected
              </p>
              <p className="text-xs text-blacky-light/55">
                Total {money(total)} · Balance {money(wallet)}
              </p>
            </div>
            <button
              onClick={buy}
              disabled={buying}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-6 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {buying ? "Processing…" : `Buy for ${money(total)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Tag = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <span className="inline-flex items-center gap-1 rounded-md bg-[#eef4fb] px-2 py-1 font-medium text-blacky-light/70">
    <Icon className="text-[10px] text-green-600" /> {text}
  </span>
);

const Empty = () => (
  <div className="rounded-2xl bg-white p-12 text-center shadow-light">
    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
      <FaBullseye />
    </span>
    <p className="text-lg font-bold text-blacky-light">No leads available yet</p>
    <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
      New parent enquiries appear here as parents search. Check back soon, or{" "}
      <Link href="/school-portal/wallet" className="font-semibold text-green-600">
        top up your wallet
      </Link>{" "}
      so you&apos;re ready to buy.
    </p>
  </div>
);
