import { describe, expect, it } from "vitest";
import { questions } from "@/data/questions";
import { rolloverAnsweredQuestions, selectNextQuestion } from "@/lib/game";
import { addAnswerToHistory, EMPTY_PLAY_HISTORY } from "@/lib/playHistory";
import type { PlayHistory, Question } from "@/types/game";

const sampleQuestions: Question[] = [
  { id: "a", benefit: "A", consequence: "a", category: "お金・成功", active: true },
  { id: "b", benefit: "B", consequence: "b", category: "恋愛", active: true },
  { id: "c", benefit: "C", consequence: "c", category: "仕事", active: true },
  { id: "d", benefit: "D", consequence: "d", category: "くだらない代償", active: true },
];

describe("endless question selection", () => {
  it("prioritizes unanswered questions and avoids the previous question and category", () => {
    const question = selectNextQuestion({
      questions: sampleQuestions,
      answeredQuestionIds: ["a"],
      lastQuestionId: "a",
      lastCategory: "恋愛",
      random: () => 0,
    });
    expect(question.id).toBe("c");
  });

  it("starts a new round only after every active question was answered", () => {
    const completed: PlayHistory = {
      ...EMPTY_PLAY_HISTORY,
      answeredQuestionIds: sampleQuestions.map((question) => question.id),
      lastQuestionId: "d",
      lastCategory: "くだらない代償",
    };
    expect(rolloverAnsweredQuestions(completed, sampleQuestions).answeredQuestionIds).toEqual([]);
    expect(rolloverAnsweredQuestions({ ...completed, answeredQuestionIds: ["a", "b"] }, sampleQuestions).answeredQuestionIds).toEqual(["a", "b"]);
  });

  it("continues beyond ten decisions without an end condition or immediate duplicate", () => {
    let history: PlayHistory = EMPTY_PLAY_HISTORY;
    let previousId: string | undefined;
    for (let index = 0; index < 12; index += 1) {
      history = rolloverAnsweredQuestions(history, sampleQuestions);
      const question = selectNextQuestion({
        questions: sampleQuestions,
        answeredQuestionIds: history.answeredQuestionIds,
        lastQuestionId: history.lastQuestionId,
        lastCategory: history.lastCategory,
        random: () => 0,
      });
      expect(question.id).not.toBe(previousId);
      history = addAnswerToHistory(history, question, index % 2 === 0 ? "press" : "dont_press");
      previousId = question.id;
    }
    expect(history.totalAnswered).toBe(12);
    expect(history.pressCount).toBe(6);
    expect(history.dontPressCount).toBe(6);
  });

  it("never selects inactive questions", () => {
    const question = selectNextQuestion({
      questions: [...sampleQuestions, { id: "off", benefit: "OFF", consequence: "off", category: "未来", active: false, priority: 99 }],
      answeredQuestionIds: ["a", "b", "c"],
      random: () => 0.99,
    });
    expect(question.id).toBe("d");
  });

  it("serves every published question once before rolling over", () => {
    let history: PlayHistory = EMPTY_PLAY_HISTORY;
    const seen = new Set<string>();
    const activeQuestions = questions.filter((question) => question.active);
    for (let index = 0; index < activeQuestions.length; index += 1) {
      const available = questions.filter((item) => item.active && !history.answeredQuestionIds.includes(item.id));
      const hasDifferentCategory = available.some((item) => item.category !== history.lastCategory);
      const question = selectNextQuestion({
        questions,
        answeredQuestionIds: history.answeredQuestionIds,
        lastQuestionId: history.lastQuestionId,
        lastCategory: history.lastCategory,
        random: () => 0.37,
      });
      expect(seen.has(question.id)).toBe(false);
      if (history.lastCategory && hasDifferentCategory) expect(question.category).not.toBe(history.lastCategory);
      seen.add(question.id);
      history = addAnswerToHistory(history, question, "press");
    }
    expect(seen.size).toBe(activeQuestions.length);
    const rolled = rolloverAnsweredQuestions(history, questions);
    expect(rolled.answeredQuestionIds).toEqual([]);
    expect(selectNextQuestion({
      questions,
      answeredQuestionIds: rolled.answeredQuestionIds,
      lastQuestionId: rolled.lastQuestionId,
      lastCategory: rolled.lastCategory,
      random: () => 0,
    }).id).not.toBe(rolled.lastQuestionId);
  });

  it("keeps 108 active questions balanced across twelve categories", () => {
    const counts = new Map<string, number>();
    for (const question of questions.filter((item) => item.active)) {
      counts.set(question.category, (counts.get(question.category) ?? 0) + 1);
    }
    expect(questions.filter((question) => question.active)).toHaveLength(108);
    expect(counts.size).toBe(12);
    expect([...counts.values()]).toEqual(Array.from({ length: 12 }, () => 9));
  });
});
