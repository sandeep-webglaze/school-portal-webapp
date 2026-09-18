"use client";
import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { FaChevronDown, FaCheck } from "react-icons/fa6";

interface PickerProps {
  icon?: IconType;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

// Custom dropdown "picker" — styled panel instead of the native <select>,
// so it matches the modern search-card design. Closes on outside click.
export const Picker = ({
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Select",
}: PickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3.5 text-left text-[13px] transition ${
          open
            ? "border-[#17458f] bg-white ring-4 ring-[#17458f]/10"
            : "border-[#e1e6ee] bg-[#f6f8fc] hover:border-[#c7d3e6]"
        }`}
      >
        {Icon && <Icon className="shrink-0 text-[12px] text-[#8aa0c4]" />}
        <span
          className={`flex-1 truncate ${
            value ? "font-medium text-[#132d57]" : "text-[#9aa6ba]"
          }`}
        >
          {value || placeholder}
        </span>
        <FaChevronDown
          className={`shrink-0 text-[10px] text-[#8aa0c4] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded-xl border border-[#e6ecf5] bg-white p-1.5 shadow-[0_18px_45px_-12px_rgba(15,35,70,0.28)]">
          <button
            type="button"
            onClick={() => pick("")}
            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[13px] text-[#9aa6ba] transition hover:bg-[#f1f5fb]"
          >
            {placeholder}
          </button>
          {options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => pick(opt)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition ${
                  active
                    ? "bg-[#17458f] text-white"
                    : "text-[#263b5f] hover:bg-[#f1f5fb]"
                }`}
              >
                {opt}
                {active && <FaCheck className="text-[11px]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Picker;
