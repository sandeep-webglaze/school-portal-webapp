"use client";

// Wallet — shows the school's balance and lets them request a top-up
// (POST /transactions/credit-wallet). Completing the payment needs the payment
// gateway checkout to be wired (see the note); the order is created here.

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getWallet,
  creditWallet,
  getTransactions,
  ITransaction,
} from "@/api/school-panel/client";
import {
  FaWallet,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaCircleInfo,
} from "react-icons/fa6";

const money = (n?: number) => `AED ${Number(n || 0).toLocaleString()}`;
const QUICK = [100, 250, 500, 1000, 2500];

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState<number>(500);
  const [busy, setBusy] = useState(false);
  const [txns, setTxns] = useState<ITransaction[]>([]);

  const load = async () => {
    setLoading(true);
    const [w, t] = await Promise.all([getWallet(), getTransactions({ limit: 5 })]);
    setBalance(w.data?.amount ?? 0);
    setTxns(t.data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const topUp = async () => {
    if (!amount || amount < 1) return toast.error("Enter a valid amount");
    setBusy(true);
    const res = await creditWallet(amount);
    setBusy(false);
    if (res.error) return toast.error(res.error.message || "Couldn't start top-up");
    toast.success("Top-up request created. Complete payment to add balance.");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-blacky-light">Wallet</h1>
        <p className="text-sm text-blacky-light/55">
          Add balance to buy parent leads instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* balance card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f45] to-[#173e82] p-6 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/15 blur-2xl" />
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <FaWallet />
          </span>
          <p className="mt-5 text-xs uppercase tracking-wide text-white/60">
            Current balance
          </p>
          <p className="text-4xl font-black">
            {loading ? "…" : money(balance)}
          </p>
        </div>

        {/* top-up */}
        <div className="rounded-2xl bg-white p-6 shadow-light">
          <p className="font-bold text-blacky-light">Add money</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  amount === a
                    ? "border-green-600 bg-green-600/10 text-green-600"
                    : "border-[#e1e6ee] text-blacky-light hover:border-green-400"
                }`}
              >
                {money(a)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-stretch gap-2">
            <span className="inline-flex h-12 items-center rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-3 text-sm font-semibold text-blacky-light">
              AED
            </span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-12 flex-1 rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
            />
            <button
              onClick={topUp}
              disabled={busy}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              <FaPlus className="text-xs" /> {busy ? "…" : "Add"}
            </button>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#eef4fb] p-3 text-xs text-blacky-light/60">
            <FaCircleInfo className="mt-0.5 shrink-0 text-[#1e4fa3]" />
            Payment gateway checkout needs to be connected to finish the top-up.
            The balance updates once payment is confirmed by the backend.
          </p>
        </div>
      </div>

      {/* recent transactions */}
      <div className="rounded-2xl bg-white p-5 shadow-light">
        <p className="mb-4 font-bold text-blacky-light">Recent transactions</p>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-[#eef2f8]" />
            ))}
          </div>
        ) : txns.length === 0 ? (
          <p className="py-6 text-center text-sm text-blacky-light/50">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {txns.map((t) => {
              const credit = (t.type || "").toLowerCase().includes("credit");
              return (
                <div key={t._id} className="flex items-center gap-3 py-3 text-sm">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      credit
                        ? "bg-green-600/10 text-green-600"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {credit ? <FaArrowDown /> : <FaArrowUp />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-blacky-light">
                      {t.description || t.type || "Transaction"}
                    </p>
                    <p className="truncate text-xs text-blacky-light/50">
                      {t.status || ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 font-bold ${
                      credit ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {credit ? "+" : "−"}
                    {money(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
