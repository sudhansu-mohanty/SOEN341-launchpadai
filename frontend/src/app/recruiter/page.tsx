"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type JobRow = {
  id: string;
  title: string;
  location: string | null;
  created_at: string;
  applications: { count: number }[];
};

type Applicant = {
  id: string;
  seeker_id: string;
  status: string;
  resume_path: string | null;
  cover_note: string | null;
  created_at: string;
  name: string;
};

function statusLabel(status: string) {
  const text = status.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function badgeClass(status: string) {
  const s = status.toLowerCase().replace(/[\s_-]/g, "");
  if (s === "underreview") return "bg-yellow-500/15 text-yellow-300";
  if (s === "interview") return "bg-blue-500/15 text-blue-300";
  if (s === "offered") return "bg-green-500/15 text-green-300";
  if (s === "rejected") return "bg-red-500/15 text-red-300";
  return "bg-white/10 text-zinc-300";
}

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location, created_at, applications(count)")
        .eq("posted_by", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setJobs((data as unknown as JobRow[]) ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedJob(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function openApplicants(job: JobRow) {
    setSelectedJob(job);
    setApplicants([]);
    setModalError("");
    setModalLoading(true);

    const { data, error } = await supabase
      .from("applications")
      .select("id, seeker_id, status, resume_path, cover_note, created_at")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false });

    if (error) {
      setModalError(error.message);
      setModalLoading(false);
      return;
    }

    const rows = (data ?? []) as Omit<Applicant, "name">[];
    const names: Record<string, string> = {};

    if (rows.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", rows.map((r) => r.seeker_id));
      ((profiles ?? []) as { id: string; full_name: string | null }[]).forEach(
        (p) => {
          if (p.full_name) names[p.id] = p.full_name;
        }
      );
    }

    setApplicants(
      rows.map((r) => ({
        ...r,
        name: names[r.seeker_id] ?? `Applicant ${r.seeker_id.slice(0, 8)}`,
      }))
    );
    setModalLoading(false);
  }

  async function viewResume(path: string) {
    setModalError("");
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(path, 60);
    if (error || !data) {
      setModalError(error?.message ?? "Could not open the resume.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 pt-28">
        <h1 className="text-2xl font-bold tracking-tight">My Postings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your job postings and how many people applied to each.
        </p>

        <div className="mt-8 rounded-2xl border border-white/[0.08] p-1">
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black">
            {loading ? (
              <p className="p-8 text-zinc-500">Loading...</p>
            ) : error ? (
              <p className="p-8 text-red-400">Error: {error}</p>
            ) : jobs.length === 0 ? (
              <p className="p-8 text-zinc-500">You have no postings yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Posted</th>
                    <th className="p-4 font-medium">Applicants</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-white/5">
                      <td className="p-4">{job.title}</td>
                      <td className="p-4 text-zinc-400">{job.location ?? "-"}</td>
                      <td className="p-4 text-zinc-400">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">{job.applications?.[0]?.count ?? 0}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openApplicants(job)}
                          className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          View applicants
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selectedJob && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Applicants</h2>
                <p className="mt-1 text-sm text-zinc-500">{selectedJob.title}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {modalError && (
              <p className="mt-4 text-sm text-red-400">Error: {modalError}</p>
            )}

            <div className="mt-6 space-y-3">
              {modalLoading ? (
                <p className="text-zinc-500">Loading...</p>
              ) : applicants.length === 0 && !modalError ? (
                <p className="text-zinc-500">No applicants yet.</p>
              ) : (
                applicants.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-white/5 bg-black p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-zinc-500">
                          Applied {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(
                          a.status
                        )}`}
                      >
                        {statusLabel(a.status)}
                      </span>
                    </div>
                    {a.cover_note && (
                      <p className="mt-3 text-sm text-zinc-400">{a.cover_note}</p>
                    )}
                    <div className="mt-3">
                      {a.resume_path ? (
                        <button
                          onClick={() => viewResume(a.resume_path as string)}
                          className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200"
                        >
                          View resume
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-600">No resume</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}