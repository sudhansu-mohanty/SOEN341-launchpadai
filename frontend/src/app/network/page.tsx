"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { fallbackSearchUrl, type NetworkContact } from "@/lib/network";
import { fetchNetworkContacts, type NetworkResult } from "@/lib/network";

//Information of one person to network with
//name, job title (headline), LinkedIn profile button (url)
function ContactCard({ label, contact }: { label: string; contact: NetworkContact | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">{label}</p>
      {contact ? (
        <>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-white">{contact.name}</h3>
          {contact.headline && (
            <p className="mt-1 text-sm tracking-tight text-zinc-400">{contact.headline}</p>
          )}
          {/**opens the profile in a new tab */}
          <a
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black transition-colors hover:bg-zinc-200"
          >
            View LinkedIn profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </>
      ) : (
        // if no profile is found for this category
        <p className="mt-2 text-sm tracking-tight text-zinc-500">
          No public profile found for this category.
        </p>
      )}
    </div>
  );
}

function NetworkContent() {
  // Job company and title from the URL ( set by Network button )
  const params = useSearchParams();
  const company = params.get("company") ?? "";
  const title = params.get("title") ?? "";

  // loading => waiting for results, error=> failed, done=> results came
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [result, setResult] = useState<NetworkResult | null>(null);

  // Fetch the contacts when the page opens
  useEffect(() => {
    if (!company) return;
    let cancelled = false;
    fetchNetworkContacts(company, title).then((r) => {
      if (cancelled) return;
      if (r === null) {
        setStatus("error");
      } else {
        setResult(r);
        setStatus("done");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [company, title]);

  // opened /network without choosing a job first (url extension)
  if (!company) {
    return <p className="text-sm text-zinc-400">No job selected. Go back and pick a job first.</p>;
  }

  // no results in either category
  const nothingFound = status === "done" && !result?.hiring && !result?.peer;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Network at {company}</h1>
      <p className="mt-1 text-sm tracking-tight text-zinc-400">For the role: {title}</p>

      {/* Waiting for the search */}
      {status === "loading" && (
        <p className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Finding people to reach out to…
        </p>
      )}

      {/* Failed */}
      {status === "error" && (
        <p className="mt-8 text-sm text-amber-400">Something went wrong while searching.</p>
      )}

      {/* Two card: hiring person and peer in similar role */}
      {status === "done" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ContactCard label="Hiring contact" contact={result?.hiring ?? null} />
          <ContactCard label="Someone in a similar role" contact={result?.peer ?? null} />
        </div>
      )}

      {/* Backup: if nobody is found or search fails -> lets user search on google themselves */}
      {(status === "error" || nothingFound) && (
        <a
          href={fallbackSearchUrl(company, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-white underline underline-offset-4"
        >
          Search LinkedIn profiles on Google
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {/* legal protection lol */}
      <p className="mt-10 text-xs tracking-tight text-zinc-600">
        Profiles come from public search results and may be out of date. Verify before contacting.
      </p>
    </>
  );
}

export default function NetworkPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl px-5 pt-24 pb-16">
        <Link
          href="/find-jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-tight text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        {/* Required: useSearchParams needs Suspense in a static export */}
        <Suspense fallback={<p className="text-sm text-zinc-400">Loading…</p>}>
          <NetworkContent />
        </Suspense>
      </div>
    </main>
  );
}