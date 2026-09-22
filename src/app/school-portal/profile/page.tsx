"use client";

// Profile — the school account details. Loads GET /user/profile and lets the
// owner update their name and phone (PUT /user/profile).

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getProfile,
  updateProfile,
  ISchoolProfile,
} from "@/api/school-panel/client";
import {
  FaUserGear,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFloppyDisk,
} from "react-icons/fa6";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ISchoolProfile | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => {
        const p = res.data;
        if (p) {
          setProfile(p);
          setName(p.name || "");
          setPhoneNumber(p.phoneNumber || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await updateProfile({ name, phoneNumber });
    setSaving(false);
    if (res.error) return toast.error(res.error.message || "Couldn't save");
    toast.success("Profile updated");
  };

  const email = profile?.email || profile?.mail || "";

  const input =
    "h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10";
  const icon =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa0c4]";

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-white/70" />
        <div className="h-80 animate-pulse rounded-2xl bg-white/70" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-blacky-light">Profile</h1>
        <p className="text-sm text-blacky-light/55">
          Manage your school account details.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-light sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#173e82] to-green-600 text-2xl text-white">
            <FaUserGear />
          </span>
          <div>
            <p className="text-lg font-extrabold text-blacky-light">
              {name || "Your School"}
            </p>
            <p className="text-sm text-blacky-light/55">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5d6b82]">
              Name
            </label>
            <div className="relative">
              <FaUser className={icon} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className={input}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5d6b82]">
              Email (read-only)
            </label>
            <div className="relative">
              <FaEnvelope className={icon} />
              <input
                value={email}
                disabled
                className={`${input} cursor-not-allowed opacity-70`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#5d6b82]">
              Phone
            </label>
            <div className="relative">
              <FaPhone className={icon} />
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className={input}
              />
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            <FaFloppyDisk /> {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
