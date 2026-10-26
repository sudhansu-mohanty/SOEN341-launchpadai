"use client";

// Temporary page to test the apply flow without Sudhansu's job detail view or
// Othmane's table. Visit /dev/apply. Delete this folder before merging.
import { useState } from "react";
import { ToastProvider } from "@/context/ToastContext";
import ApplyButton from "@/components/ApplyButton";
import type { ApplyApi, SubmitResult } from "@/lib/applications";

type Mode = "success" | "slow" | "duplicate" | "unauthenticated" | "error" | "no-resumes";
const MODES: Mode[] = ["success", "slow", "duplicate", "unauthenticated", "error", "no-resumes"];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Module-level so the object identity stays stable between renders.
let mode: Mode = "success";
const stubApi: ApplyApi = {
  async loadResumes() {
    await wait(300);
    if (mode === "no-resumes") return [];
    return [
      { id: "u/Resume_2026.pdf", name: "Resume_2026.pdf", size: 120_000, uploadedAt: "2026-10-01T12:00:00Z", url: "" },
      { id: "u/Resume_Backend.pdf", name: "Resume_Backend.pdf", size: 98_000, uploadedAt: "2026-09-12T12:00:00Z", url: "" },
    ];
  },
  async submit(): Promise<SubmitResult> {
    await wait(mode === "slow" ? 2500 : 500);
    if (mode === "duplicate") return { ok: false, error: "duplicate" };
    if (mode === "unauthenticated") return { ok: false, error: "unauthenticated" };
    if (mode === "error") throw new Error("network");
    return { ok: true, applicationId: "stub-1" };
  },
};

export default function ApplyDevPage() {
  const [, force] = useState(0);
  return (
    <ToastProvider>
      <main className="min-h-screen bg-black px-5 py-24 text-white">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight">Apply flow (dev)</h1>
          <p className="mt-2 text-sm tracking-tight text-zinc-500">
            Pick a stub mode, then click Apply. Reload to reset the &quot;Already applied&quot; state.
          </p>

          <label className="mt-8 block text-sm font-medium tracking-tight text-zinc-400" htmlFor="mode">
            Stub mode
          </label>
          <select
            id="mode"
            defaultValue="success"
            onChange={(e) => {
              mode = e.target.value as Mode;
              force((n) => n + 1);
            }}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white outline-none [color-scheme:dark] focus:border-white/25"
          >
            {MODES.map((m) => (
              <option key={m} value={m} className="bg-black">
                {m}
              </option>
            ))}
          </select>

          <div className="mt-8 rounded-2xl border border-white/[0.08] p-1">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black p-6">
              <div>
                <p className="text-sm font-medium tracking-tight text-white">Software Developer Intern</p>
                <p className="text-xs tracking-tight text-zinc-600">Sample job</p>
              </div>
              <ApplyButton
                jobId="job-123"
                jobTitle="Software Developer Intern"
                api={stubApi}
                onViewTracker={() => alert("Navigate to the tracker here")}
              />
            </div>
          </div>
        </div>
      </main>
    </ToastProvider>
  );
}