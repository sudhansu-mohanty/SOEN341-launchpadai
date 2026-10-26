import { supabase } from "./supabase";
import { listResumes, type StoredResume } from "./storage";

// ---- Contract with Othmane (TASK-2.08a) ----
// Agree on these names and the `applications` columns before merging.
// Columns: job_id, seeker_id, resume_path, status, plus the applicant
// fields, skills and cover_letter_path added by database/applications-applicant-info.sql.
// Resumes and cover letters live in the Supabase Storage bucket "resumes":
//   resume        -> "<userId>/<file>.pdf"
//   cover letter  -> "<userId>/cover-letters/<jobId>-<timestamp>.pdf"

const BUCKET = "resumes";

export type ApplicationStatus = "Applied" | "Under Review" | "Interview" | "Offered" | "Rejected";

export const COVER_LETTER_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type YesNo = "" | "yes" | "no";

// What the seeker types into the apply form (everything is a string so inputs stay controlled).
export type ApplicantForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  degree: string; // current or latest degree
  country: string; // country of residence
  authorized_to_work_ca: YesNo;
  requires_sponsorship: YesNo;
};

export const EMPTY_APPLICANT: ApplicantForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  degree: "",
  country: "",
  authorized_to_work_ca: "",
  requires_sponsorship: "",
};

export type ApplicantErrors = Partial<Record<keyof ApplicantForm, string>>;

export function validateApplicant(a: ApplicantForm): ApplicantErrors {
  const errors: ApplicantErrors = {};
  if (!a.first_name.trim()) errors.first_name = "Enter your first name.";
  if (!a.last_name.trim()) errors.last_name = "Enter your last name.";

  if (!a.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) errors.email = "Enter a valid email address.";

  const digits = a.phone.replace(/\D/g, "");
  if (!a.phone.trim()) errors.phone = "Enter your phone number.";
  else if (!/^[\d\s()+.-]+$/.test(a.phone.trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!a.degree.trim()) errors.degree = "Enter your current or latest degree.";
  if (!a.country.trim()) errors.country = "Enter your country of residence.";
  if (!a.authorized_to_work_ca) errors.authorized_to_work_ca = "Select yes or no.";
  if (!a.requires_sponsorship) errors.requires_sponsorship = "Select yes or no.";
  return errors;
}

// Returns an error message, or null when the file is an acceptable cover letter.
export function validateCoverLetter(file: File): string | null {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "The cover letter must be a PDF file.";
  if (file.size > COVER_LETTER_MAX_BYTES) return "The cover letter must be 5 MB or smaller.";
  return null;
}

export type SubmitInput = {
  jobId: string;
  resumePath: string;
  coverLetter: File | null; // optional PDF
  applicant: ApplicantForm;
  skills: string[]; // only present when the seeker has skills on their profile; may be edited in the modal
};

// What we could pre-fill from the seeker's profile. Anything the profile doesn't have is left out.
export type ApplicantDefaults = {
  applicant: Partial<ApplicantForm>;
  skills: string[];
};

export type SubmitResult =
  | { ok: true; applicationId: string }
  | {
      ok: false;
      error: "duplicate" | "unauthenticated" | "invalid_cover_letter" | "upload_failed" | "unknown";
    };

export type ApplyApi = {
  loadResumes: () => Promise<StoredResume[]>;
  loadApplicantDefaults: () => Promise<ApplicantDefaults>;
  submit: (input: SubmitInput) => Promise<SubmitResult>;
};

// Resumes for the logged-in seeker, newest first (listResumes already sorts that way).
export async function loadMyResumes(): Promise<StoredResume[]> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("unauthenticated");
  return listResumes(data.user.id);
}

// Pre-fills the apply form from the seeker's profile (profiles table). Only fields the
// profile actually has are returned, so everything else stays empty. The profile has no
// phone number, and its "location" is a city/province rather than a country, so those two
// are never pre-filled.
export async function loadApplicantDefaults(): Promise<ApplicantDefaults> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return { applicant: {}, skills: [] };

  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, education, skills")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = (
    (data?.full_name as string | undefined)?.trim() ||
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    ""
  );
  const [first = "", ...rest] = fullName.split(/\s+/);

  // Education is free text ("Degree, institution, and graduation year"); the first line is the best guess.
  const education = (data?.education as string | undefined) ?? "";
  const degree = (education.split(/\r?\n/).find((line) => line.trim()) ?? "").trim().slice(0, 150);

  const candidate: Partial<ApplicantForm> = {
    first_name: first,
    last_name: rest.join(" "),
    email: (data?.email as string | undefined)?.trim() || user.email || "",
    degree,
  };
  const applicant = Object.fromEntries(
    Object.entries(candidate).filter(([, value]) => value)
  ) as Partial<ApplicantForm>;

  const skills = Array.isArray(data?.skills)
    ? (data.skills as unknown[])
        .filter((skill): skill is string => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return { applicant, skills };
}

export async function submitApplication({
  jobId,
  resumePath,
  coverLetter,
  applicant,
  skills,
}: SubmitInput): Promise<SubmitResult> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };
  const userId = auth.user.id;

  // Upload the cover letter first (the table has no UPDATE policy, so the path
  // has to be known at insert time). It is removed again if the insert fails.
  let coverLetterPath: string | null = null;
  if (coverLetter) {
    if (validateCoverLetter(coverLetter)) return { ok: false, error: "invalid_cover_letter" };

    const path = `${userId}/cover-letters/${jobId}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, coverLetter, { contentType: "application/pdf" });
    if (uploadError) return { ok: false, error: "upload_failed" };
    coverLetterPath = path;
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      seeker_id: userId,
      resume_path: resumePath,
      cover_letter_path: coverLetterPath,
      first_name: applicant.first_name.trim(),
      last_name: applicant.last_name.trim(),
      email: applicant.email.trim(),
      phone: applicant.phone.trim(),
      degree: applicant.degree.trim(),
      country: applicant.country.trim(),
      authorized_to_work_ca: applicant.authorized_to_work_ca === "yes",
      requires_sponsorship: applicant.requires_sponsorship === "yes",
      skills: skills.length > 0 ? skills : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    // Don't leave an orphaned cover letter behind.
    if (coverLetterPath) await supabase.storage.from(BUCKET).remove([coverLetterPath]);
    // 23505 = unique violation on (job_id, seeker_id)
    if (error?.code === "23505") return { ok: false, error: "duplicate" };
    return { ok: false, error: "unknown" };
  }
  return { ok: true, applicationId: data.id };
}

// 2.14a: ids of every job the logged-in seeker has applied to. Load once on the
// Find Jobs page and pass `alreadyApplied={ids.has(job.id)}` to <ApplyButton>.
// RLS already limits rows to the current seeker; returns an empty set when
// logged out or on error so the page still renders with "Apply" buttons.
export async function getAppliedJobIds(): Promise<Set<string>> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return new Set();

  const { data, error } = await supabase
    .from("applications")
    .select("job_id")
    .eq("seeker_id", auth.user.id);

  if (error || !data) return new Set();
  return new Set((data as { job_id: string }[]).map((row) => row.job_id));
}

export const liveApplyApi: ApplyApi = {
  loadResumes: loadMyResumes,
  loadApplicantDefaults,
  submit: submitApplication,
};