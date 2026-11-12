export function timeAgo(createdAt: string, now: Date = new Date()) {
  const minutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString();
}

export function unreadBadge(count: number) {
  if (count <= 0) return "";
  return count > 9 ? "9+" : String(count);
}
