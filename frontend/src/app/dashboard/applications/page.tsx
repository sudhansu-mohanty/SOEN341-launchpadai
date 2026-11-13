"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { listMyApplications, type TrackedApplication } from "@/lib/tracker";
import type { ApplicationStatus } from "@/types";

type Tab = "All" | ApplicationStatus;

const TABS: Tab[] = ["All", "Applied", "Under Review", "Interview", "Offered", "Rejected"];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  "Under Review": "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Interview: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  Offered: "border-green-500/20 bg-green-500/10 text-green-300",
  Rejected: "border-red-500/20 bg-red-500/10 text-red-300",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [tab, setTab] = useState<Tab>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      listMyApplications(data.user.id)
        .then(setApplications)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [router]);

  const countFor = (t: Tab) =>
    t === "All" ? applications.length : applications.filter((a) => a.status === t).length;

  const visible = tab === "All" ? applications : applications.filter((a) => a.status === tab);

    // applications over  last 30 days
  const chartData = (() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);

      return {
        date,
        count: 0,
      };
    });

    applications.forEach((app) => {
      const applicationDate = new Date(app.created_at);
      applicationDate.setHours(0, 0, 0, 0);

      const day = days.find(
        (d) => d.date.getTime() === applicationDate.getTime()
      );

      if (day) {
        day.count++;
      }
    });

    return days;
  })();

  const maxApplications = Math.max(
    ...chartData.map((d) => d.count),
    1
  );

  const totalApplications = chartData.reduce(
    (sum, day) => sum + day.count,
    0
  );

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 pt-24 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-white">My Applications</h1>
        <p className="mt-2 text-sm tracking-tight text-zinc-500">
          Track the status of every job you have applied to.
        </p>

        {/* applications over time graph */}
<div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">

  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-white">
        Applications Over Time
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Your application activity over the last 30 days
      </p>
    </div>

    <div className="text-right">
      <p className="text-2xl font-bold text-white">
        {totalApplications}
      </p>
      <p className="text-xs text-zinc-500">
        Applications
      </p>
    </div>
  </div>

  {/* Bar Chart */}
  <div className="mt-8 flex h-40 items-end gap-1">
    {chartData.map((day, index) => {
      const height =
        day.count === 0
          ? 4
          : Math.max((day.count / maxApplications) * 100, 8);

      return (
        <div
          key={index}
          className="group relative flex h-full flex-1 flex-col justify-end"
        >
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block">
            {day.count} applications
            <br />
            {day.date.toLocaleDateString()}
          </div>

          {/* Bar */}
          <div
            style={{ height: `${height}%` }}
            className={`w-full rounded-t-sm transition-all ${
              day.count > 0
                ? "bg-sky-500 hover:bg-sky-400"
                : "bg-white/[0.08]"
            }`}
          />
        </div>
      );
    })}
  </div>

  {/* Chart Labels */}
  <div className="mt-3 flex justify-between text-xs text-zinc-600">
    <span>
      {chartData[0]?.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </span>

    <span>
      {chartData[14]?.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </span>

    <span>Today</span>
  </div>

</div>

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-sm tracking-tight text-zinc-500">Loading applications...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300">
            Could not load your applications: {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm tracking-tight text-zinc-600">
              You have not applied to any jobs yet.
            </p>
            <Link
              href="/find-jobs"
              className="mt-4 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
            >
              Browse jobs
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <>
            {/* Status tabs */}
            <div className="mt-8 flex flex-wrap gap-2" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium tracking-tight transition-colors ${
                    tab === t
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/[0.08] text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                  }`}
                >
                  {t}
                  <span className="ml-2 text-xs text-zinc-500">{countFor(t)}</span>
                </button>
              ))}
            </div>

            {/* Application list */}
            {visible.length > 0 ? (
              <div className="mt-6 grid gap-3">
                {visible.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium tracking-tight text-white">
                        {app.job?.title ?? "Job no longer available"}
                      </p>
                      <p className="text-xs tracking-tight text-zinc-600">
                        {app.job?.company ?? "Unknown company"} &middot; Applied{" "}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium tracking-tight ${STATUS_STYLES[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-12 text-center">
                <p className="text-sm tracking-tight text-zinc-600">No applications in {tab} yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
