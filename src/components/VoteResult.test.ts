import { describe, expect, it } from "vitest";
import { getPercentages } from "@/components/VoteResult";

describe("vote percentages", () => {
  it("excludes timeouts from the press ratio", () => {
    expect(getPercentages({ pressCount: 68, dontPressCount: 32, timeoutCount: 20, totalCount: 120, source: "local" })).toEqual({ pressPercent: 68, dontPressPercent: 32 });
  });

  it("returns an even split when there are no decisions", () => {
    expect(getPercentages({ pressCount: 0, dontPressCount: 0, timeoutCount: 3, totalCount: 3, source: "local" })).toEqual({ pressPercent: 50, dontPressPercent: 50 });
  });
});
