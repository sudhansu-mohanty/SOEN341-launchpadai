"use client";

import { useEffect, useRef, useState } from "react";

export type ScoreResult = {
  filename: string;
  total_score: number;
  categories: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
    impact: number;
    formatting: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

type Props = {
  result: ScoreResult;
};

type BreakdownItem = {
  label: string;
  value: number;
  max: number;
  status: "good" | "warn" | "bad";
};

function buildBreakdown(categories: ScoreResult["categories"]): BreakdownItem[] {
  const items: { label: string; value: number; max: number }[] = [
    { label: "Skills", value: categories.skills, max: 20 },
    { label: "Experience", value: categories.experience, max: 20 },
    { label: "Projects", value: categories.projects, max: 20 },
    { label: "Education", value: categories.education, max: 20 },
    { label: "Impact", value: categories.impact, max: 10 },
    { label: "Formatting", value: categories.formatting, max: 10 },
  ];

  return items.map((item) => {
    const ratio = item.value / item.max;
    const status = ratio >= 0.7 ? "good" : ratio >= 0.45 ? "warn" : "bad";
    return {
      ...item,
      value: Math.max(0, Math.min(item.max, item.value)),
      status,
    };
  });
}

const statusDot = {
  good: "bg-white",
  warn: "bg-zinc-400",
  bad: "bg-zinc-600",
} as const;

const statusBar = {
  good: "bg-white",
  warn: "bg-zinc-400",
  bad: "bg-zinc-600",
} as const;

export default function ScoreCard({ result }: Props) {
  const total = Math.max(0, Math.min(100, result.total_score));
  const [displayScore, setDisplayScore] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setDisplayScore(0);
    setBarsReady(false);

    const timeout = setTimeout(() => {
      setBarsReady(true);
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayScore(Math.round(eased * total));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 80);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  const breakdown = buildBreakdown(result.categories);

  return (
    <section className="mt-6 grid gap-4">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white">Your LaunchPad Score</h2>
        <p className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
          {displayScore}
          <span className="text-base font-medium text-zinc-600">/100</span>
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white"
          style={{
            width: barsReady ? `${total}%` : "0%",
            transition: "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      <div className="space-y-2">
        {breakdown.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
            style={{
              animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.08}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${statusDot[item.status]}`} />
              <span className="text-sm tracking-tight text-zinc-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${statusBar[item.status]}`}
                  style={{
                    width: barsReady ? `${(item.value / item.max) * 100}%` : "0%",
                    transition: `width 700ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + index * 100}ms`,
                  }}
                />
              </div>
              <span className="w-10 text-right text-xs tracking-tight text-zinc-500 tabular-nums">
                {item.value}/{item.max}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed tracking-tight text-zinc-400">{result.summary}</p>

      <p className="text-xs tracking-tight text-zinc-600">
        Tip: strengthen role-specific keywords to improve ATS relevance.
      </p>
    </section>
  );
}
