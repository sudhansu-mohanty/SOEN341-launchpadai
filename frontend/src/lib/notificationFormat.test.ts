import { describe, it, expect } from "vitest";
import { timeAgo, unreadBadge } from "./notificationFormat";

const now = new Date("2026-11-10T12:00:00Z");

describe("timeAgo", () => {
  it("shows Just now under a minute", () => {
    expect(timeAgo("2026-11-10T11:59:30Z", now)).toBe("Just now");
  });

  it("shows minutes, hours and days", () => {
    expect(timeAgo("2026-11-10T11:45:00Z", now)).toBe("15m ago");
    expect(timeAgo("2026-11-10T09:00:00Z", now)).toBe("3h ago");
    expect(timeAgo("2026-11-08T12:00:00Z", now)).toBe("2d ago");
  });

  it("falls back to a date after a week", () => {
    const old = "2026-10-20T12:00:00Z";
    expect(timeAgo(old, now)).toBe(new Date(old).toLocaleDateString());
  });
});

describe("unreadBadge", () => {
  it("is empty with nothing unread", () => {
    expect(unreadBadge(0)).toBe("");
  });

  it("shows the count up to 9", () => {
    expect(unreadBadge(9)).toBe("9");
  });

  it("caps at 9+", () => {
    expect(unreadBadge(10)).toBe("9+");
  });
});
