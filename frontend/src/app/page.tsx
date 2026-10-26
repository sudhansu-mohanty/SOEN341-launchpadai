"use client";

import { useState } from "react";
// import Faq from "../components/Faq";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
// import RecruiterShowcase from "../components/RecruiterShowcase";
import ResumeUploader from "../components/ResumeUploader";
import ScoreCard, { ScoreResult } from "../components/ScoreCard";
import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function HomePage() {
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [, setError] = useState<string>("");

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <HeroSection />

      <div className="relative z-10 mx-auto max-w-5xl px-5 divide-y divide-white/[0.06]">
        {/* How it works */}
        <section className="py-10">
          <span className="mb-3 block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            How it works
          </span>
          <h2 className="mb-10 max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
            From sign-up to hired in four steps
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Create account",
                detail: "Sign up in seconds and set up your career profile.",
              },
              {
                step: "02",
                title: "Browse & apply",
                detail: "Search jobs, apply directly, and track every application.",
              },
              {
                step: "03",
                title: "Upload resume",
                detail: "Upload your PDF resume to keep it ready for applications.",
              },
              {
                step: "04",
                title: "Get AI feedback",
                detail: "Get AI-powered resume scoring and improvement suggestions.",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-white/[0.08] p-1">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="relative h-full rounded-xl border border-white/5 bg-black p-6">
                  <span className="mb-4 block text-4xl font-extrabold tracking-tight text-white">
                    {item.step}
                  </span>
                  <h3 className="mb-2 text-sm font-semibold tracking-tight text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed tracking-tight text-zinc-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload section */}
        <section id="upload" className="py-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Drop your resume here
          </h2>
          <div className="relative rounded-2xl border border-white/[0.08] p-1">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative rounded-xl border border-white/5 bg-black p-6 sm:p-8">
              <ResumeUploader
                onResult={(next) => {
                  setResult(next);
                  setError("");
                }}
                onError={(message) => {
                  setResult(null);
                  setError(message);
                }}
              />
              {result && <ScoreCard result={result} />}
            </div>
          </div>
        </section>

        {/* Recruiter showcase */}
        {/* <section className="py-10">
          <RecruiterShowcase />
        </section> */}

        {/* FAQ */}
        {/* <section className="py-10">
          <Faq />
        </section> */}

        {/* CTA */}
        <section className="py-10">
          <div className="relative rounded-2xl border border-white/[0.08] p-1">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative rounded-xl border border-white/5 bg-black bg-gradient-to-br from-white/[0.03] to-transparent p-10 text-center sm:p-14">
              <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Ready to take control of your job search
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your next opportunity starts here
              </h2>
              <p className="mx-auto mt-3 max-w-lg tracking-tight text-zinc-500">
                Upload your resume, track applications, and get AI-powered insights to land your
                dream role faster.
              </p>
              <Link
                href="/register"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/20"
              >
                Create free account
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
