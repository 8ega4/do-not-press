import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";
import { buildQuestionSequence, getPlayerType, summarizeAnswers } from "@/lib/game";

describe("game logic", () => {
  it("builds a unique three-question sequence", () => {
    const sequence = buildQuestionSequence(questions, undefined, () => 0.3);
    expect(sequence).toHaveLength(3);
    expect(new Set(sequence.map((question) => question.id)).size).toBe(3);
  });

  it("keeps a shared question first", () => {
    expect(buildQuestionSequence(questions, "q009", () => 0.5)[0]?.id).toBe("q009");
  });

  it("summarizes press, do-not-press, and timeout answers", () => {
    const summary = summarizeAnswers([
      { questionId: "q001", choice: "press" },
      { questionId: "q002", choice: "dont_press" },
      { questionId: "q003", choice: "timeout" },
    ]);
    expect(summary).toMatchObject({ pressCount: 1, dontPressCount: 1, timeoutCount: 1 });
    expect(summary.playerType.title).toBe("慎重な冒険者");
  });

  it.each([[3, "欲望フルスロットル"], [2, "攻めの決断者"], [1, "慎重な冒険者"], [0, "鉄壁の理性"]])("maps %i presses to a player type", (count, title) => {
    expect(getPlayerType(count).title).toBe(title);
  });
});
