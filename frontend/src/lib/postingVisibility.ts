export type PostingState = { status: "open" | "closed"; archived_at: string | null };
export type PostingTab = "active" | "closed" | "archived";

// Which dashboard tab a posting belongs to. Each posting is in exactly one tab.
export function postingTab(job: PostingState): PostingTab {
  if (job.archived_at) return "archived";
  return job.status === "open" ? "active" : "closed";
}

// Mirrors the database policy "Read non-archived or own or applied jobs".
export function canSeekerSee(
  job: { archived_at: string | null; posted_by: string },
  userId: string | null,
  hasApplied: boolean
): boolean {
  return !job.archived_at || job.posted_by === userId || hasApplied;
}

// Mirrors the database policy "Seekers can apply as themselves".
export function canApply(job: PostingState): boolean {
  return job.status === "open" && !job.archived_at;
}