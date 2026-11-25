import { describe, it, expect, vi } from "vitest";

// jobs.ts imports the Supabase client, which needs real keys; these tests don't use it
vi.mock("@/lib/supabase", () => ({ supabase: {} }));

import type { Job } from "@/types";
import { getLocations } from "./jobs";

// Builds a job where only the location matters
const at = (location: string) => ({ location }) as Job;

describe("getLocations", () => {
  it("lists each location once", () => {
    expect(getLocations([at("Toronto, ON"), at("Montreal, QC"), at("Toronto, ON")])).toEqual([
      "Montreal, QC",
      "Toronto, ON",
    ]);
  });

  it("sorts alphabetically regardless of capital letters", () => {
    expect(getLocations([at("vancouver"), at("Montreal"), at("ottawa"), at("Calgary")])).toEqual([
      "Calgary",
      "Montreal",
      "ottawa",
      "vancouver",
    ]);
  });

  it("returns an empty list when there are no jobs", () => {
    expect(getLocations([])).toEqual([]);
  });
});
