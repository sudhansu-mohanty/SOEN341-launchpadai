import { supabase } from "./supabase";
import { listResumes, type StoredResume } from "./storage";

// ---- Contract with Othmane (TASK-2.08a) ----
// Agree on these names and the `applications` columns before merging.
// Assumed columns: job_id, seeker_id, resume_path, cover_note, status.
// Resumes live in the Supabase Storage bucket "resumes" (id = "<userId>/<file>.pdf"),
// so the application stores that path rather than a resume row id.

export type ApplicationStatus = "Applied" | "Under Review" | "Interview" | "Offered" | "Rejected";

export type SubmitResult =
  | { ok: true; applicationId: string }
  | { ok: false; error: "duplicate" | "unauthenticated" | "unknown" };

export type ApplyApi = {
  loadResumes: () => Promise<StoredResume[]>;
  submit: (jobId: string, resumePath: string, coverNote: string) => Promise<SubmitResult>;
};

// Resumes for the logged-in seeker, newest first (listResumes already sorts that way).
export async function loadMyResumes(): Promise<StoredResume[]> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("unauthenticated");
  return listResumes(data.user.id);
}

export async function submitApplication(
  jobId: string,
  resumePath: string,
  coverNote: string
): Promise<SubmitResult> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, error: "unauthenticated" };

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      seeker_id: auth.user.id,
      resume_path: resumePath,
      cover_note: coverNote || null,
    })
    .select("id")
    .single();

  // 23505 = unique violation on (job_id, seeker_id)
  if (error?.code === "23505") return { ok: false, error: "duplicate" };
  if (error || !data) return { ok: false, error: "unknown" };
  return { ok: true, applicationId: data.id };
}

export const liveApplyApi: ApplyApi = {
  loadResumes: loadMyResumes,
  submit: submitApplication,
};
