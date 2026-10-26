import { createClient } from "jsr:@supabase/supabase-js@2";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ExternalJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  workplace_type: "remote" | "hybrid" | "in_person";
  posted_by: string;
  created_at: string;
  source: "external";
  apply_url?: string;
};

function guessWorkplaceType(text: string): "remote" | "hybrid" | "in_person" {
  const lower = text.toLowerCase();
  if (lower.includes("remote")) return "remote";
  if (lower.includes("hybrid")) return "hybrid";
  return "in_person";
}

// Sanitizes a raw SerpAPI google_jobs result into our Job shape.
function mapJob(raw: any): ExternalJob {
  const extensions: string[] = raw.detected_extensions
    ? Object.values(raw.detected_extensions).map(String)
    : [];
  const applyUrl: string | undefined =
    raw.apply_options?.[0]?.link ?? raw.related_links?.[0]?.link ?? undefined;

  return {
    id: `serpapi-${raw.job_id}`,
    title: raw.title,
    company: raw.company_name,
    location: raw.location,
    description: raw.description ?? "",
    workplace_type: guessWorkplaceType([raw.title ?? "", ...extensions].join(" ")),
    posted_by: "serpapi",
    created_at: new Date().toISOString(),
    source: "external",
    apply_url: applyUrl,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { q, location } = await req.json();
    const query = typeof q === "string" && q.trim() ? q.trim() : "software developer jobs";
    const loc = typeof location === "string" && location.trim() ? location.trim() : "Canada";
    const queryKey = `${query.toLowerCase()}|${loc.toLowerCase()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: cached } = await supabase
      .from("external_job_cache")
      .select("results, fetched_at")
      .eq("query_key", queryKey)
      .maybeSingle();

    if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cached.results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SERPAPI_API_KEY");
    if (!apiKey) {
      throw new Error("SERPAPI_API_KEY is not configured");
    }

    const serpUrl = new URL("https://serpapi.com/search.json");
    serpUrl.searchParams.set("engine", "google_jobs");
    serpUrl.searchParams.set("q", `${query} in ${loc}`);
    serpUrl.searchParams.set("google_domain", "google.com");
    serpUrl.searchParams.set("hl", "en");
    serpUrl.searchParams.set("api_key", apiKey);

    const serpRes = await fetch(serpUrl.toString());
    if (!serpRes.ok) {
      throw new Error(`SerpAPI request failed: ${serpRes.status}`);
    }
    const serpData = await serpRes.json();
    const jobs: ExternalJob[] = Array.isArray(serpData.jobs_results)
      ? serpData.jobs_results.map(mapJob)
      : [];

    await supabase
      .from("external_job_cache")
      .upsert({ query_key: queryKey, results: jobs, fetched_at: new Date().toISOString() });

    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch external jobs" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
