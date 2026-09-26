"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Resume Builder", href: "#" },
  { label: "ATS Analysis", href: "#upload" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <a
          href="/"
          className="text-lg font-extrabold tracking-tight text-white no-underline"
        >
          Launch<span className="text-zinc-400">Pad</span>
        </a>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium tracking-tight text-zinc-500 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#upload"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
        >
          Try for free
        </a>
      </nav>
    </header>
  );
}
