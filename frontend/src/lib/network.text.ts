import { describe, it, expect } from "vitest";
import { cleanTitle, fallbackSearchUrl, parseContact, pickFirst, type RawResult } from "./network";

// A typical search result for a LinkedIn profile, reused by several tests
const profile: RawResult = {
  title: "Jane Doe - Talent Acquisition Partner - Cisco | LinkedIn",
  link: "https://ca.linkedin.com/in/jane-doe-123",
  snippet: "Montreal, Quebec · Talent Acquisition Partner · Cisco",
};

// parseContact: turns one search result into a contact, or null if it isn't a LinkedIn profile
describe("parseContact", () => {
  // The title is split into name and headline, and the link becomes the url
  it("splits a LinkedIn profile into name, headline and url", () => {
    expect(parseContact(profile, "hiring")).toEqual({
      name: "Jane Doe",
      headline: "Talent Acquisition Partner · Cisco",
      url: "https://ca.linkedin.com/in/jane-doe-123",
      category: "hiring",
    });
  });

  // The category ("hiring" or "peer") is passed through unchanged
  it("keeps the category it was given", () => {
    expect(parseContact(profile, "peer")?.category).toBe("peer");
  });

  // Profiles can be on linkedin.com or on a country version like ca.linkedin.com
  it("accepts the plain linkedin.com domain without a country prefix", () => {
    const r = { title: "John Smith - Developer | LinkedIn", link: "https://linkedin.com/in/john-smith" };
    expect(parseContact(r, "peer")?.name).toBe("John Smith");
  });

  // Search results often include job postings, which must not be shown as people
  it("rejects LinkedIn job postings", () => {
    const r = { title: "Software Developer - Cisco | LinkedIn", link: "https://www.linkedin.com/jobs/view/12345" };
    expect(parseContact(r, "peer")).toBeNull();
  });

  // Company pages are not people either
  it("rejects LinkedIn company pages", () => {
    const r = { title: "Cisco | LinkedIn", link: "https://www.linkedin.com/company/cisco" };
    expect(parseContact(r, "hiring")).toBeNull();
  });

  // Only linkedin.com links are accepted, even if the path looks like a profile
  it("rejects links from other websites", () => {
    const r = { title: "Jane Doe - Recruiter", link: "https://example.com/in/jane-doe" };
    expect(parseContact(r, "hiring")).toBeNull();
  });

  // A result with no link can't be opened, so it's skipped
  it("rejects a result with no link", () => {
    expect(parseContact({ title: "Jane Doe - Recruiter | LinkedIn" }, "hiring")).toBeNull();
  });

  // Without a title there is no name to show
  it("rejects a profile with no title", () => {
    expect(parseContact({ link: "https://www.linkedin.com/in/jane-doe" }, "hiring")).toBeNull();
  });

  // A title with only a name still works; the headline is just empty
  it("handles a title with no headline", () => {
    const r = { title: "Jane Doe | LinkedIn", link: "https://www.linkedin.com/in/jane-doe" };
    expect(parseContact(r, "hiring")).toEqual({
      name: "Jane Doe",
      headline: "",
      url: "https://www.linkedin.com/in/jane-doe",
      category: "hiring",
    });
  });
});

// pickFirst: goes through a list of results and returns the first real profile
describe("pickFirst", () => {
  // A job posting (not a profile) and a second valid profile, used as test data
  const job: RawResult = { title: "Developer - Cisco", link: "https://www.linkedin.com/jobs/view/1" };
  const second: RawResult = { title: "Sam Lee - Engineer | LinkedIn", link: "https://www.linkedin.com/in/sam-lee" };

  // When several profiles are in the list, the first one wins
  it("returns the first real profile in the list", () => {
    expect(pickFirst([profile, second], "hiring")?.name).toBe("Jane Doe");
  });

  // This is the situation we saw while testing: job postings come first
  it("skips non-profile results before the first profile", () => {
    expect(pickFirst([job, second], "peer")?.name).toBe("Sam Lee");
  });

  // Nothing usable in the list means the page shows "No public profile found"
  it("returns null when there are no profiles", () => {
    expect(pickFirst([job], "peer")).toBeNull();
  });

  // An empty search result must not crash
  it("returns null for an empty list", () => {
    expect(pickFirst([], "hiring")).toBeNull();
  });
});

// cleanTitle: turns a job-posting title into a simple role name for searching
describe("cleanTitle", () => {
  // The example that caused bad search results during testing
  it("turns a job-posting title into a plain role", () => {
    expect(cleanTitle("Software Developer I (Full Time) - Canada")).toBe("Software Developer");
  });

  // A title that is already simple should not be changed
  it("leaves a plain title unchanged", () => {
    expect(cleanTitle("Senior Data Engineer")).toBe("Senior Data Engineer");
  });

  // Level numbers at the end are removed so the search matches more people
  it("removes trailing levels like II and III", () => {
    expect(cleanTitle("Software Engineer II")).toBe("Software Engineer");
    expect(cleanTitle("Analyst III")).toBe("Analyst");
  });

  // Extra spaces at the start, end or middle are cleaned up
  it("collapses extra spaces", () => {
    expect(cleanTitle("  Product   Manager  ")).toBe("Product Manager");
  });

  // An empty title must not crash
  it("returns an empty string for an empty title", () => {
    expect(cleanTitle("")).toBe("");
  });
});

// fallbackSearchUrl: builds the Google link shown when no profiles are found
describe("fallbackSearchUrl", () => {
  // The link goes to Google, and the search uses the cleaned job title
  it("builds a Google search for LinkedIn profiles using the cleaned title", () => {
    const url = fallbackSearchUrl("Cisco", "Software Developer I (Full Time) - Canada");
    expect(url.startsWith("https://www.google.com/search?q=")).toBe(true);
    const q = decodeURIComponent(url.split("q=")[1]);
    expect(q).toBe('site:linkedin.com/in "Cisco" "Software Developer"');
  });

  // Characters like & must be encoded or they would break the link
  it("encodes special characters in the company name", () => {
    const url = fallbackSearchUrl("AT&T", "Developer");
    expect(url).not.toContain("&T");
    expect(decodeURIComponent(url.split("q=")[1])).toContain("AT&T");
  });
});