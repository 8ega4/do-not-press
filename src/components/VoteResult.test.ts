import { describe, expect, it } from "vitest";
import { getPercentages, getVoteOutcome } from "@/components/VoteResult";

describe("vote percentages", () => {
  it("excludes timeouts from the press ratio", () => {
    expect(getPercentages({ pressCount: 68, dontPressCount: 32, timeoutCount: 20, totalCount: 120, source: "local" })).toEqual({ pressPercent: 68, dontPressPercent: 32 });
  });

  it("returns zeroes when there are no decisions", () => {
    expect(getPercentages({ pressCount: 0, dontPressCount: 0, timeoutCount: 3, totalCount: 3, source: "local" })).toEqual({ pressPercent: 0, dontPressPercent: 0 });
  });

  it("labels majority, minority, and split using valid votes only", () => {
    const stats = { pressCount: 7, dontPressCount: 3, timeoutCount: 20, totalCount: 30, source: "local" as const };
    expect(getVoteOutcome(stats, "press")).toMatchObject({ status: "majority", sameAnswerPercent: 70 });
    expect(getVoteOutcome(stats, "dont_press")).toMatchObject({ status: "minority", sameAnswerPercent: 30 });
    expect(getVoteOutcome({ ...stats, pressCount: 5, dontPressCount: 5 }, "press").status).toBe("split");
  });

  it("avoids strong labels for the first response and small samples", () => {
    const base = { timeoutCount: 0, source: "local" as const };
    expect(getVoteOutcome({ ...base, pressCount: 1, dontPressCount: 0, totalCount: 1 }, "press").status).toBe("first");
    expect(getVoteOutcome({ ...base, pressCount: 3, dontPressCount: 1, totalCount: 4 }, "press").status).toBe("insufficient");
    expect(getVoteOutcome({ ...base, pressCount: 3, dontPressCount: 1, totalCount: 4 }, "timeout").status).toBe("timeout");
  });
});
