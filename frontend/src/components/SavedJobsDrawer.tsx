"use client";

import { useEffect } from "react";
import { Bookmark, Building2, DollarSign, MapPin, X } from "lucide-react";
import type { Job } from "@/types";
import { formatSalary, getDeadlineStatus, truncate } from "@/lib/jobs";

type SavedJobsDrawerProps = {
  open: boolean;
  jobs: Job[];
  appliedIds: Set<string>;
  onClose: () => void;
  onApply: (job: Job) => void;
  onRemove: (job: Job) => void;
};

export default function SavedJobsDrawer({
  open,
  jobs,
  appliedIds,
  onClose,
  onApply,
  onRemove,
}: SavedJobsDrawerProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/60" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        aria-label="Saved jobs"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-[80] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 transition-transform duration-300 ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Bookmark className="h-4 w-4" />
              Saved jobs ({jobs.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Review them together and apply later.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved jobs"
            className="rounded-md p-1 text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {jobs.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No saved jobs yet. Click the bookmark on a job to save it.
            </p>
          ) : (
            jobs.map((job) => {
              const applied = appliedIds.has(job.id);
              const deadline = getDeadlineStatus(job.deadline);
              return (
                <div key={job.id} className="rounded-xl border border-white/[0.08] bg-black p-4">
                  <h3 className="font-semibold tracking-tight">{job.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.company}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <DollarSign className="h-3.5 w-3.5" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{truncate(job.description, 140)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={applied || deadline.closed}
                      onClick={() => {
                        if (job.source === "external" && job.apply_url) {
                          window.open(job.apply_url, "_blank", "noopener,noreferrer");
                          return;
                        }
                        onApply(job);
                      }}
                      className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-black hover:bg-zinc-200 disabled:cursor-default disabled:bg-white/10 disabled:text-zinc-400"
                    >
                      {applied ? "Applied" : deadline.closed ? "Closed" : "Apply Now"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(job)}
                      className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}