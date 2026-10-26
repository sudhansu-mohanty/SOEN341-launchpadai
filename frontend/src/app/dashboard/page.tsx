"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <main className="relative min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/[0.08] p-1">
            <div className="rounded-xl border border-white/5 bg-black p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Login successful
              </h1>
              <p className="mt-2 text-sm tracking-tight text-zinc-500">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="mt-4 text-sm tracking-tight text-zinc-600">
                More content to come after Sprint 2
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
                >
                  Go to homepage
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                  className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
