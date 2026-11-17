import { describe, expect, it } from "vitest";
import { canApply, canSeekerSee, postingTab } from "./postingVisibility";

const ARCHIVED = "2026-11-16T14:30:00+00:00";

describe("postingTab", () => {
  it("puts an open, non-archived posting in Active", () => {
    expect(postingTab({ status: "open", archived_at: null })).toBe("active");
  });
  it("puts a closed, non-archived posting in Closed", () => {
    expect(postingTab({ status: "closed", archived_at: null })).toBe("closed");
  });
  it("puts an archived open posting in Archived", () => {
    expect(postingTab({ status: "open", archived_at: ARCHIVED })).toBe("archived");
  });
  it("keeps an archived closed posting in Archived", () => {
    expect(postingTab({ status: "closed", archived_at: ARCHIVED })).toBe("archived");
  });
});

describe("canSeekerSee", () => {
  const job = { archived_at: null, posted_by: "recruiter-1" };
  const archived = { archived_at: ARCHIVED, posted_by: "recruiter-1" };

  it("shows a non-archived posting to any seeker, even if it is closed", () => {
    expect(canSeekerSee(job, "seeker-1", false)).toBe(true);
  });
  it("hides an archived posting from a seeker who did not apply", () => {
    expect(canSeekerSee(archived, "seeker-1", false)).toBe(false);
  });
  it("shows an archived posting to the recruiter who posted it", () => {
    expect(canSeekerSee(archived, "recruiter-1", false)).toBe(true);
  });
  it("shows an archived posting to a seeker who already applied", () => {
    expect(canSeekerSee(archived, "seeker-1", true)).toBe(true);
  });
});

describe("canApply", () => {
  it("allows applying to an open, non-archived posting", () => {
    expect(canApply({ status: "open", archived_at: null })).toBe(true);
  });
  it("rejects applying to a closed posting", () => {
    expect(canApply({ status: "closed", archived_at: null })).toBe(false);
  });
  it("rejects applying to an archived posting", () => {
    expect(canApply({ status: "open", archived_at: ARCHIVED })).toBe(false);
  });
});