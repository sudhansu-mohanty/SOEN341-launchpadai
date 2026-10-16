"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import type { StoredResume } from "@/lib/storage";
import { liveApplyApi, type ApplyApi } from "@/lib/applications";

export const COVER_NOTE_MAX = 1000;

export type ApplyModalProps = {
    jobId: string;
    jobTitle: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmitted: () => void;
    onAlreadyApplied?: () => void; // server said this is a duplicate
    api?: ApplyApi; // override for the dev page / tests; defaults to Supabase
};

type Step = "form" | "confirm";

const inputClass = 
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05] [color-scheme:dark]";

const primaryBtn =
  "rounded-lg bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50";
 
const secondaryBtn =
  "rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-400 transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";
 
function formatDate(iso: string) {
  return iso ? new Date(iso).toLocaleDateString() : "";
}

export default function ApplyModal({
    jobId,
    jobTitle,
    isOpen,
    onClose,
    onSubmitted,
    onAlreadyApplied,
    api = liveApplyApi,
}: ApplyModalProps) {
      const [resumes, setResumes] = useState<StoredResume[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resumePath, setResumePath] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const titleId = useId();
  const selectRef = useRef<HTMLSelectElement>(null);
 
  // Reset and load resumes each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setStep("form");
    setError(null);
    setNote("");
    setResumes(null);
    setLoadError(null);
    api
      .loadResumes()
      .then((list) => {
        if (cancelled) return;
        setResumes(list);
        setResumePath(list[0]?.id ?? ""); // newest first
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const unauth = err instanceof Error && err.message === "unauthenticated";
        setLoadError(
          unauth
            ? "Your session has expired. Log in again to apply."
            : "We couldn't load your resumes. Close this window and try again."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, api]);
 
  // Escape closes (but not mid-submit).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, submitting, onClose]);
 
  // Lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);
 
  // Move focus into the dialog once resumes are ready.
  useEffect(() => {
    if (resumes && resumes.length > 0) selectRef.current?.focus();
  }, [resumes]);
 
  if (!isOpen) return null;
 
  const selected = resumes?.find((r) => r.id === resumePath);
  const noteTooLong = note.length > COVER_NOTE_MAX;
  const canContinue = Boolean(resumePath) && !noteTooLong;
 
  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.submit(jobId, resumePath, note.trim());
      if (result.ok) {
        onSubmitted();
        return;
      }
      setStep("form");
      if (result.error === "duplicate") {
        setError("You've already applied to this job.");
        onAlreadyApplied?.();
      } else if (result.error === "unauthenticated") {
        setError("Your session has expired. Log in again to apply.");
      } else {
        setError("We couldn't send your application. Try again.");
      }
    } catch {
      setStep("form");
      setError("We couldn't send your application. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm motion-safe:animate-[fade-in_0.2s_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] p-1 motion-safe:animate-[fade-up_0.35s_var(--ease-out)]"
      >
        <div className="rounded-xl border border-white/5 bg-black p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-xl font-bold tracking-tight text-white">
                {step === "form" ? "Apply" : "Review your application"}
              </h2>
              <p className="mt-1 text-sm tracking-tight text-zinc-500">{jobTitle}</p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
 
          {resumes === null && !loadError && (
            <p className="mt-8 text-sm tracking-tight text-zinc-500">Loading your resumes...</p>
          )}
 
          {loadError && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300"
            >
              {loadError}
            </div>
          )}
 
          {resumes !== null && resumes.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
              <p className="text-sm tracking-tight text-zinc-300">You need a resume before you can apply.</p>
              <Link href="/dashboard/resume" className={`${primaryBtn} mt-4 inline-block`}>
                Upload a resume
              </Link>
            </div>
          )}
 
          {resumes !== null && resumes.length > 0 && step === "form" && (
            <div className="mt-6 grid gap-5">
              <div>
                <label htmlFor={`${titleId}-resume`} className="mb-2 block text-sm font-medium tracking-tight text-zinc-400">
                  Resume
                </label>
                <select
                  id={`${titleId}-resume`}
                  ref={selectRef}
                  value={resumePath}
                  onChange={(e) => setResumePath(e.target.value)}
                  className={inputClass}
                >
                  {resumes.map((r, i) => (
                    <option key={r.id} value={r.id} className="bg-black">
                      {r.name}
                      {i === 0 ? " (most recent)" : ""}
                    </option>
                  ))}
                </select>
              </div>
 
              <div>
                <label htmlFor={`${titleId}-note`} className="mb-2 block text-sm font-medium tracking-tight text-zinc-400">
                  Cover note <span className="font-normal text-zinc-600">(optional)</span>
                </label>
                <textarea
                  id={`${titleId}-note`}
                  rows={6}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  aria-invalid={noteTooLong}
                  aria-describedby={`${titleId}-count`}
                  placeholder="Tell the recruiter why you're a good fit."
                  className={`${inputClass} resize-y ${noteTooLong ? "border-red-500/40" : ""}`}
                />
                <p
                  id={`${titleId}-count`}
                  className={`mt-1 text-right text-xs tracking-tight ${noteTooLong ? "text-red-300" : "text-zinc-600"}`}
                >
                  {note.length} / {COVER_NOTE_MAX}
                </p>
              </div>
 
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300"
                >
                  {error}
                </div>
              )}
 
              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className={secondaryBtn}>
                  Cancel
                </button>
                <button type="button" disabled={!canContinue} onClick={() => setStep("confirm")} className={primaryBtn}>
                  Review application
                </button>
              </div>
            </div>
          )}
 
          {resumes !== null && resumes.length > 0 && step === "confirm" && (
            <div className="mt-6 grid gap-5">
              <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <FileText className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium tracking-tight text-white">{selected?.name}</p>
                  {selected?.uploadedAt && (
                    <p className="text-xs tracking-tight text-zinc-600">Uploaded {formatDate(selected.uploadedAt)}</p>
                  )}
                </div>
              </div>
 
              <div>
                <p className="mb-2 text-sm font-medium tracking-tight text-zinc-400">Cover note</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight break-words whitespace-pre-wrap text-zinc-300">
                  {note.trim() || <span className="text-zinc-600">None</span>}
                </p>
              </div>
 
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setStep("form")} disabled={submitting} className={secondaryBtn}>
                  Back
                </button>
                <button type="button" onClick={handleSubmit} disabled={submitting} className={primaryBtn}>
                  {submitting ? "Sending..." : "Send application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}