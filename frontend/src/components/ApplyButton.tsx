"use client";

import { useEffect, useState } from "react";
import ApplyModal from "./ApplyModal";
import { useToast } from "@/context/ToastContext";
import type { ApplyApi } from "@/lib/applications";

type Props = {
  jobId: string;
  jobTitle: string;
  alreadyApplied?: boolean; // from Othmane's "jobs this seeker applied to" query
  onViewTracker: () => void; // e.g. () => router.push("/dashboard/applications")
  api?: ApplyApi; // dev page / tests only
};

// Usage in the job detail view (and job cards):
//   <ApplyButton jobId={job.id} jobTitle={job.title} alreadyApplied={job.hasApplied}
//                onViewTracker={() => router.push("/dashboard/applications")} />
export default function ApplyButton({ jobId, jobTitle, alreadyApplied = false, onViewTracker, api }: Props) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const { showToast } = useToast();

  useEffect(() => setApplied(alreadyApplied), [alreadyApplied]);

  if (applied) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-500"
        >
          Already applied
        </button>
        <button
          type="button"
          onClick={onViewTracker}
          className="text-sm font-medium tracking-tight text-white underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
        >
          View in tracker
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
      >
        Apply
      </button>
      <ApplyModal
        jobId={jobId}
        jobTitle={jobTitle}
        isOpen={open}
        api={api}
        onClose={() => setOpen(false)}
        onAlreadyApplied={() => setApplied(true)}
        onSubmitted={() => {
          setOpen(false);
          setApplied(true);
          showToast({
            kind: "success",
            message: `Your application for ${jobTitle} was sent.`,
            action: { label: "View in tracker", onClick: onViewTracker },
          });
        }}
      />
    </>
  );
}