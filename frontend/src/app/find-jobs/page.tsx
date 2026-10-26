"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobDetailPanel from "@/components/JobDetailPanel";
import JobFilters from "@/components/JobFilters";
import SavedJobsDrawer from "@/components/SavedJobsDrawer";
import type { Job } from "@/types";
import { DEFAULT_FILTERS, SAMPLE_JOBS, fetchExternalJobs, filterJobs, getLocations } from "@/lib/jobs";
import { supabase } from "@/lib/supabase";

type DbJob = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  workplace_type: Job["workplace_type"];
  posted_by: string;
  created_at: string;
  deadline: string | null;
};

export default function FindJobsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [externalJobs, setExternalJobs] = useState<Job[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState(false);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [saveError, setSaveError] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  // Placeholder: wire to the applications table once Supabase is connected.
  const handleApply = (job: Job) => setAppliedIds((prev) => new Set(prev).add(job.id));
  const closePanel = useCallback(() => setSelectedJob(null), []);
  const closeSaved = useCallback(() => setShowSaved(false), []);

  // Jobs posted by recruiters (Supabase "jobs" table) show under LaunchPadAI.
  useEffect(() => {
    async function loadPostedJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error || !data) {
        console.error("Could not load posted jobs:", error?.message);
        return;
      }
      setPostedJobs(
        (data as DbJob[]).map((row) => ({
          id: row.id,
          title: row.title,
          company: row.company ?? "",
          location: row.location ?? "",
          description: row.description ?? "",
          workplace_type: row.workplace_type,
          posted_by: row.posted_by,
          created_at: row.created_at,
          deadline: row.deadline ?? undefined,
          source: "launchpad" as const,
        }))
      );
    }
    loadPostedJobs();
  }, []);

  // Saved jobs (Supabase "saved_jobs" table) for the logged-in job seeker.
  useEffect(() => {
    async function loadSavedJobs() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job")
        .order("created_at", { ascending: false });
      if (error || !data) {
        console.error("Could not load saved jobs:", error?.message);
        return;
      }
      setSavedJobs((data as { job: Job }[]).map((row) => row.job));
    }
    loadSavedJobs();
  }, []);

  const savedIds = useMemo(() => new Set(savedJobs.map((j) => j.id)), [savedJobs]);

  async function toggleSave(job: Job) {
    setSaveError("");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setSaveError("Log in to save jobs.");
      return;
    }

    const wasSaved = savedIds.has(job.id);
    const previous = savedJobs;

    // Update the screen right away, undo it if Supabase refuses.
    setSavedJobs(wasSaved ? previous.filter((j) => j.id !== job.id) : [job, ...previous]);

    const { error } = wasSaved
      ? await supabase.from("saved_jobs").delete().eq("job_id", job.id)
      : await supabase.from("saved_jobs").insert({ job_id: job.id, job });

    if (error) {
      setSavedJobs(previous);
      setSaveError(error.message);
    }
  }

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

  const launchpadJobs = useMemo(() => [...postedJobs, ...SAMPLE_JOBS], [postedJobs]);

  const allJobs = useMemo(
    () => (filters.source === "launchpad" ? launchpadJobs : [...launchpadJobs, ...externalJobs]),
    [launchpadJobs, externalJobs, filters.source]
  );

  const locations = useMemo(() => getLocations(allJobs), [allJobs]);
  const jobs = useMemo(() => filterJobs(allJobs, filters), [allJobs, filters]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-5 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Find Jobs</h1>
            <p className="mt-2 text-sm tracking-tight text-zinc-500">
              Search open positions and narrow them down by location, salary and workplace type.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSaved(true)}
            className="flex shrink-0 items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bookmark className="h-4 w-4" />
            Saved jobs ({savedJobs.length})
          </button>
        </div>

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
          {saveError && <p className="text-xs tracking-tight text-red-400">{saveError}</p>}
        </div>

        {jobs.length > 0 ? (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedIds.has(job.id)}
                selected={selectedJob?.id === job.id}
                saved={savedIds.has(job.id)}
                onSelect={setSelectedJob}
                onApply={handleApply}
                onToggleSave={toggleSave}
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

      <SavedJobsDrawer
        open={showSaved}
        jobs={savedJobs}
        appliedIds={appliedIds}
        onClose={closeSaved}
        onApply={handleApply}
        onRemove={toggleSave}
      />
    </main>
  );
}