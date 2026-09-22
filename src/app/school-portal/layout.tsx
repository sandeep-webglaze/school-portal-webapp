"use client";

// ---------------------------------------------------------------------------
// School Portal layout — the dashboard chrome (sidebar + top bar) for every
// /school-portal/* page EXCEPT the login page. It also guards access: if
// there's no school token, it sends the visitor to the login page.
//
// The public site Header/Footer are hidden on these routes (see the guards
// added to ResponsiveHeader and Footer), so the portal feels like its own app
// while living in the same codebase.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn, logout, getSchoolName } from "@/api/school-panel/client";
import {
  FaGaugeHigh,
  FaBullseye,
  FaFolderOpen,
  FaWallet,
  FaReceipt,
  FaUserGear,
  FaRightFromBracket,
  FaBars,
  FaXmark,
  FaGraduationCap,
  FaSchool,
  FaEnvelopeOpenText,
} from "react-icons/fa6";

const NAV = [
  { href: "/school-portal/dashboard", label: "Dashboard", icon: FaGaugeHigh },
  { href: "/school-portal/manage-school", label: "My School", icon: FaSchool },
  { href: "/school-portal/leads", label: "Available Leads", icon: FaBullseye },
  { href: "/school-portal/my-leads", label: "My Leads", icon: FaFolderOpen },
  { href: "/school-portal/enquiries", label: "Enquiries", icon: FaEnvelopeOpenText },
  { href: "/school-portal/wallet", label: "Wallet", icon: FaWallet },
  { href: "/school-portal/transactions", label: "Transactions", icon: FaReceipt },
  { href: "/school-portal/profile", label: "Profile", icon: FaUserGear },
];

export default function SchoolPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/school-portal/login";

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("School");

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isLoggedIn()) {
      router.replace("/school-portal/login");
      return;
    }
    setName(getSchoolName());
    setReady(true);
  }, [isLogin, pathname, router]);

  // Login page: render bare (no sidebar / guard)
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4fb]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600/30 border-t-green-600" />
      </div>
    );
  }

  const onLogout = () => {
    logout();
    router.replace("/school-portal/login");
  };

  const SidebarLinks = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "bg-gradient-to-r from-[#173e82] to-green-600 text-white shadow-[0_10px_25px_-10px_rgba(30,79,163,0.7)]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <n.icon className="text-base" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#eef4fb]">
      {/* ===================== SIDEBAR (desktop) ===================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#0b1f45] p-5 lg:flex">
        <Link href="/school-portal/dashboard" className="mb-8 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
            <FaGraduationCap />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-white">Education Portal</p>
            <p className="text-[10px] uppercase tracking-wide text-gold">
              School Panel
            </p>
          </div>
        </Link>
        {SidebarLinks}
        <button
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-red-500/20 hover:text-white"
        >
          <FaRightFromBracket /> Logout
        </button>
      </aside>

      {/* ===================== MOBILE DRAWER ===================== */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#0b1f45] p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white">
                School Panel
              </span>
              <button onClick={() => setOpen(false)} className="text-white/70">
                <FaXmark />
              </button>
            </div>
            {SidebarLinks}
            <button
              onClick={onLogout}
              className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-red-500/20 hover:text-white"
            >
              <FaRightFromBracket /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* ===================== MAIN ===================== */}
      <div className="lg:pl-64">
        {/* top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e1e6ee] bg-white/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef4fb] text-[#1e4fa3] lg:hidden"
            >
              <FaBars />
            </button>
            <p className="text-sm font-semibold text-blacky-light">
              Welcome back,{" "}
              <span className="font-extrabold text-[#1e4fa3]">{name}</span>
            </p>
          </div>
          <Link
            href="/school-portal/wallet"
            className="inline-flex items-center gap-2 rounded-full bg-[#eef4fb] px-3.5 py-1.5 text-xs font-bold text-[#1e4fa3] transition hover:bg-[#e2ecfb]"
          >
            <FaWallet /> My Wallet
          </Link>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
