import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addAnswerToHistory, EMPTY_PLAY_HISTORY, PLAY_HISTORY_STORAGE_KEY, readPlayHistory, savePlayHistory } from "@/lib/playHistory";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("play history", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("stores personal progress separately from vote statistics", () => {
    const question = { id: "q001", benefit: "利益", consequence: "代償", category: "仕事", active: true };
    const history = addAnswerToHistory(EMPTY_PLAY_HISTORY, question, "press");
    savePlayHistory(history);
    expect(storage.values.has(PLAY_HISTORY_STORAGE_KEY)).toBe(true);
    expect(JSON.parse(storage.getItem(PLAY_HISTORY_STORAGE_KEY) ?? "{}").version).toBe(1);
    expect(readPlayHistory()).toEqual(history);
  });

  it("counts timeouts separately and does not duplicate answered IDs", () => {
    const question = { id: "q001", benefit: "利益", consequence: "代償", category: "仕事", active: true };
    const first = addAnswerToHistory(EMPTY_PLAY_HISTORY, question, "timeout");
    const second = addAnswerToHistory(first, question, "dont_press");
    expect(second).toMatchObject({ answeredQuestionIds: ["q001"], dontPressCount: 1, timeoutCount: 1, totalAnswered: 2 });
  });
});
