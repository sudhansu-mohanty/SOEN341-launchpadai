"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Navbar from "@/components/Navbar";

type ResumeFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
};

export default function ResumeUploadPage() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (resumes.some((r) => r.name === file.name)) {
      setError("A file with this name already exists.");
      return;
    }

    setError("");
    setResumes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      },
    ]);
  };

  const removeFile = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) addFile(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 pt-24 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-white">My Resumes</h1>
        <p className="mt-2 text-sm tracking-tight text-zinc-500">
          Upload and manage your resume files. Supported format: PDF.
        </p>

        {/* Upload zone */}
        <div className="mt-8">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-all ${
              dragging
                ? "border-white/40 bg-white/5 shadow-lg shadow-white/5"
                : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
            />

            <div className="mb-3 text-zinc-600">
              <svg
                className="mx-auto h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            <p className="text-sm tracking-tight text-zinc-300">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs tracking-tight text-zinc-600">PDF only</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300">
            {error}
          </div>
        )}

        {/* File list */}
        {resumes.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
              Uploaded Resumes
            </h2>
            <div className="grid gap-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium tracking-tight text-white">
                        {resume.name}
                      </p>
                      <p className="text-xs tracking-tight text-zinc-600">
                        {formatSize(resume.size)} &middot;{" "}
                        {resume.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(resume.id)}
                    className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-white/5 hover:text-red-400"
                    title="Remove resume"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {resumes.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm tracking-tight text-zinc-600">
              No resumes uploaded yet. Upload your first resume to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
