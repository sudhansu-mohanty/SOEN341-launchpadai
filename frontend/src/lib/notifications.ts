import { supabase } from "./supabase";
import type { AppNotification } from "@/types";

const LIST_LIMIT = 30;

// RLS limits every query here to the logged-in user's notifications.
export async function listNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, link, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (error) throw new Error(error.message);
  return (data ?? []) as AppNotification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

// Creates any upcoming-deadline reminders the user does not have yet.
export async function syncDeadlineReminders(): Promise<void> {
  const { error } = await supabase.rpc("sync_deadline_reminders");
  if (error) throw new Error(error.message);
}

// Calls onInsert for each new notification. Returns a function that stops listening.
export function subscribeToNotifications(
  userId: string,
  onInsert: (notification: AppNotification) => void
) {
  // Every page mounts its own Navbar, so the channel name has to be unique.
  const channel = supabase
    .channel(`notifications:${userId}:${Math.random()}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => onInsert(payload.new as AppNotification)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
