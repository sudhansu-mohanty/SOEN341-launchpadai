import { describe, it, expect, vi } from "vitest";

// applications.ts imports the Supabase client, which needs real keys; these tests don't use it
vi.mock("@/lib/supabase", () => ({ supabase: {} }));

import { EMPTY_APPLICANT, isValidEmail, validateApplicant, type ApplicantForm } from "./applications";

// A fully filled-in apply form, changed field by field in the tests
const valid: ApplicantForm = {
  first_name: "Jane",
  last_name: "Doe",
  email: "jane.doe@gmail.com",
  phone: "+1 (514) 555-0123",
  degree: "BEng Software Engineering",
  country: "Canada",
  authorized_to_work_ca: "yes",
  requires_sponsorship: "no",
};

describe("isValidEmail", () => {
  it("accepts normal email addresses", () => {
    expect(isValidEmail("jane.doe@gmail.com")).toBe(true);
    expect(isValidEmail("jane+jobs@mail.concordia.ca")).toBe(true);
    expect(isValidEmail("a@b.c")).toBe(true);
  });

  it("rejects an address without an @ or with more than one", () => {
    expect(isValidEmail("jane.gmail.com")).toBe(false);
    expect(isValidEmail("jane@@gmail.com")).toBe(false);
    expect(isValidEmail("jane@gmail@com.ca")).toBe(false);
  });

  it("rejects an address with nothing before the @", () => {
    expect(isValidEmail("@gmail.com")).toBe(false);
  });

  it("rejects a domain without a dot that has text on both sides", () => {
    expect(isValidEmail("jane@gmail")).toBe(false);
    expect(isValidEmail("jane@.com")).toBe(false);
    expect(isValidEmail("jane@gmail.")).toBe(false);
  });

  it("rejects an address with spaces", () => {
    expect(isValidEmail("jane doe@gmail.com")).toBe(false);
    expect(isValidEmail("jane@gmail .com")).toBe(false);
  });

  it("stays fast on very long input", () => {
    const start = Date.now();
    expect(isValidEmail("a@" + ".".repeat(100000))).toBe(true);
    expect(Date.now() - start).toBeLessThan(100);
  });
});

describe("validateApplicant", () => {
  it("returns no errors for a complete form", () => {
    expect(validateApplicant(valid)).toEqual({});
  });

  it("asks for every required field on an empty form", () => {
    expect(Object.keys(validateApplicant(EMPTY_APPLICANT)).sort()).toEqual(
      Object.keys(EMPTY_APPLICANT).sort()
    );
  });

  it("asks for a valid email when the email is malformed", () => {
    expect(validateApplicant({ ...valid, email: "jane@gmail" }).email).toBe("Enter a valid email address.");
  });

  it("ignores spaces around a valid email", () => {
    expect(validateApplicant({ ...valid, email: "  jane@gmail.com  " }).email).toBeUndefined();
  });

  it("rejects a phone number with too few digits", () => {
    expect(validateApplicant({ ...valid, phone: "555-12" }).phone).toBe("Enter a valid phone number.");
  });
});
