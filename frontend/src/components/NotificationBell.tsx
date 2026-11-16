"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
  syncDeadlineReminders,
} from "@/lib/notifications";
import { timeAgo, unreadBadge } from "@/lib/notificationFormat";
import type { AppNotification, NotificationType } from "@/types";

const TYPE_DOTS: Record<NotificationType, string> = {
  application_update: "bg-sky-400",
  interview_invitation: "bg-violet-400",
  deadline_reminder: "bg-amber-400",
  new_application: "bg-green-400",
};

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const unread = notifications.filter((n) => !n.read_at).length;
  const badge = unreadBadge(unread);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // A failed reminder sync should not hide the user's other notifications.
        await syncDeadlineReminders().catch((err) => {
          console.error("Could not create deadline reminders:", err.message);
        });
        const rows = await listNotifications();
        if (active) setNotifications(rows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();

    const unsubscribe = subscribeToNotifications(userId, (notification) => {
      setNotifications((list) =>
        list.some((n) => n.id === notification.id) ? list : [notification, ...list]
      );
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function openNotification(notification: AppNotification) {
    setOpen(false);
    router.push(notification.link);
    if (notification.read_at) return;

    const readAt = new Date().toISOString();
    setNotifications((list) =>
      list.map((n) => (n.id === notification.id ? { ...n, read_at: readAt } : n))
    );
    try {
      await markNotificationRead(notification.id);
    } catch {
      setNotifications((list) =>
        list.map((n) => (n.id === notification.id ? { ...n, read_at: null } : n))
      );
    }
  }

  async function markAllRead() {
    const previous = notifications;
    const readAt = new Date().toISOString();
    setError("");
    setNotifications((list) => list.map((n) => ({ ...n, read_at: n.read_at ?? readAt })));
    try {
      await markAllNotificationsRead();
    } catch {
      setNotifications(previous);
      setError("Could not mark your notifications as read.");
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        className="relative rounded-md p-2 text-zinc-400 transition-colors hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed top-14 right-4 left-4 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-xl shadow-black/50 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <h2 className="text-sm font-semibold tracking-tight text-white">Notifications</h2>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium tracking-tight text-zinc-400 transition-colors hover:text-white"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {error && (
              <p className="px-4 py-3 text-sm tracking-tight text-red-300">{error}</p>
            )}

            {loading && (
              <p className="px-4 py-8 text-center text-sm tracking-tight text-zinc-500">
                Loading notifications...
              </p>
            )}

            {!loading && !error && notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm tracking-tight text-zinc-600">
                You have no notifications yet.
              </p>
            )}

            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openNotification(notification)}
                className={`flex w-full items-start gap-3 border-b border-white/[0.05] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/5 ${
                  notification.read_at ? "" : "bg-white/[0.03]"
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOTS[notification.type]} ${
                    notification.read_at ? "opacity-30" : ""
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium tracking-tight text-white">
                    {notification.title}
                  </span>
                  <span className="mt-0.5 block text-xs tracking-tight text-zinc-400">
                    {notification.body}
                  </span>
                  <span className="mt-1 block text-xs tracking-tight text-zinc-600">
                    {timeAgo(notification.created_at)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
