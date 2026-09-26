"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreResult } from "./ScoreCard";
import { useScore, ScoreData } from "@/context/ScoreContext";

type Props = {
  onResult: (result: ScoreResult) => void;
  onError: (message: string) => void;
  onScored?: (result: ScoreResult) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_URL = `${API_BASE}/resume/extract`;

type Status = "idle" | "dragging" | "uploading" | "error";

export default function ResumeUploader({ onResult, onError, onScored }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setData } = useScore();

  const setError = (message: string) => {
    setStatus("error");
    setErrorMessage(message);
    onError(message);
  };

  const validatePdf = (candidate: File | null): candidate is File => {
    if (!candidate) {
      setError("Please select one PDF file.");
      return false;
    }
    const nameLooksPdf = candidate.name.toLowerCase().endsWith(".pdf");
    const isPdfType = candidate.type === "application/pdf";
    if (!isPdfType && !nameLooksPdf) {
      setError("Only PDF files are allowed.");
      return false;
    }
    return true;
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    if (!validatePdf(picked)) return;
    setFile(picked);
    setStatus("idle");
    setErrorMessage("");
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status !== "uploading") setStatus("dragging");
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status !== "uploading") setStatus(errorMessage ? "error" : "idle");
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status === "uploading") return;
    const dropped = event.dataTransfer.files?.[0] ?? null;
    if (!validatePdf(dropped)) return;
    setFile(dropped);
    setStatus("idle");
    setErrorMessage("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePdf(file)) return;
    const formData = new FormData();
    formData.append("file", file);

    setStatus("uploading");
    setErrorMessage("");
    let hasError = false;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ detail: "Upload failed" }));
        setError(payload.detail ?? "Upload failed");
        hasError = true;
        return;
      }
      const raw = await response.json();

      const payload: ScoreResult = {
        filename: raw.filename,
        total_score: raw.score,
        summary: raw.summary,
        strengths: raw.strengths || [],
        weaknesses: raw.weaknesses || [],
        categories: {
          skills: raw.skills_score,
          experience: raw.experience_score,
          projects: raw.projects_score,
          education: raw.education_score,
          impact: raw.impact_score,
          formatting: raw.formatting_score,
        },
      };

      setData(raw as ScoreData);
      onResult(payload);
      onScored?.(payload);
      setStatus("idle");
      router.push("/score");
    } catch {
      setError("Scoring service is currently unavailable. You can continue in demo mode.");
      hasError = true;
    } finally {
      if (!hasError) setStatus("idle");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label htmlFor="resume" className="text-sm font-semibold tracking-tight text-white">
        Resume PDF
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (status !== "uploading") inputRef.current?.click();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`cursor-pointer rounded-xl border border-dashed p-8 text-center transition-all ${
          status === "dragging"
            ? "border-white/40 bg-white/5 shadow-lg shadow-white/5"
            : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
        } ${status === "uploading" ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          id="resume"
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          disabled={status === "uploading"}
          className="hidden"
        />

        <div className="mb-3 text-zinc-600">
          <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-sm tracking-tight text-zinc-300">
          {file ? file.name : "Click to upload or drag and drop"}
        </p>
        <p className="mt-1 text-xs tracking-tight text-zinc-600">PDF only, one file at a time</p>
      </div>

      <button
        type="submit"
        disabled={status === "uploading"}
        className="rounded-lg bg-white px-5 py-3 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "uploading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Scoring...
          </span>
        ) : (
          "Upload and Score"
        )}
      </button>

      {status === "error" && errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
