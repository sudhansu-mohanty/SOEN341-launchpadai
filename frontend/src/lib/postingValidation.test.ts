import { describe, expect, it } from "vitest";
import { todayString, validatePosting, type PostingForm } from "./postingValidation";

const NOW = new Date(2026, 10, 16, 12, 0, 0); // 16 Nov 2026, local time

const validForm: PostingForm = {
  title: "Frontend Developer",
  company: "Acme",
  location: "Montreal, QC",
  workplace_type: "remote",
  description: "Build the UI.",
  deadline: "",
};

describe("todayString", () => {
  it("formats the date as YYYY-MM-DD with zero padding", () => {
    expect(todayString(new Date(2026, 10, 5))).toBe("2026-11-05");
  });
});

describe("validatePosting", () => {
  it("accepts a valid form with no deadline", () => {
    expect(validatePosting(validForm, NOW)).toEqual({});
  });

  it("reports every required field when the form is empty", () => {
    const errors = validatePosting(
      { title: "", company: "", location: "", workplace_type: "", description: "", deadline: "" },
      NOW
    );
    expect(Object.keys(errors).sort()).toEqual(
      ["company", "description", "location", "title", "workplace_type"]
    );
  });

  it("treats whitespace-only text as empty", () => {
    const errors = validatePosting({ ...validForm, title: "   ", description: "  " }, NOW);
    expect(errors.title).toBeDefined();
    expect(errors.description).toBeDefined();
  });

  it("rejects a deadline in the past", () => {
    const errors = validatePosting({ ...validForm, deadline: "2026-11-15" }, NOW);
    expect(errors.deadline).toBeDefined();
  });

  it("accepts a deadline of today", () => {
    expect(validatePosting({ ...validForm, deadline: "2026-11-16" }, NOW)).toEqual({});
  });

  it("accepts a deadline in the future", () => {
    expect(validatePosting({ ...validForm, deadline: "2026-12-01" }, NOW)).toEqual({});
  });
});