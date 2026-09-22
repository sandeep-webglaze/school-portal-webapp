"use client";

// Manage School — the school edits its OWN listing. We load the linked school
// (from the profile's school id -> GET /school/:id), let the owner edit the
// key text/number fields, and save via PUT /school sending the full flattened
// body so nothing else is lost. Complex fields (curriculum, facilities,
// images) are shown read-only here and managed from the admin panel.

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getProfile,
  getSchoolById,
  updateSchool,
  flattenSchool,
  ISchoolFull,
} from "@/api/school-panel/client";
import {
  FaSchool,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUserTie,
  FaMoneyBillWave,
  FaLayerGroup,
  FaLocationDot,
  FaFloppyDisk,
  FaCircleInfo,
  FaBuildingColumns,
} from "react-icons/fa6";

type Form = {
  about: string;
  contactNumber: string;
  mail: string;
  website: string;
  chairman: string;
  medium: string;
  minFees: string;
  maxFees: string;
  classFrom: string;
  classTo: string;
  admissionStart: string;
  admissionEnd: string;
};

const emptyForm: Form = {
  about: "",
  contactNumber: "",
  mail: "",
  website: "",
  chairman: "",
  medium: "",
  minFees: "",
  maxFees: "",
  classFrom: "",
  classTo: "",
  admissionStart: "",
  admissionEnd: "",
};

export default function ManageSchoolPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [school, setSchool] = useState<ISchoolFull | null>(null);
  const [noSchool, setNoSchool] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);

  useEffect(() => {
    (async () => {
      const prof = await getProfile();
      const schoolId = prof.data?.school as string | undefined;
      if (!schoolId) {
        setNoSchool(true);
        setLoading(false);
        return;
      }
      const res = await getSchoolById(schoolId);
      const s = res.data;
      if (!s) {
        setNoSchool(true);
        setLoading(false);
        return;
      }
      setSchool(s);
      setForm({
        about: s.about || "",
        contactNumber: s.contactNumber || "",
        mail: s.mail || "",
        website: s.website || "",
        chairman: s.chairman || "",
        medium: s.medium || "",
        minFees: s.minFees != null ? String(s.minFees) : "",
        maxFees: s.maxFees != null ? String(s.maxFees) : "",
        classFrom: s.classFrom || "",
        classTo: s.classTo || "",
        admissionStart: s.admissionStart || "",
        admissionEnd: s.admissionEnd || "",
      });
      setLoading(false);
    })();
  }, []);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!school) return;
    setSaving(true);
    const body = flattenSchool(school);
    // apply edited fields on top of the full flattened body
    Object.assign(body, {
      about: form.about,
      contactNumber: form.contactNumber,
      mail: form.mail,
      website: form.website,
      chairman: form.chairman,
      medium: form.medium,
      minFees: Number(form.minFees) || 0,
      maxFees: Number(form.maxFees) || 0,
      classFrom: form.classFrom,
      classTo: form.classTo,
      admissionStart: form.admissionStart,
      admissionEnd: form.admissionEnd,
    });
    const res = await updateSchool(body);
    setSaving(false);
    if (res.error) return toast.error(res.error.message || "Couldn't save");
    toast.success("School details updated");
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/70" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/70" />
      </div>
    );

  if (noSchool)
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-light">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
          <FaSchool />
        </span>
        <p className="text-lg font-bold text-blacky-light">
          No school linked to your account
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
          Your login isn&apos;t linked to a school yet. Please contact the
          Education Portal team to link your school.
        </p>
      </div>
    );

  const input =
    "h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10";
  const label = "mb-1 block text-xs font-semibold text-[#5d6b82]";

  const chips = (arr?: { _id: string; name?: string }[]) =>
    (arr ?? []).map((x) => (
      <span
        key={x._id}
        className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-blacky-light/70"
      >
        {x.name}
      </span>
    ));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-blacky-light">
            {school?.name || "My School"}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-blacky-light/55">
            <FaLocationDot className="text-green-500" />
            {school?.city?.city || "—"}
            {school?.published ? (
              <span className="ml-2 rounded-full bg-green-600/10 px-2 py-0.5 text-[10px] font-bold text-green-600">
                Published
              </span>
            ) : (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                Not published
              </span>
            )}
          </p>
        </div>
        {school?.slug && (
          <Link
            href={`/school/${
              typeof school.slug === "string" ? school.slug : school.slug?.slug
            }`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
          >
            View public page
          </Link>
        )}
      </div>

      {/* editable form */}
      <div className="rounded-2xl bg-white p-6 shadow-light sm:p-8">
        <p className="mb-5 flex items-center gap-2 font-bold text-blacky-light">
          <FaBuildingColumns className="text-green-600" /> Edit details
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Chairman / Principal" icon={FaUserTie} value={form.chairman} onChange={(v) => set("chairman", v)} labelCls={label} inputCls={input} />
          <Field label="Medium" icon={FaLayerGroup} value={form.medium} onChange={(v) => set("medium", v)} labelCls={label} inputCls={input} placeholder="e.g. English" />
          <Field label="Contact number" icon={FaPhone} value={form.contactNumber} onChange={(v) => set("contactNumber", v)} labelCls={label} inputCls={input} />
          <Field label="Email" icon={FaEnvelope} value={form.mail} onChange={(v) => set("mail", v)} labelCls={label} inputCls={input} />
          <Field label="Website" icon={FaGlobe} value={form.website} onChange={(v) => set("website", v)} labelCls={label} inputCls={input} placeholder="https://" />
          <div />
          <Field label="Min fees (AED)" icon={FaMoneyBillWave} value={form.minFees} onChange={(v) => set("minFees", v)} labelCls={label} inputCls={input} type="number" />
          <Field label="Max fees (AED)" icon={FaMoneyBillWave} value={form.maxFees} onChange={(v) => set("maxFees", v)} labelCls={label} inputCls={input} type="number" />
          <Field label="Class from" value={form.classFrom} onChange={(v) => set("classFrom", v)} labelCls={label} inputCls={input} />
          <Field label="Class to" value={form.classTo} onChange={(v) => set("classTo", v)} labelCls={label} inputCls={input} />
          <Field label="Admission start" value={form.admissionStart} onChange={(v) => set("admissionStart", v)} labelCls={label} inputCls={input} placeholder="e.g. April" />
          <Field label="Admission end" value={form.admissionEnd} onChange={(v) => set("admissionEnd", v)} labelCls={label} inputCls={input} placeholder="e.g. June" />
        </div>

        <div className="mt-4">
          <label className={label}>About the school</label>
          <textarea
            rows={4}
            value={form.about}
            onChange={(e) => set("about", e.target.value)}
            placeholder="Tell parents about your school…"
            className="w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-4 py-3 text-sm text-blacky-light outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-8 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
        >
          <FaFloppyDisk /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* read-only complex fields */}
      <div className="rounded-2xl bg-white p-6 shadow-light">
        <p className="flex items-start gap-2 text-xs text-blacky-light/55">
          <FaCircleInfo className="mt-0.5 shrink-0 text-[#1e4fa3]" />
          Curriculum, school type, facilities and photos are managed by the
          Education Portal team. Contact them to update these.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadRow label="Curriculum / Boards">{chips(school?.schoolBoards)}</ReadRow>
          <ReadRow label="School type">{chips(school?.type)}</ReadRow>
          <ReadRow label="Facilities">{chips(school?.facilities)}</ReadRow>
          <ReadRow label="Classification">
            {school?.classification?.name ? (
              <span className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-blacky-light/70">
                {school.classification.name}
              </span>
            ) : (
              <span className="text-xs text-blacky-light/40">—</span>
            )}
          </ReadRow>
        </div>
        {!!school?.images?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {school.images.slice(0, 6).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-16 w-24 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Field = ({
  label,
  icon: Icon,
  value,
  onChange,
  labelCls,
  inputCls,
  type = "text",
  placeholder,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  labelCls: string;
  inputCls: string;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa0c4]" />
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={Icon ? inputCls.replace("px-4", "pl-11 pr-4") : inputCls}
      />
    </div>
  </div>
);

const ReadRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="mb-1.5 text-xs font-semibold text-[#5d6b82]">{label}</p>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);
