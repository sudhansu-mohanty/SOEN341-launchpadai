import { Building2, DollarSign, MapPin } from "lucide-react";
import type { Job } from "@/types";
import { WORKPLACE_LABELS, formatSalary } from "@/lib/jobs";

type JobCardProps = {
  job: Job;
  applied: boolean;
  selected: boolean;
  onSelect: (job: Job) => void;
  onApply: (job: Job) => void;
};

export default function JobCard({ job, applied, selected, onSelect, onApply }: JobCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(job);
        }
      }}
      className={`cursor-pointer rounded-xl border px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/[0.04] ${
        selected ? "border-white/25 bg-white/[0.05]" : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">{job.title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm tracking-tight text-zinc-400">
            <Building2 className="h-3.5 w-3.5" />
            {job.company}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium tracking-tight text-zinc-300">
          {WORKPLACE_LABELS[job.workplace_type]}
        </span>
      </div>

      <p className="mt-3 text-sm tracking-tight text-zinc-500">{job.description}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-tight text-zinc-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
        <button
          type="button"
          disabled={applied}
          onClick={(e) => {
            e.stopPropagation();
            onApply(job);
          }}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-tight text-black transition-colors hover:bg-zinc-200 disabled:cursor-default disabled:bg-white/10 disabled:text-zinc-400"
        >
          {applied ? "Applied" : "Apply now"}
        </button>
      </div>
    </article>
  );
}
