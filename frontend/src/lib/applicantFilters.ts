export type DateOrder = "newest" | "oldest";

export function filterAndSortApplicants<T extends { status: string; created_at: string }>(
  applicants: T[],
  statuses: string[],
  order: DateOrder
): T[] {
  const filtered =
    statuses.length === 0
      ? applicants
      : applicants.filter((a) => statuses.includes(a.status));

  return [...filtered].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return order === "oldest" ? diff : -diff;
  });
}
