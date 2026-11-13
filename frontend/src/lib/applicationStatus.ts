export function statusLabel(status: string) {
  const text = status.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function badgeClass(status: string) {
  const s = status.toLowerCase().replace(/[\s_-]/g, "");
  if (s === "underreview") return "bg-yellow-500/15 text-yellow-300";
  if (s === "interview") return "bg-blue-500/15 text-blue-300";
  if (s === "offered") return "bg-green-500/15 text-green-300";
  if (s === "rejected") return "bg-red-500/15 text-red-300";
  return "bg-white/10 text-zinc-300";
}