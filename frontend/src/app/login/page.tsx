"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TestimonialPanel from "@/components/TestimonialPanel";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center px-5 pt-14">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] p-1">
            <div className="grid rounded-xl border border-white/5 bg-black md:grid-cols-2">
              {/* Left — form */}
              <div className="p-8 sm:p-10">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm tracking-tight text-zinc-500">
                  Sign in to your LaunchPadAI account
                </p>

                <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium tracking-tight text-zinc-400"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium tracking-tight text-zinc-400"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-white px-5 py-3 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm tracking-tight text-zinc-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-white transition-colors hover:text-zinc-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              {/* Right — testimonials */}
              <div className="hidden md:block">
                <TestimonialPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
