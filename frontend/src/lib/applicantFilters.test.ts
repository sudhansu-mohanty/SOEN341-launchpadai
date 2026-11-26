import { describe, expect, it } from "vitest";
import { filterAndSortApplicants } from "./applicantFilters";

const make = (id: string, status: string, created_at: string) => ({ id, status, created_at });

const applicants = [
  make("a", "Applied", "2026-11-12T10:00:00+00:00"),
  make("b", "Under Review", "2026-11-10T10:00:00+00:00"),
  make("c", "Interview", "2026-11-11T10:00:00+00:00"),
  make("d", "Applied", "2026-11-08T10:00:00+00:00"),
  make("e", "Rejected", "2026-11-09T10:00:00+00:00"),
];

const ids = (list: { id: string }[]) => list.map((a) => a.id);

describe("filterAndSortApplicants: status filter", () => {
  it("shows everyone when no status is ticked", () => {
    expect(ids(filterAndSortApplicants(applicants, [], "newest"))).toEqual(["a", "c", "b", "e", "d"]);
  });
  it("keeps only applicants with the ticked status", () => {
    expect(ids(filterAndSortApplicants(applicants, ["Applied"], "newest"))).toEqual(["a", "d"]);
  });
  it("keeps applicants with any of several ticked statuses", () => {
    expect(ids(filterAndSortApplicants(applicants, ["Applied", "Interview"], "newest"))).toEqual(["a", "c", "d"]);
  });
  it("returns an empty list when no applicant has the ticked status", () => {
    expect(filterAndSortApplicants(applicants, ["Offered"], "newest")).toEqual([]);
  });
  it("returns an empty list when there are no applicants", () => {
    expect(filterAndSortApplicants([], ["Applied"], "oldest")).toEqual([]);
  });
});

describe("filterAndSortApplicants: date sort", () => {
  it("puts the most recent application first with newest", () => {
    expect(ids(filterAndSortApplicants(applicants, [], "newest"))).toEqual(["a", "c", "b", "e", "d"]);
  });
  it("puts the oldest application first with oldest", () => {
    expect(ids(filterAndSortApplicants(applicants, [], "oldest"))).toEqual(["d", "e", "b", "c", "a"]);
  });
});

describe("filterAndSortApplicants: filter and sort together", () => {
  it("sorts only the applicants that match the ticked statuses", () => {
    expect(ids(filterAndSortApplicants(applicants, ["Applied", "Interview"], "oldest"))).toEqual(["d", "c", "a"]);
  });
  it("does not change the original list", () => {
    const copy = [...applicants];
    filterAndSortApplicants(applicants, ["Applied"], "oldest");
    expect(applicants).toEqual(copy);
  });
});