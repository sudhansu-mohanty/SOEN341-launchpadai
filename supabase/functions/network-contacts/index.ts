//  This whole file is heavily inspired by the code for job-search 
// as they utilise the same API tool

import { createClient } from "jsr:@supabase/supabase-js@2";

// Saved results are reused for 24 hours
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Lets the website call this fct from the browser
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

//Runs on google search through SerpAPI and returns title, link and snippet of each result
async function serp(q: string, apiKey: string) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", q);
  url.searchParams.set("num", "10");
  url.searchParams.set("api_key", apiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SerpAPI request failed: ${res.status}`);
  const data = await res.json();
  return (data.organic_results ?? []).map((r: any) => ({
    title: r.title, link: r.link, snippet: r.snippet,
  }));
}

Deno.serve(async (req) => {
  // Approve the browser OPTIONS pre-check
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    // read company name and job title from LaunchPadAI
    const { company, title } = await req.json();
    if (typeof company !== "string" || !company.trim()) throw new Error("company required");
    const co = company.trim();
    const jobTitle = typeof title === "string" ? title.trim() : "";
    // Label used to save and find this search in the cach, e.g. "cisco|software developer"
    const queryKey = `${co.toLowerCase()}|${jobTitle.toLowerCase()}`;

    // check cache first, if there return saved answer
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: cached } = await supabase.from("network_cache")
      .select("results, fetched_at").eq("query_key", queryKey).maybeSingle();
    if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cached.results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // SerpAPI key stored as supabase secret
    const apiKey = Deno.env.get("SERPAPI_API_KEY");
    if (!apiKey) throw new Error("SERPAPI_API_KEY is not configured");

    // Two searches: one for hiring contact, one for peer
    const hiring = await serp(`recruiter at ${co} LinkedIn profile`, apiKey);
    const peers = await serp(`${jobTitle} at ${co} LinkedIn profile`, apiKey);
    const results = { hiring, peers };

    // Save result in cache, then send to website
    await supabase.from("network_cache").upsert({ query_key: queryKey, results, fetched_at: new Date().toISOString() });
    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    // Log the real error for us, but send a generic message to the browser
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch contacts" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});