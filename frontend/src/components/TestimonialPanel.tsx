"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote: "LaunchPadAI helped me land three interviews in my first week. The resume feedback was spot on.",
    name: "Sarah Chen",
    role: "Software Engineer",
  },
  {
    quote: "I went from getting zero callbacks to hearing back from every application. Complete game-changer.",
    name: "Marcus Johnson",
    role: "Product Manager",
  },
  {
    quote: "The application tracker kept me organized through 40+ applications. I never lost track of a single one.",
    name: "Priya Patel",
    role: "Data Analyst",
  },
  {
    quote: "Best career tool I've used. The AI suggestions improved my resume score by 30 points overnight.",
    name: "James Rivera",
    role: "UX Designer",
  },
  {
    quote: "I recommended LaunchPadAI to my entire graduating class. It makes the job hunt so much less stressful.",
    name: "Emily Nguyen",
    role: "Marketing Coordinator",
  },
];

export default function TestimonialPanel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        setVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]" />

      <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
        <svg
          className="mb-6 h-8 w-8 text-zinc-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.19 11 15c0 1.934-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.19 21 15c0 1.934-1.567 3.5-3.5 3.5-1.073 0-2.099-.49-2.917-1.179z" />
        </svg>

        <div
          className="transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          <p className="text-base leading-relaxed tracking-tight text-zinc-300">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold tracking-tight text-white">
              {testimonial.name}
            </p>
            <p className="text-xs tracking-tight text-zinc-500">
              {testimonial.role}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-1.5">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
