// Search result returned by the edge function from SerpAPI
export type RawResult = { title?: string; link?: string; snippet?: string };
//A single person from the search results
export type NetworkContact = { name: string; headline: string; url: string; category: "hiring" | "peer" };

// The two people shown on the netwroking page ( one hiring person and one peer )
export type NetworkResult = {
    hiring: NetworkContact | null;
    peer: NetworkContact | null;
};

// Making sure the link is a profile url
const LINKEDIN_PROFILE = /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^/?#]+/i;

// Removes a trailing " | LinkedIn" from a search result title (any case, any spacing).
// Done step by step instead of with a regex so long titles can't make it slow.
function stripLinkedInSuffix(title: string): string {
  const trimmed = title.trimEnd();
  if (trimmed.slice(-8).toLowerCase() !== "linkedin") return title;
  const beforeWord = trimmed.slice(0, -8).trimEnd();
  if (!beforeWord.endsWith("|")) return title;
  return beforeWord.slice(0, -1).trimEnd();
}

// if its LinkedIn profile, splits into name, headline and url
// ex: "Jane Doe - Talent Acquisition - Company name"
// null of the result is not a profile
export function parseContact(raw: RawResult, category: NetworkContact["category"]): NetworkContact | null {
  if (!raw.link || !LINKEDIN_PROFILE.test(raw.link)) return null;
  const parts = stripLinkedInSuffix(raw.title ?? "").split(" - ").map((s) => s.trim()).filter(Boolean);
  if (!parts[0]) return null;
  return { name: parts[0], headline: parts.slice(1).join(" · "), url: raw.link, category };
}

//Goes through the raw results and returns the first LinkedIn PROFILE
export function pickFirst(results: RawResult[], category: NetworkContact["category"]): NetworkContact | null {
  for (const r of results) {
    const c = parseContact(r, category);
    if (c) return c;
  }
  return null;
}

//NO reliable results: builds a useful google search link that the user can open 
export function fallbackSearchUrl(company: string, title: string): string {
  const q = `site:linkedin.com/in "${company}" "${cleanTitle(title)}"`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}


// Turn the job title to something clean and simple for searching
// ex.: "Software Developer I (Full Time) - Canada" -> "Software Developer"
export function cleanTitle(title: string): string {
  return title
    .replace(/\(.*?\)/g, "")            // drop "(Full Time)"
    .replace(/\s[-–—|].*$/, "")         // drop " - Canada"
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+(I{1,3}|IV|V|\d)$/i, "") // drop trailing level: I, II, III
    .trim();
}


// Calls the network-contacts Edge Function that picks one hiring contact and one peer.
// Returns null (rather than throwing) on any failure so the page can tell
// "something went wrong" (null) from "no profiles found" (both fields null)
export async function fetchNetworkContacts(company: string, title: string): Promise<NetworkResult | null> {
  try {
    // for unit test to not need supabase
    const { supabase } = await import("@/lib/supabase"); // loaded only when called, so tests don't need it
    const { data, error } = await supabase.functions.invoke("network-contacts", {
      body: { company, title: cleanTitle(title) },
    });
    // The response must have hiring and peers list, otherwise -> failure
    if (error || !data || !Array.isArray(data.hiring) || !Array.isArray(data.peers)) return null;

    const hiring = pickFirst(data.hiring as RawResult[], "hiring");
    // Avoid showing the same person twice
    const peers = (data.peers as RawResult[]).filter((r) => r.link !== hiring?.url);
    const peer = pickFirst(peers, "peer");

    return { hiring, peer };
  } catch {
    return null;
  }
}