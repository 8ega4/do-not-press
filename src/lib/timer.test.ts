import { describe, expect, it } from "vitest";
import { getRemainingSeconds, QUESTION_TIME_LIMIT_SECONDS } from "@/lib/timer";

describe("question timer", () => {
  it("uses a shared 10-second limit", () => {
    expect(QUESTION_TIME_LIMIT_SECONDS).toBe(10);
  });

  it("counts down from 10 through 0 without skipping display values", () => {
    const startedAt = 50_000;
    const deadline = startedAt + QUESTION_TIME_LIMIT_SECONDS * 1_000;
    const sequence = Array.from(
      { length: QUESTION_TIME_LIMIT_SECONDS + 1 },
      (_, elapsedSeconds) => getRemainingSeconds(deadline, startedAt + elapsedSeconds * 1_000),
    );

    expect(sequence).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("never returns a negative remaining time", () => {
    expect(getRemainingSeconds(10_000, 10_001)).toBe(0);
  });
});
