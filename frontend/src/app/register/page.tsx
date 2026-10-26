"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TestimonialPanel from "@/components/TestimonialPanel";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"job-seeker" | "recruiter">("job-seeker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/login");
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
                  Create your account
                </h1>
                <p className="mt-2 text-sm tracking-tight text-zinc-500">
                  Get started with LaunchPadAI for free
                </p>

                <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium tracking-tight text-zinc-400">
                      I&apos;m a
                    </label>
                    <div className="flex rounded-lg border border-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => setRole("job-seeker")}
                        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold tracking-tight transition-all ${
                          role === "job-seeker"
                            ? "bg-white text-black shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Job Seeker
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("recruiter")}
                        className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold tracking-tight transition-all ${
                          role === "recruiter"
                            ? "bg-white text-black shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Recruiter
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium tracking-tight text-zinc-400"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
                    />
                  </div>

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
                      placeholder="At least 6 characters"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm tracking-tight text-white placeholder-zinc-600 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-sm font-medium tracking-tight text-zinc-400"
                    >
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
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
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm tracking-tight text-zinc-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-white transition-colors hover:text-zinc-300"
                  >
                    Sign in
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
