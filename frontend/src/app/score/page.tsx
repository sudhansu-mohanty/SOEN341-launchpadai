"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useScore } from "@/context/ScoreContext";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "overview" | "breakdown" | "resume";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "breakdown", label: "Score Breakdown" },
  { id: "resume", label: "Resume Details" },
];

function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
  const displayScore = useAnimatedNumber(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {displayScore}
        </span>
        <span className="text-xs tracking-tight text-zinc-500">/100</span>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data } = useScore();
  if (!data) return null;

  const profile = data.structured_resume;
  const quickStats = [
    { label: "Skills", value: data.skills_score, max: 25 },
    { label: "Experience", value: data.experience_score, max: 25 },
    { label: "Projects", value: data.projects_score, max: 20 },
    { label: "Formatting", value: data.formatting_score, max: 10 },
  ];

  return (
    <div className="grid gap-4" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {(profile?.name?.[0] ?? data.filename?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  {profile?.name || "Candidate"}
                </h3>
                <p className="text-xs tracking-tight text-zinc-500">
                  {profile?.email || data.analysis?.email || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs tracking-tight text-zinc-400">
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600">Phone</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">File</span>
                <span>{data.filename}</span>
              </div>
            </div>

            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 8).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs tracking-tight text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs tracking-tight text-zinc-500">
                    +{profile.skills.length - 8}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-black p-6">
            <span className="mb-4 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              LaunchPad Score
            </span>
            <ScoreRing score={data.score} />
            <p className="mt-4 text-center text-sm tracking-tight text-zinc-400">
              {data.score >= 80
                ? "Strong resume — recruiter-ready."
                : data.score >= 60
                  ? "Good foundation — a few improvements will push it higher."
                  : "Needs work — focus on the breakdown to improve."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickStats.map((stat, i) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border border-white/[0.08] p-1"
            style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s both` }}
          >
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
            <div className="relative rounded-xl border border-white/5 bg-black p-4 text-center">
              <p className="text-2xl font-extrabold tracking-tight text-white tabular-nums">
                {stat.value}<span className="text-sm font-medium text-zinc-600">/{stat.max}</span>
              </p>
              <p className="mt-1 text-xs tracking-tight text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {data.highlights && data.highlights.length > 0 && (
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-white">Highlights</h3>
            <div className="space-y-2">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm tracking-tight text-zinc-400">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/40" />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BreakdownTab() {
  const { data } = useScore();
  if (!data) return null;

  const categories = [
    { label: "Skills", value: data.skills_score, max: 25 },
    { label: "Experience", value: data.experience_score, max: 25 },
    { label: "Projects", value: data.projects_score, max: 20 },
    { label: "Education", value: data.education_score, max: 10 },
    { label: "Impact", value: data.impact_score, max: 10 },
    { label: "Formatting", value: data.formatting_score, max: 10 },
  ];

  return (
    <div className="grid gap-4" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-black p-8">
            <ScoreRing score={data.score} size={160} />
            <p className="mt-3 text-xs tracking-tight text-zinc-500">{data.filename}</p>
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Category Scores</h3>
            <div className="space-y-3">
              {categories.map((cat, i) => {
                const ratio = cat.value / cat.max;
                const barColor = ratio >= 0.7 ? "bg-white" : ratio >= 0.45 ? "bg-zinc-400" : "bg-zinc-600";
                const dotColor = ratio >= 0.7 ? "bg-white" : ratio >= 0.45 ? "bg-zinc-400" : "bg-zinc-600";

                return (
                  <div
                    key={cat.label}
                    style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s both` }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                        <span className="text-sm tracking-tight text-zinc-300">{cat.label}</span>
                      </div>
                      <span className="text-xs tracking-tight text-zinc-500 tabular-nums">
                        {cat.value}/{cat.max}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{
                          width: `${ratio * 100}%`,
                          transition: `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Strengths</h3>
            {data.strengths && data.strengths.length > 0 ? (
              <div className="space-y-2.5">
                {data.strengths.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                    style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s both` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                      +
                    </span>
                    <span className="text-sm leading-relaxed tracking-tight text-zinc-300">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm tracking-tight text-zinc-600">No strengths data available.</p>
            )}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Areas to Improve</h3>
            {data.weaknesses && data.weaknesses.length > 0 ? (
              <div className="space-y-2.5">
                {data.weaknesses.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                    style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s both` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                      !
                    </span>
                    <span className="text-sm leading-relaxed tracking-tight text-zinc-300">{w}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm tracking-tight text-zinc-600">No improvement data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ResumeSubTab = "summary" | "experience" | "skills" | "education";

const resumeSubTabs: { id: ResumeSubTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

function ResumeDetailsTab() {
  const { data } = useScore();
  const [subTab, setSubTab] = useState<ResumeSubTab>("summary");

  if (!data) return null;

  const profile = data.structured_resume;

  return (
    <div style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="relative rounded-2xl border border-white/[0.08] p-1">
        <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
        <div className="relative rounded-xl border border-white/5 bg-black p-6">
          <div className="mb-6 flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
            {resumeSubTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-xs font-semibold tracking-tight transition-all ${
                  subTab === t.id
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ animation: "fade-in 0.3s ease both" }} key={subTab}>
            {subTab === "summary" && <SummarySubTab />}
            {subTab === "experience" && <ExperienceSubTab />}
            {subTab === "skills" && <SkillsSubTab />}
            {subTab === "education" && <EducationSubTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummarySubTab() {
  const { data } = useScore();
  if (!data) return null;
  const profile = data.structured_resume;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-white">
          {profile?.name || "Candidate"}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-tight text-zinc-500">
          {(profile?.email || data.analysis?.email) && (
            <span>{profile?.email || data.analysis?.email}</span>
          )}
          {(profile?.phone || data.analysis?.phone) && (
            <span>{profile?.phone || data.analysis?.phone}</span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-white/[0.06]" />

      <div>
        <p className="text-sm leading-relaxed tracking-tight text-zinc-400">
          {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Skills", count: profile?.skills?.length ?? 0 },
          { label: "Experience", count: Array.isArray(profile?.experience) ? profile.experience.length : 0 },
          { label: "Education", count: Array.isArray(profile?.education) ? profile.education.length : 0 },
          { label: "Certifications", count: Array.isArray(profile?.certification) ? profile.certification.length : 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-lg font-bold tracking-tight text-white tabular-nums">{item.count}</p>
            <p className="text-xs tracking-tight text-zinc-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSubTab() {
  const { data } = useScore();
  if (!data) return null;
  const entries = data.structured_resume?.experience;

  if (!Array.isArray(entries) || entries.length === 0) {
    return <p className="text-sm tracking-tight text-zinc-600">No experience data parsed.</p>;
  }

  return (
    <div className="space-y-3">
      {(entries as Record<string, unknown>[]).map((entry, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
          style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
        >
          <h4 className="text-sm font-semibold tracking-tight text-white">
            {String(entry.title || entry.role || entry.position || "Role")}
          </h4>
          <p className="mt-0.5 text-xs tracking-tight text-zinc-500">
            {String(entry.company || entry.organization || "")}
            {entry.duration || entry.dates || entry.date
              ? ` · ${String(entry.duration || entry.dates || entry.date)}`
              : ""}
          </p>
          {entry.description ? (
            <p className="mt-2 text-sm leading-relaxed tracking-tight text-zinc-400">
              {String(entry.description)}
            </p>
          ) : null}
          {Array.isArray(entry.responsibilities) && (
            <ul className="mt-2 space-y-1">
              {(entry.responsibilities as string[]).map((r, j) => (
                <li key={j} className="flex items-start gap-2 text-sm tracking-tight text-zinc-400">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-600" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsSubTab() {
  const { data } = useScore();
  if (!data) return null;

  const aiSkills = data.structured_resume?.skills ?? [];
  const detectedSkills = data.analysis?.skills ?? [];

  const allSkills = Array.from(
    new Set([...aiSkills, ...detectedSkills].map((s) => String(s)))
  );

  if (allSkills.length === 0) {
    return <p className="text-sm tracking-tight text-zinc-600">No skills data parsed.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {allSkills.map((skill, i) => (
          <span
            key={skill}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm tracking-tight text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            style={{ animation: `fade-up 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s both` }}
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs tracking-tight text-zinc-600">
        {allSkills.length} skill{allSkills.length !== 1 ? "s" : ""} detected across AI parsing and keyword analysis.
      </p>
    </div>
  );
}

function EducationSubTab() {
  const { data } = useScore();
  if (!data) return null;

  const entries = data.structured_resume?.education;
  const certs = data.structured_resume?.certification;

  return (
    <div className="space-y-4">
      {Array.isArray(entries) && entries.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Education</h4>
          {(entries as Record<string, unknown>[]).map((entry, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
            >
              <h4 className="text-sm font-semibold tracking-tight text-white">
                {String(entry.degree || entry.qualification || entry.title || "Degree")}
              </h4>
              <p className="mt-0.5 text-xs tracking-tight text-zinc-500">
                {String(entry.institution || entry.school || entry.university || "")}
                {entry.year || entry.dates || entry.date
                  ? ` · ${String(entry.year || entry.dates || entry.date)}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm tracking-tight text-zinc-600">No education data parsed.</p>
      )}

      {Array.isArray(certs) && certs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {certs.map((cert, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm tracking-tight text-zinc-300"
              >
                {typeof cert === "string" ? cert : String((cert as Record<string, unknown>).name || cert)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { data } = useScore();

  if (!data) {
    return (
      <main className="relative min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">No results yet</h1>
            <p className="mt-2 text-sm tracking-tight text-zinc-500">
              Upload a resume first to see your score.
            </p>
            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/20"
            >
              Go back
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-20 pb-10">
        <div className="mb-6" style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
          <span className="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Resume Analysis
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your Results
          </h1>
        </div>

        <div
          className="mb-8 flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1"
          style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold tracking-tight transition-all ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-sm shadow-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={activeTab}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "breakdown" && <BreakdownTab />}
          {activeTab === "resume" && <ResumeDetailsTab />}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm tracking-tight text-zinc-500 transition-colors hover:text-white"
          >
            &larr; Upload another resume
          </a>
        </div>

        <div className="mt-6">
          <Footer />
        </div>
      </div>
    </main>
  );
}
