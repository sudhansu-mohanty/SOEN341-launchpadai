"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSnapshot() {
  const score = randomBetween(62, 96);
  return {
    score,
    metrics: [
      { label: "Structure", value: randomBetween(60, 99) },
      { label: "Keywords", value: randomBetween(55, 95) },
      { label: "Clarity", value: randomBetween(65, 99) },
      { label: "Impact", value: randomBetween(58, 96) },
    ],
  };
}

const INITIAL = generateSnapshot();

export default function HeroSection() {
  const [displayScore, setDisplayScore] = useState(0);
  const [target, setTarget] = useState(INITIAL);
  const [metrics, setMetrics] = useState(INITIAL.metrics.map(() => 0));
  const [barsReady, setBarsReady] = useState(false);
  const rafRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const animateTo = useCallback((snapshot: ReturnType<typeof generateSnapshot>) => {
    const duration = 1200;
    const start = performance.now();
    const fromScore = displayScore;
    const fromMetrics = [...metrics];

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setDisplayScore(Math.round(fromScore + (snapshot.score - fromScore) * eased));
      setMetrics(
        snapshot.metrics.map((m, i) =>
          Math.round(fromMetrics[i] + (m.value - fromMetrics[i]) * eased)
        )
      );

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [displayScore, metrics]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarsReady(true);
      animateTo(INITIAL);
    }, 600);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = generateSnapshot();
      setTarget(next);
      animateTo(next);
    }, 3500);

    return () => clearInterval(intervalRef.current);
  }, [animateTo]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div
            className="max-w-xl"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
          >
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your resume,
              <br />
              <span className="text-zinc-400">recruiter-ready.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed tracking-tight text-zinc-300 sm:text-lg">
              Get ATS-style scoring and clarity feedback in seconds — so your
              resume is easier to scan and easier to shortlist.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#upload"
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/20"
              >
                Analyze my resume
              </a>
              <span className="text-sm tracking-tight text-zinc-500">Free · No signup</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["No credit card", "ATS-friendly insights", "Results in seconds"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-white/10 px-3 py-1 text-xs tracking-tight text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div
            className="relative hidden lg:block"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
          >
            <div style={{ animation: "float 7s ease-in-out 2s infinite" }}>
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl shadow-white/5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-white"
                      style={{ animation: "pulse-ring 2.4s ease-in-out 2.5s infinite" }}
                    />
                    <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                      LaunchPad Score
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                    {displayScore}
                    <span className="text-base font-medium text-zinc-500">/100</span>
                  </span>
                </div>

                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white"
                    style={{
                      width: barsReady ? `${target.score}%` : "0%",
                      transition: "width 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {target.metrics.map((metric, i) => (
                    <div key={metric.label}>
                      <div className="mb-1.5 flex justify-between">
                        <span className="text-xs tracking-tight text-zinc-400">{metric.label}</span>
                        <span className="text-xs tracking-tight text-zinc-400 tabular-nums">{metrics[i]}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{
                            width: barsReady ? `${metric.value}%` : "0%",
                            transition: `width 1200ms cubic-bezier(0.16, 1, 0.3, 1)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed tracking-tight text-zinc-400">
                  Strong keyword coverage. Improve bullet impact for top-quartile shortlisting.
                </p>
              </div>

              <div className="absolute -right-3 -bottom-3 flex items-center gap-2 rounded-lg border border-white/15 bg-black/80 px-3 py-2 shadow-xl backdrop-blur-md">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animation: "pulse-ring 2.4s ease-in-out 3s infinite" }}
                />
                <span className="text-xs font-semibold tracking-wider text-white">
                  ATS-optimized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
