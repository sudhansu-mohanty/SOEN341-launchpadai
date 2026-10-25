import { describe, it, expect } from "vitest";
import { statusLabel, badgeClass } from "./applicationStatus";

describe("statusLabel", () => {
  it("capitalizes a plain status", () => {
    expect(statusLabel("applied")).toBe("Applied");
  });

  it("replaces underscores with spaces", () => {
    expect(statusLabel("under_review")).toBe("Under review");
  });
});

describe("badgeClass", () => {
  it("returns the yellow style for under review", () => {
    expect(badgeClass("under_review")).toContain("yellow");
  });

  it("accepts different spellings of the same status", () => {
    expect(badgeClass("Under Review")).toBe(badgeClass("under_review"));
  });

  it("falls back to the gray style for other statuses", () => {
    expect(badgeClass("applied")).toContain("bg-white/10");
  });
});