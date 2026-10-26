"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { statusLabel, badgeClass } from "@/lib/applicationStatus";

type JobRow = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  workplace_type: string | null;
  description: string | null;
  deadline: string | null;
  status: "open" | "closed";
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

const WORKPLACE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "in_person", label: "In person" },
];

// Must match the database enum application_status exactly.
const STATUS_OPTIONS = ["Applied", "Under Review", "Interview", "Offered", "Rejected"];

const emptyForm = {
  title: "",
  company: "",
  location: "",
  workplace_type: "",
  description: "",
  deadline: "",
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/30 [color-scheme:dark]";

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const loadJobs = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, title, company, location, workplace_type, description, deadline, status, created_at, applications(count)"
      )
      .eq("posted_by", uid)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else {
      setError("");
      setJobs((data as unknown as JobRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.user_metadata?.role !== "recruiter") {
        router.push("/");
        return;
      }
      setUserId(user.id);
      await loadJobs(user.id);
    }
    init();
  }, [router, loadJobs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedJob(null);
        setShowCreate(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowCreate(true);
  }

  function openEdit(job: JobRow) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company ?? "",
      location: job.location ?? "",
      workplace_type: job.workplace_type ?? "",
      description: job.description ?? "",
      deadline: job.deadline ? new Date(job.deadline).toLocaleDateString("en-CA") : "",
    });
    setFormError("");
    setShowCreate(true);
  }

  async function saveJob() {
    setFormError("");

    const missing: string[] = [];
    if (!form.title.trim()) missing.push("title");
    if (!form.company.trim()) missing.push("company");
    if (!form.location.trim()) missing.push("location");
    if (!form.workplace_type) missing.push("job type");
    if (!form.description.trim()) missing.push("description");
    if (missing.length > 0) {
      setFormError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }
    if (!userId) return;

    const values = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      workplace_type: form.workplace_type,
      description: form.description.trim(),
      deadline: form.deadline
        ? new Date(`${form.deadline}T23:59:59`).toISOString()
        : null,
    };

    setSaving(true);
    if (editingId) {
      const { data, error } = await supabase
        .from("jobs")
        .update(values)
        .eq("id", editingId)
        .select("id");
      setSaving(false);
      if (error) {
        setFormError(error.message);
        return;
      }
      if (!data || data.length === 0) {
        setFormError("Update was blocked (no permission to edit this job).");
        return;
      }
    } else {
      const { error } = await supabase
        .from("jobs")
        .insert({ ...values, posted_by: userId });
      setSaving(false);
      if (error) {
        setFormError(error.message);
        return;
      }
    }

    setShowCreate(false);
    setEditingId(null);
    setForm(emptyForm);
    await loadJobs(userId);
  }

  async function toggleStatus(job: JobRow) {
    if (!userId) return;
    setError("");
    const next = job.status === "open" ? "closed" : "open";
    const { data, error } = await supabase
      .from("jobs")
      .update({ status: next })
      .eq("id", job.id)
      .select("id");
    if (error) {
      setError(error.message);
      return;
    }
    if (!data || data.length === 0) {
      setError("Update was blocked (no permission to change this job).");
      return;
    }
    await loadJobs(userId);
  }

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

  async function updateApplicantStatus(applicant: Applicant, next: string) {
    if (next === applicant.status) return;
    setModalError("");
    const previous = applicants;

    // Show the new status right away, undo it if the database refuses.
    setApplicants((list) =>
      list.map((a) => (a.id === applicant.id ? { ...a, status: next } : a))
    );

    const { data, error } = await supabase
      .from("applications")
      .update({ status: next })
      .eq("id", applicant.id)
      .select("id");

    if (error || !data || data.length === 0) {
      setApplicants(previous);
      setModalError(
        error?.message ?? "Update was blocked (no permission to change this application)."
      );
    }
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Postings</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Your job postings and how many people applied to each.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Create posting
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.08] p-1">
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black">
            {loading ? (
              <p className="p-8 text-zinc-500">Loading...</p>
            ) : error && jobs.length === 0 ? (
              <p className="p-8 text-red-400">Error: {error}</p>
            ) : jobs.length === 0 ? (
              <p className="p-8 text-zinc-500">You have no postings yet.</p>
            ) : (
              <>
                {error && <p className="p-4 text-sm text-red-400">Error: {error}</p>}
                <table className="w-full text-left text-sm">
                  <thead className="text-zinc-500">
                    <tr>
                      <th className="p-4 font-medium">Title</th>
                      <th className="p-4 font-medium">Location</th>
                      <th className="p-4 font-medium">Posted</th>
                      <th className="p-4 font-medium">Status</th>
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
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              job.status === "open"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-zinc-500/20 text-zinc-400"
                            }`}
                          >
                            {job.status === "open" ? "Open" : "Closed"}
                          </span>
                        </td>
                        <td className="p-4">{job.applications?.[0]?.count ?? 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openApplicants(job)}
                              className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              View applicants
                            </button>
                            <button
                              onClick={() => openEdit(job)}
                              className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStatus(job)}
                              className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              {job.status === "open" ? "Close" : "Reopen"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  {editingId ? "Edit posting" : "Create posting"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {editingId
                    ? "Update the details of this posting."
                    : "Job seekers will be able to find and apply to it."}
                </p>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md px-2 py-1 text-sm text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Title *</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. TEST Frontend Developer"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Company *</label>
                <input
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Location *</label>
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Montreal, QC"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Job type *</label>
                <select
                  className={inputClass}
                  value={form.workplace_type}
                  onChange={(e) => updateField("workplace_type", e.target.value)}
                >
                  <option value="">Select...</option>
                  {WORKPLACE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Description *</label>
                <textarea
                  className={inputClass}
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Responsibilities, requirements..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Application deadline (optional)
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                />
              </div>
            </div>

            {formError && <p className="mt-4 text-sm text-red-400">{formError}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={saveJob}
                disabled={saving}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Save changes" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
                      <label className="flex items-center gap-2 text-xs text-zinc-500">
                        Change status
                        <select
                          value={a.status}
                          onChange={(e) => updateApplicantStatus(a, e.target.value)}
                          className="rounded-md border border-white/10 bg-black px-2 py-1.5 text-xs text-white outline-none focus:border-white/30 [color-scheme:dark]"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
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