"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobDetailPanel from "@/components/JobDetailPanel";
import JobFilters from "@/components/JobFilters";
import type { Job } from "@/types";
import { DEFAULT_FILTERS, SAMPLE_JOBS, fetchExternalJobs, filterJobs, getLocations } from "@/lib/jobs";

export default function FindJobsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [externalJobs, setExternalJobs] = useState<Job[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState(false);

  // Placeholder: wire to the applications table once Supabase is connected.
  const handleApply = (job: Job) => setAppliedIds((prev) => new Set(prev).add(job.id));
  const closePanel = useCallback(() => setSelectedJob(null), []);

  // Debounced fetch of live SerpAPI results; skipped entirely when the user
  // has filtered down to launchpad-only jobs, so we don't burn SerpAPI quota.
  useEffect(() => {
    if (filters.source === "launchpad") return;

    let cancelled = false;
    setExternalLoading(true);

    const timeout = setTimeout(async () => {
      const query = filters.search.trim() || "software developer jobs";
      const location = filters.location || "Canada";
      const result = await fetchExternalJobs(query, location);
      if (cancelled) return;
      setExternalLoading(false);
      if (result === null) {
        setExternalError(true);
      } else {
        setExternalError(false);
        setExternalJobs(result);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [filters.search, filters.location, filters.source]);

  const allJobs = useMemo(
    () => (filters.source === "launchpad" ? SAMPLE_JOBS : [...SAMPLE_JOBS, ...externalJobs]),
    [externalJobs, filters.source]
  );

  const locations = useMemo(() => getLocations(allJobs), [allJobs]);
  const jobs = useMemo(() => filterJobs(allJobs, filters), [allJobs, filters]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-5 pt-24 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-white">Find Jobs</h1>
        <p className="mt-2 text-sm tracking-tight text-zinc-500">
          Search open positions and narrow them down by location, salary and workplace type.
        </p>

        <div className="mt-8">
          <JobFilters filters={filters} locations={locations} onChange={setFilters} />
        </div>

        <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </p>
          {externalLoading && (
            <p className="text-xs tracking-tight text-zinc-500">Loading external listings…</p>
          )}
          {externalError && !externalLoading && (
            <p className="text-xs tracking-tight text-zinc-500">
              Couldn&apos;t load external listings right now.
            </p>
          )}
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedIds.has(job.id)}
                selected={selectedJob?.id === job.id}
                onSelect={setSelectedJob}
                onApply={handleApply}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <Briefcase className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-sm tracking-tight text-zinc-300">No jobs match your filters.</p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-2 text-sm tracking-tight text-zinc-500 underline hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <JobDetailPanel
        job={selectedJob}
        applied={selectedJob ? appliedIds.has(selectedJob.id) : false}
        onClose={closePanel}
        onApply={handleApply}
      />
    </main>
  );
}
