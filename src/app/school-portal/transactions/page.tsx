"use client";

// Transactions — full wallet & lead-purchase history (GET /transactions).

import React, { useEffect, useState } from "react";
import { getTransactions, ITransaction } from "@/api/school-panel/client";
import { FaReceipt, FaArrowUp, FaArrowDown } from "react-icons/fa6";

const money = (n?: number) => `AED ${Number(n || 0).toLocaleString()}`;
const fdate = (d?: string) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [txns, setTxns] = useState<ITransaction[]>([]);

  useEffect(() => {
    getTransactions()
      .then((res) => setTxns(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const statusTone = (s?: string) => {
    const v = (s || "").toLowerCase();
    if (v.includes("success") || v.includes("complete"))
      return "bg-green-600/10 text-green-600";
    if (v.includes("pending")) return "bg-amber-100 text-amber-600";
    if (v.includes("fail")) return "bg-red-500/10 text-red-500";
    return "bg-[#eef4fb] text-blacky-light/60";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-blacky-light">
          Transactions
        </h1>
        <p className="text-sm text-blacky-light/55">
          All wallet top-ups and lead purchases.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/70" />
          ))}
        </div>
      ) : txns.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-light">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
            <FaReceipt />
          </span>
          <p className="text-lg font-bold text-blacky-light">
            No transactions yet
          </p>
          <p className="mt-1 text-sm text-blacky-light/60">
            Your top-ups and purchases will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-light">
          {/* desktop table */}
          <table className="hidden w-full text-left text-sm sm:table">
            <thead className="bg-[#f4f8fd] text-xs uppercase tracking-wide text-blacky-light/50">
              <tr>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {txns.map((t) => {
                const credit = (t.type || "").toLowerCase().includes("credit");
                return (
                  <tr key={t._id}>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          credit ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {credit ? <FaArrowDown /> : <FaArrowUp />}
                        {credit ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-blacky-light/70">
                      {t.description || t.transactionId || "—"}
                    </td>
                    <td className="px-5 py-3 text-blacky-light/60">
                      {fdate(t.timestamp)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(
                          t.status
                        )}`}
                      >
                        {t.status || "—"}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-bold ${
                        credit ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {credit ? "+" : "−"}
                      {money(t.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* mobile cards */}
          <div className="divide-y divide-gray-100 sm:hidden">
            {txns.map((t) => {
              const credit = (t.type || "").toLowerCase().includes("credit");
              return (
                <div key={t._id} className="flex items-center gap-3 p-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      credit ? "bg-green-600/10 text-green-600" : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {credit ? <FaArrowDown /> : <FaArrowUp />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-blacky-light">
                      {t.description || (credit ? "Credit" : "Debit")}
                    </p>
                    <p className="text-xs text-blacky-light/50">
                      {fdate(t.timestamp)}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${credit ? "text-green-600" : "text-red-500"}`}
                  >
                    {credit ? "+" : "−"}
                    {money(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
