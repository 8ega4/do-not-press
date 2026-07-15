import type { PlayHistory, Question, VoteChoice } from "@/types/game";

export const PLAY_HISTORY_STORAGE_KEY = "do-not-press-play-history";
const PLAY_HISTORY_VERSION = 1;

export const EMPTY_PLAY_HISTORY: PlayHistory = {
  answeredQuestionIds: [],
  pressCount: 0,
  dontPressCount: 0,
  timeoutCount: 0,
  totalAnswered: 0,
};

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function readPlayHistory(): PlayHistory {
  try {
    const stored = window.localStorage.getItem(PLAY_HISTORY_STORAGE_KEY);
    if (!stored) return EMPTY_PLAY_HISTORY;
    const parsed = JSON.parse(stored) as Partial<PlayHistory> & { version?: number };
    if (
      parsed.version !== PLAY_HISTORY_VERSION ||
      !Array.isArray(parsed.answeredQuestionIds) ||
      !parsed.answeredQuestionIds.every((id) => typeof id === "string") ||
      !isCount(parsed.pressCount) ||
      !isCount(parsed.dontPressCount) ||
      !isCount(parsed.timeoutCount) ||
      !isCount(parsed.totalAnswered)
    ) {
      return EMPTY_PLAY_HISTORY;
    }
    return {
      answeredQuestionIds: [...new Set(parsed.answeredQuestionIds)],
      pressCount: parsed.pressCount,
      dontPressCount: parsed.dontPressCount,
      timeoutCount: parsed.timeoutCount,
      totalAnswered: parsed.totalAnswered,
      ...(typeof parsed.lastQuestionId === "string" ? { lastQuestionId: parsed.lastQuestionId } : {}),
      ...(typeof parsed.lastCategory === "string" ? { lastCategory: parsed.lastCategory } : {}),
    };
  } catch {
    return EMPTY_PLAY_HISTORY;
  }
}

export function savePlayHistory(history: PlayHistory) {
  try {
    window.localStorage.setItem(PLAY_HISTORY_STORAGE_KEY, JSON.stringify({ version: PLAY_HISTORY_VERSION, ...history }));
  } catch {
    // 履歴を保存できなくても、現在のプレイは続行できる。
  }
}

export function addAnswerToHistory(
  history: PlayHistory,
  question: Question,
  choice: VoteChoice,
): PlayHistory {
  return {
    answeredQuestionIds: history.answeredQuestionIds.includes(question.id)
      ? history.answeredQuestionIds
      : [...history.answeredQuestionIds, question.id],
    pressCount: history.pressCount + (choice === "press" ? 1 : 0),
    dontPressCount: history.dontPressCount + (choice === "dont_press" ? 1 : 0),
    timeoutCount: history.timeoutCount + (choice === "timeout" ? 1 : 0),
    totalAnswered: history.totalAnswered + 1,
    lastQuestionId: question.id,
    lastCategory: question.category,
  };
}
