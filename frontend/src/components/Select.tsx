"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectOption<T extends string | number> = { value: T; label: string };

type SelectProps<T extends string | number> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export default function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className = "",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-3 rounded-lg border bg-black py-2 pr-4 pl-3 text-sm tracking-tight text-zinc-300 outline-none transition-colors hover:border-white/20 ${
          open ? "border-white/30" : "border-white/10"
        }`}
      >
        <span>{current?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 z-30 mt-1 max-h-64 min-w-full overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 py-1 shadow-xl sm:left-auto"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex cursor-pointer items-center justify-between gap-4 px-3 py-1.5 text-sm tracking-tight whitespace-nowrap hover:bg-white/10 ${
                  selected ? "text-white" : "text-zinc-400"
                }`}
              >
                {option.label}
                {selected && <Check className="h-3.5 w-3.5" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
