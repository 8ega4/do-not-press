import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTotalVotes, LOCAL_VOTE_STATS_KEY, submitVote } from "@/lib/votes";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("local vote storage", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("starts at zero without mock votes", async () => {
    await expect(getTotalVotes()).resolves.toBe(0);
  });

  it("stores one real vote using the problem-based schema", async () => {
    await expect(submitVote("q001", "press")).resolves.toEqual({
      pressCount: 1,
      dontPressCount: 0,
      timeoutCount: 0,
      totalCount: 1,
      source: "local",
    });
    expect(JSON.parse(storage.getItem(LOCAL_VOTE_STATS_KEY) ?? "{}")).toEqual({
      q001: { press: 1, dontPress: 0, timeout: 0 },
    });
  });

  it("persists votes and keeps question totals separate", async () => {
    await submitVote("q001", "press");
    await submitVote("q001", "dont_press");
    const secondQuestion = await submitVote("q002", "timeout");

    expect(JSON.parse(storage.getItem(LOCAL_VOTE_STATS_KEY) ?? "{}")).toEqual({
      q001: { press: 1, dontPress: 1, timeout: 0 },
      q002: { press: 0, dontPress: 0, timeout: 1 },
    });
    expect(secondQuestion).toMatchObject({ pressCount: 0, dontPressCount: 0, timeoutCount: 1, totalCount: 1 });
    await expect(getTotalVotes()).resolves.toBe(3);
  });
});
