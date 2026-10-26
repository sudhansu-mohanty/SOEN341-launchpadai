import { supabase } from "./supabase";
import type { Application, Job } from "@/types";

export type TrackedApplication = Pick<Application, "id" | "job_id" | "status" | "created_at"> & {
  job: Pick<Job, "title" | "company"> | null;
};

// Applications for the given seeker joined with their job, newest first.
// RLS already limits rows to the logged-in seeker; the filter keeps it explicit.
export async function listMyApplications(userId: string): Promise<TrackedApplication[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("id, job_id, status, created_at, job:jobs(title, company)")
    .eq("seeker_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TrackedApplication[];
}
