"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type JobRow = {
  id: string;
  title: string;
  location: string | null;
  status: string | null;
  created_at: string;
  applications: { count: number }[];
};

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, location, status, created_at, applications(count)")
        .eq("recruiter_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setJobs((data as unknown as JobRow[]) ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 pt-28">
        <h1 className="text-2xl font-bold tracking-tight">My Postings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your job postings and how many people applied to each.
        </p>

        <div className="mt-8 rounded-2xl border border-white/[0.08] p-1">
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black">
            {loading ? (
              <p className="p-8 text-zinc-500">Loading...</p>
            ) : error ? (
              <p className="p-8 text-red-400">Error: {error}</p>
            ) : jobs.length === 0 ? (
              <p className="p-8 text-zinc-500">You have no postings yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Posted</th>
                    <th className="p-4 font-medium">Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-white/5">
                      <td className="p-4">{job.title}</td>
                      <td className="p-4 text-zinc-400">{job.location ?? "-"}</td>
                      <td className="p-4 text-zinc-400">{job.status ?? "-"}</td>
                      <td className="p-4 text-zinc-400">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">{job.applications?.[0]?.count ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
