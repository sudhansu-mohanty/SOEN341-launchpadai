"use client";

import { useEffect } from "react";
import { Building2, Clock, DollarSign, MapPin, X } from "lucide-react";
import type { Job } from "@/types";
import { WORKPLACE_LABELS, formatSalary, getJobDetails } from "@/lib/jobs";

type JobDetailPanelProps = {
  job: Job | null;
  applied: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
};

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">{title}</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm tracking-tight text-zinc-300 marker:text-zinc-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function JobDetailPanel({ job, applied, onClose, onApply }: JobDetailPanelProps) {
  const open = job !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Keep rendering the last job while the panel slides out.
  const details = job ? getJobDetails(job) : null;

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Job details"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {job && details && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">{job.title}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm tracking-tight text-zinc-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm tracking-tight text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[WORKPLACE_LABELS[job.workplace_type], details.employmentType, details.experience].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium tracking-tight text-zinc-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <section className="mt-6">
                <h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">About the role</h3>
                <p className="mt-2 text-sm leading-relaxed tracking-tight text-zinc-300">{details.about}</p>
              </section>

              <Section title="Responsibilities" items={details.responsibilities} />
              <Section title="Requirements" items={details.requirements} />
              <Section title="Benefits" items={details.benefits} />
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <button
                type="button"
                disabled={applied}
                onClick={() => onApply(job)}
                className="w-full rounded-full bg-white py-2.5 text-sm font-semibold tracking-tight text-black transition-colors hover:bg-zinc-200 disabled:cursor-default disabled:bg-white/10 disabled:text-zinc-400"
              >
                {applied ? "Applied" : "Apply now"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
