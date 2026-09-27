"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ScorePage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/[0.08] p-1">
            <div className="rounded-xl border border-white/5 bg-black p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Analysis coming soon
              </h1>
              <p className="mt-2 text-sm tracking-tight text-zinc-500">
                Resume analysis and scoring will be available in Sprint 2.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
