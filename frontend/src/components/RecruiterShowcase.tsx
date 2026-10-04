"use client";

import { useEffect, useRef } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function RecruiterShowcase() {
  const showcaseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = showcaseRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] p-1">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div ref={showcaseRef} className="showcase group relative rounded-xl border border-white/5 bg-black p-6 text-center sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          See Your Resume Through a Recruiter Lens
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm tracking-tight text-zinc-500 sm:text-base">
          A preview-first review layer highlights fit, structure, and role alignment before your
          resume reaches a hiring team.
        </p>

        <div className="relative mx-auto mt-8 max-w-3xl" style={{ minHeight: "320px" }}>
          <div className="preview relative mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black/60 p-5 text-left backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-tight text-zinc-400">
                Candidate Preview
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold tracking-tight text-black">
                82 Match
              </span>
            </div>

            {[94, 72, 48, 94, 72, 48].map((w, i) => (
              <div
                key={i}
                className={`mb-2 h-2 rounded-full ${i === 3 ? "mt-4" : ""}`}
                style={{
                  width: `${w}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.12) 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 3.5s ease-in-out infinite",
                }}
              />
            ))}

            <div
              className="pointer-events-none absolute top-0 left-0 h-full w-[45%]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                animation: "scan 4.5s ease-in-out 1.2s infinite",
              }}
            />
          </div>

          <div className="float-card absolute top-2 left-0 w-48 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full">
            <span className="mb-2 inline-block h-2.5 w-2.5 rounded-full bg-white" />
            <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">Top Skills Detected</h3>
            <p className="text-xs leading-relaxed tracking-tight text-zinc-500">
              Product strategy, cross-functional execution, stakeholder updates.
            </p>
          </div>

          <div className="float-card absolute top-28 right-0 w-48 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full" style={{ transitionDelay: "100ms" }}>
            <span className="mb-2 inline-block h-2.5 w-2.5 rounded-full bg-white" />
            <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">ATS Readability</h3>
            <p className="text-xs leading-relaxed tracking-tight text-zinc-500">
              Section hierarchy and keyword signals are clearly parsed.
            </p>
          </div>

          <div className="float-card absolute right-12 bottom-1 w-52 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full" style={{ transitionDelay: "200ms" }}>
            <h4 className="mb-2 text-sm font-semibold tracking-tight text-white">Need stronger impact?</h4>
            <button
              type="button"
              className="w-full rounded-lg bg-white px-3 py-2 text-xs font-bold tracking-tight text-black transition-all hover:bg-zinc-200"
            >
              Generate stronger bullets
            </button>
          </div>
        </div>

        <style jsx>{`
          .float-card {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 420ms ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease;
          }
          .showcase.in-view .float-card {
            opacity: 1;
            transform: translateY(0);
          }
          .showcase.in-view .float-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}
