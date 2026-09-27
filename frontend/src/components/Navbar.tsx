"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const links = [
  { label: "Features", href: "#" },
  { label: "My Resumes", href: "/dashboard/resume" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-white no-underline"
        >
          Launch<span className="text-zinc-400">Pad</span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium tracking-tight text-zinc-500 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-4 py-2 text-sm font-medium tracking-tight text-zinc-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/login");
                }}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium tracking-tight text-zinc-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
