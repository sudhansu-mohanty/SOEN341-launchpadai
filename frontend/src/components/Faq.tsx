"use client";

import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const items = [
  {
    q: "How accurate is the ATS score?",
    a: "The score estimates ATS readiness using structure, keyword relevance, and clarity signals. It is directional, not a hiring guarantee.",
  },
  {
    q: "Do you store my resume data?",
    a: "Uploaded resumes are processed for analysis, and you can choose to remove saved data from your workspace at any time.",
  },
  {
    q: "Can I target a specific role?",
    a: "Yes. You can tune wording and keyword focus for a role so the feedback emphasizes role-fit signals recruiters usually scan for.",
  },
  {
    q: "What file formats are supported?",
    a: "The analyzer currently supports PDF uploads to preserve layout consistency and improve parsing reliability.",
  },
  {
    q: "How fast is the analysis?",
    a: "Most resumes return a scored breakdown and summary in seconds, depending on file complexity and API availability.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <section className="relative rounded-xl border border-white/5 bg-black p-6 sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-6 space-y-3">
          {items.map((item, index) => {
            const expanded = openIndex === index;
            return (
              <article
                key={item.q}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  expanded ? "border-white/15 bg-white/[0.03]" : "border-white/5 bg-transparent hover:border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(expanded ? null : index)}
                  aria-expanded={expanded}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold tracking-tight text-white">{item.q}</span>
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-lg text-zinc-500 transition-transform duration-300"
                    style={{
                      transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: expanded ? "200px" : "0",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed tracking-tight text-zinc-500">
                    {item.a}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
