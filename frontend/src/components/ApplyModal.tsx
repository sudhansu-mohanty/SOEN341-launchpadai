"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import type { StoredResume } from "@/lib/storage";
import {
  EMPTY_APPLICANT,
  liveApplyApi,
  validateApplicant,
  validateCoverLetter,
  type ApplicantErrors,
  type ApplicantForm,
  type ApplyApi,
  type YesNo,
} from "@/lib/applications";

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

const labelClass = "mb-2 block text-sm font-medium tracking-tight text-zinc-400";

function formatDate(iso: string) {
  return iso ? new Date(iso).toLocaleDateString() : "";
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">{children}</h3>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs tracking-tight text-red-300">
      {message}
    </p>
  );
}

function YesNoField({
  legend,
  value,
  error,
  onChange,
}: {
  legend: string;
  value: YesNo;
  error?: string;
  onChange: (v: YesNo) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm tracking-tight transition-colors ${
              value === option
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/10 text-zinc-400 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-white"
            />
            {option === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

function DocumentCard({ title, name, detail }: { title: string; name?: string; detail?: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium tracking-tight text-zinc-400">{title}</p>
      <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
          <FileText className={`h-5 w-5 ${name ? "text-zinc-400" : "text-zinc-600"}`} />
        </div>
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium tracking-tight ${name ? "text-white" : "text-zinc-600"}`}>
            {name ?? "No cover letter attached"}
          </p>
          {detail && <p className="text-xs tracking-tight text-zinc-600">{detail}</p>}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm tracking-tight">
      <dt className="shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-right break-words text-zinc-300">{value || "-"}</dd>
    </div>
  );
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
  const [applicant, setApplicant] = useState<ApplicantForm>(EMPTY_APPLICANT);
  const [fieldErrors, setFieldErrors] = useState<ApplicantErrors>({});
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [hasProfileSkills, setHasProfileSkills] = useState(false); // skills section only shows if the profile has skills
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset and load resumes (and pre-fill name/email) each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setStep("form");
    setError(null);
    setApplicant(EMPTY_APPLICANT);
    setFieldErrors({});
    setCoverLetter(null);
    setCoverLetterError(null);
    setSkills([]);
    setSkillDraft("");
    setHasProfileSkills(false);
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
    // Pre-filling is a convenience; if it fails the seeker just types the fields.
    api
      .loadApplicantDefaults()
      .then((defaults) => {
        if (cancelled) return;
        setApplicant((prev) => ({ ...prev, ...defaults.applicant }));
        setSkills(defaults.skills);
        setHasProfileSkills(defaults.skills.length > 0);
      })
      .catch(() => {});
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

  // Focus the dialog itself (without scrolling) so keyboard users land inside it.
  // Focusing the resume dropdown instead scrolled the form down to the Documents section.
  useEffect(() => {
    if (resumes) dialogRef.current?.focus({ preventScroll: true });
  }, [resumes]);

  // Always start at the top: when the modal opens, when the form loads, and on each step change.
  useEffect(() => {
    if (isOpen) dialogRef.current?.scrollTo({ top: 0 });
  }, [isOpen, resumes, step]);

  if (!isOpen) return null;

  const selected = resumes?.find((r) => r.id === resumePath);
  const canContinue = Boolean(resumePath);

  function setField<K extends keyof ApplicantForm>(key: K, value: ApplicantForm[K]) {
    setApplicant((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function addSkill() {
    const value = skillDraft.trim().replace(/,+$/, "").trim().slice(0, 40);
    setSkillDraft("");
    if (!value) return;
    setSkills((prev) =>
      prev.length >= 30 || prev.some((s) => s.toLowerCase() === value.toLowerCase()) ? prev : [...prev, value]
    );
  }

  function handleCoverLetterChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = ""; // lets the seeker pick the same file again after removing it
    if (!file) return;
    const problem = validateCoverLetter(file);
    if (problem) {
      setCoverLetter(null);
      setCoverLetterError(problem);
      return;
    }
    setCoverLetterError(null);
    setCoverLetter(file);
  }

  function handleReview() {
    if (skillDraft.trim()) addSkill(); // don't lose a skill that was typed but not confirmed
    const errors = validateApplicant(applicant);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields.");
      return;
    }
    setError(null);
    setStep("confirm");
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.submit({
        jobId,
        resumePath,
        coverLetter,
        applicant,
        skills,
      });
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
      } else if (result.error === "invalid_cover_letter") {
        setError("The cover letter must be a PDF of 5 MB or less.");
      } else if (result.error === "upload_failed") {
        setError("We couldn't upload your cover letter. Try again.");
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

  // One text input with label + inline error; ids are derived from the modal's title id.
  function textField(
    key: "first_name" | "last_name" | "email" | "phone" | "degree" | "country",
    label: string,
    options: { type?: string; autoComplete?: string; placeholder?: string } = {}
  ) {
    const id = `${titleId}-${key}`;
    const message = fieldErrors[key];
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <input
          id={id}
          type={options.type ?? "text"}
          value={applicant[key]}
          onChange={(e) => setField(key, e.target.value)}
          autoComplete={options.autoComplete}
          placeholder={options.placeholder}
          aria-invalid={Boolean(message)}
          aria-describedby={message ? `${id}-error` : undefined}
          className={`${inputClass} ${message ? "border-red-500/40" : ""}`}
        />
        <FieldError id={`${id}-error`} message={message} />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm motion-safe:animate-[fade-in_0.2s_ease-out]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl outline-none border border-white/[0.08] p-1 motion-safe:animate-[fade-up_0.35s_var(--ease-out)]"
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
              <SectionTitle>Your information</SectionTitle>
              <div className="grid gap-5 sm:grid-cols-2">
                {textField("first_name", "First name", { autoComplete: "given-name" })}
                {textField("last_name", "Last name", { autoComplete: "family-name" })}
              </div>
              {textField("email", "Email", { type: "email", autoComplete: "email" })}
              {textField("phone", "Phone number", { type: "tel", autoComplete: "tel", placeholder: "+1 514 555 0123" })}
              {textField("degree", "Current or latest degree", { placeholder: "e.g. BEng Software Engineering (in progress)" })}
              {textField("country", "Country of residence", { autoComplete: "country-name" })}
              <YesNoField
                legend="Are you legally authorized to work in Canada?"
                value={applicant.authorized_to_work_ca}
                error={fieldErrors.authorized_to_work_ca}
                onChange={(v) => setField("authorized_to_work_ca", v)}
              />
              <YesNoField
                legend="Will you now or in the future require visa sponsorship to work in Canada?"
                value={applicant.requires_sponsorship}
                error={fieldErrors.requires_sponsorship}
                onChange={(v) => setField("requires_sponsorship", v)}
              />

              {hasProfileSkills && (
                <>
                  <div className="mt-2">
                    <SectionTitle>Skills</SectionTitle>
                  </div>
                  <div>
                    <p className="mb-3 text-xs tracking-tight text-zinc-600">
                      From your profile. Remove or add skills for this application.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pr-1.5 pl-3 text-xs tracking-tight text-zinc-300"
                        >
                          {skill}
                          <button
                            type="button"
                            aria-label={`Remove ${skill}`}
                            onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                            className="rounded-full p-0.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      aria-label="Add a skill"
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill and press Enter"
                      className={`${inputClass} mt-3`}
                    />
                  </div>
                </>
              )}

              <div className="mt-2">
                <SectionTitle>Documents</SectionTitle>
              </div>
              <div>
                <label htmlFor={`${titleId}-resume`} className={labelClass}>
                  Resume
                </label>
                <select
                  id={`${titleId}-resume`}
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
                <label htmlFor={`${titleId}-letter`} className={labelClass}>
                  Cover letter <span className="font-normal text-zinc-600">(PDF, optional, max 5 MB)</span>
                </label>
                {coverLetter ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span className="truncate text-sm tracking-tight text-zinc-300">{coverLetter.name}</span>
                      <span className="shrink-0 text-xs tracking-tight text-zinc-600">{formatSize(coverLetter.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCoverLetter(null)}
                      className="shrink-0 text-xs font-medium tracking-tight text-zinc-400 underline-offset-4 hover:text-white hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    id={`${titleId}-letter`}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleCoverLetterChange}
                    aria-invalid={Boolean(coverLetterError)}
                    className="block w-full text-sm tracking-tight text-zinc-400 file:mr-4 file:cursor-pointer file:rounded-lg file:border file:border-white/10 file:bg-white/[0.03] file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-300 hover:file:bg-white/[0.06]"
                  />
                )}
                <FieldError id={`${titleId}-letter-error`} message={coverLetterError ?? undefined} />
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
                <button type="button" disabled={!canContinue} onClick={handleReview} className={primaryBtn}>
                  Review application
                </button>
              </div>
            </div>
          )}

          {resumes !== null && resumes.length > 0 && step === "confirm" && (
            <div className="mt-6 grid gap-5">
              <dl className="grid gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
                <SummaryRow label="Name" value={`${applicant.first_name.trim()} ${applicant.last_name.trim()}`} />
                <SummaryRow label="Email" value={applicant.email.trim()} />
                <SummaryRow label="Phone" value={applicant.phone.trim()} />
                <SummaryRow label="Degree" value={applicant.degree.trim()} />
                <SummaryRow label="Country of residence" value={applicant.country.trim()} />
                <SummaryRow
                  label="Authorized to work in Canada"
                  value={applicant.authorized_to_work_ca === "yes" ? "Yes" : "No"}
                />
                <SummaryRow
                  label="Requires sponsorship"
                  value={applicant.requires_sponsorship === "yes" ? "Yes" : "No"}
                />
                {skills.length > 0 && <SummaryRow label="Skills" value={skills.join(", ")} />}
              </dl>

              <DocumentCard
                title="Resume"
                name={selected?.name}
                detail={selected?.uploadedAt ? `Uploaded ${formatDate(selected.uploadedAt)}` : undefined}
              />

              <DocumentCard
                title="Cover letter"
                name={coverLetter?.name}
                detail={coverLetter ? `PDF, ${formatSize(coverLetter.size)}` : undefined}
              />

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