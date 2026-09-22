"use client";

// School Portal login. Schools sign in with email + password (role must be
// "school-admin"). Includes an inline forgot-password flow (email -> OTP ->
// new password) using the same backend the panel already exposes.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  login,
  saveSession,
  SCHOOL_ROLE,
  forgotOtp,
  forgotSession,
  resetPassword,
} from "@/api/school-panel/client";
import {
  FaGraduationCap,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaBuildingColumns,
  FaBullseye,
  FaWallet,
  FaChartLine,
} from "react-icons/fa6";

const PERKS = [
  { icon: FaBullseye, text: "See & buy real parent admission leads" },
  { icon: FaChartLine, text: "Track enquiries and conversions" },
  { icon: FaWallet, text: "Manage your wallet & transactions" },
  { icon: FaBuildingColumns, text: "Keep your school profile up to date" },
];

export default function SchoolLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  // forgot flow: "off" | "email" | "otp" | "reset"
  const [fp, setFp] = useState<"off" | "email" | "otp" | "reset">("off");
  const [fpOtp, setFpOtp] = useState("");
  const [fpToken, setFpToken] = useState("");
  const [fpPass, setFpPass] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mail || !password) return toast.error("Enter email and password");
    setLoading(true);
    const res = await login(mail.trim(), password);
    setLoading(false);
    if (res.error || !res.data?.access_token) {
      return toast.error(res.error?.message || "Invalid email or password");
    }
    if (res.data.role !== SCHOOL_ROLE) {
      return toast.error("This login is for schools only.");
    }
    saveSession(res.data.access_token, res.data.role, mail.split("@")[0]);
    toast.success("Welcome back!");
    router.replace("/school-portal/dashboard");
  };

  const sendOtp = async () => {
    if (!mail) return toast.error("Enter your account email first");
    setLoading(true);
    const res = await forgotOtp(mail.trim());
    setLoading(false);
    if (res.error) return toast.error(res.error.message || "Couldn't send OTP");
    toast.success("OTP sent to your email");
    setFp("otp");
  };
  const verifyOtp = async () => {
    setLoading(true);
    const res = await forgotSession(mail.trim(), fpOtp.trim());
    setLoading(false);
    if (res.error || !res.data?.token)
      return toast.error(res.error?.message || "Invalid OTP");
    setFpToken(res.data.token);
    setFp("reset");
  };
  const doReset = async () => {
    if (fpPass.length < 6) return toast.error("Password must be 6+ characters");
    setLoading(true);
    const res = await resetPassword(fpToken, fpPass);
    setLoading(false);
    if (res.error) return toast.error(res.error.message || "Couldn't reset");
    toast.success("Password updated — please sign in");
    setFp("off");
    setPassword("");
  };

  const input =
    "h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10";
  const icon =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa0c4]";

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
      {/* ===================== LEFT (brand) ===================== */}
      <div className="relative hidden overflow-hidden bg-[#0b1f45] p-12 lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-green-600/25 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-2">
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

        <div className="relative my-auto max-w-md">
          <h1 className="text-3xl font-extrabold leading-tight text-white">
            Grow your admissions with{" "}
            <span className="text-gold">verified parent leads.</span>
          </h1>
          <p className="mt-3 text-sm text-white/70">
            Sign in to your school dashboard to view enquiries, buy leads and
            manage your listing — all in one place.
          </p>
          <ul className="mt-8 space-y-3">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold">
                  <p.icon />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===================== RIGHT (form) ===================== */}
      <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef4fb] via-[#eaf1fb] to-[#dbe6f7] p-6">
        {/* soft decorative shapes so the panel isn't empty */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1e4fa3]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute right-12 top-16 hidden h-16 w-16 rotate-12 rounded-2xl border border-[#1e4fa3]/15 lg:block" />
        <div className="pointer-events-none absolute bottom-20 left-16 hidden h-10 w-10 rounded-full border border-gold/30 lg:block" />

        <div className="relative w-full max-w-md rounded-3xl border-t-4 border-[#1e4fa3] bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,35,70,0.4)] ring-1 ring-black/5 sm:p-9">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e4fa3]/10 text-[#1e4fa3]">
              <FaBuildingColumns />
            </span>
            <div>
              <p className="text-xl font-extrabold text-blacky-light">
                {fp === "off" ? "School Login" : "Reset Password"}
              </p>
              <p className="text-xs text-blacky-light/55">
                {fp === "off"
                  ? "Sign in to your school dashboard"
                  : "We'll email you a one-time code"}
              </p>
            </div>
          </div>

          {fp === "off" && (
            <form onSubmit={onLogin} className="flex flex-col gap-4">
              <div className="relative">
                <FaEnvelope className={icon} />
                <input
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="School email"
                  type="email"
                  className={input}
                />
              </div>
              <div className="relative">
                <FaLock className={icon} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className={input}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setFp("email")}
                  className="text-xs font-semibold text-[#1e4fa3] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <FaArrowRight className="text-[11px]" />}
              </button>
            </form>
          )}

          {fp === "email" && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaEnvelope className={icon} />
                <input
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Your account email"
                  type="email"
                  className={input}
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1e4fa3] text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
              <BackToLogin onClick={() => setFp("off")} />
            </div>
          )}

          {fp === "otp" && (
            <div className="flex flex-col gap-4">
              <input
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                inputMode="numeric"
                className="h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-4 text-center text-lg font-bold tracking-[0.3em] text-blacky-light outline-none focus:border-green-500"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1e4fa3] text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <BackToLogin onClick={() => setFp("off")} />
            </div>
          )}

          {fp === "reset" && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaLock className={icon} />
                <input
                  value={fpPass}
                  onChange={(e) => setFpPass(e.target.value)}
                  placeholder="New password"
                  type="password"
                  className={input}
                />
              </div>
              <button
                onClick={doReset}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Update Password"}
              </button>
              <BackToLogin onClick={() => setFp("off")} />
            </div>
          )}

          <p className="mt-6 text-center text-xs text-blacky-light/50">
            Not registered yet?{" "}
            <Link
              href="/register-school"
              className="font-semibold text-[#1e4fa3] hover:underline"
            >
              Register your school
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const BackToLogin = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-center text-xs font-semibold text-blacky-light/50 hover:text-blacky-light"
  >
    ← Back to login
  </button>
);
