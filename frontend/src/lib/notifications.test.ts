import { describe, it, expect, vi, beforeEach } from "vitest";

// A fake Supabase client: just enough of the Realtime API for subscribeToNotifications
const { fakeChannel, removeChannel } = vi.hoisted(() => {
  const fakeChannel = {
    on: vi.fn(),
    subscribe: vi.fn(),
  };
  fakeChannel.on.mockReturnValue(fakeChannel);
  fakeChannel.subscribe.mockReturnValue(fakeChannel);
  return { fakeChannel, removeChannel: vi.fn() };
});

vi.mock("@/lib/supabase", () => ({
  supabase: { channel: () => fakeChannel, removeChannel },
}));

import { subscribeToNotifications } from "./notifications";

describe("subscribeToNotifications", () => {
  beforeEach(() => {
    removeChannel.mockReset();
    fakeChannel.on.mockClear();
  });

  it("only listens for new notifications of the signed-in user", () => {
    subscribeToNotifications("user-1", () => {});
    expect(fakeChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      expect.objectContaining({ event: "INSERT", table: "notifications", filter: "user_id=eq.user-1" }),
      expect.any(Function)
    );
  });

  it("passes each new notification to the callback", () => {
    const onInsert = vi.fn();
    subscribeToNotifications("user-1", onInsert);
    const handler = fakeChannel.on.mock.calls[0][2];
    handler({ new: { id: "n1", title: "Interview invitation" } });
    expect(onInsert).toHaveBeenCalledWith({ id: "n1", title: "Interview invitation" });
  });

  it("removes the channel when it stops listening", async () => {
    removeChannel.mockResolvedValue("ok");
    const stop = subscribeToNotifications("user-1", () => {});
    stop();
    expect(removeChannel).toHaveBeenCalledWith(fakeChannel);
  });

  it("logs the error instead of crashing when removing the channel fails", async () => {
    const error = new Error("connection lost");
    removeChannel.mockRejectedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    subscribeToNotifications("user-1", () => {})();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(log).toHaveBeenCalledWith("Could not stop listening for notifications:", error);
    log.mockRestore();
  });
});
