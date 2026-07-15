import type { PlayHistory, Question } from "@/types/game";

type SelectNextQuestionOptions = {
  questions: Question[];
  answeredQuestionIds: string[];
  lastQuestionId?: string;
  lastCategory?: string;
  random?: () => number;
};

export function rolloverAnsweredQuestions(history: PlayHistory, allQuestions: Question[]) {
  const activeIds = allQuestions.filter((question) => question.active).map((question) => question.id);
  const answered = new Set(history.answeredQuestionIds);
  if (activeIds.length > 0 && activeIds.every((id) => answered.has(id))) {
    return { ...history, answeredQuestionIds: [] };
  }
  return history;
}

export function selectNextQuestion({
  questions,
  answeredQuestionIds,
  lastQuestionId,
  lastCategory,
  random = Math.random,
}: SelectNextQuestionOptions) {
  const active = questions.filter((question) => question.active);
  if (active.length === 0) throw new Error("表示できる問題がありません。");

  const answered = new Set(answeredQuestionIds);
  const unanswered = active.filter((question) => !answered.has(question.id));
  let candidates = unanswered.length > 0 ? unanswered : active;

  const withoutPrevious = candidates.filter((question) => question.id !== lastQuestionId);
  if (withoutPrevious.length > 0) candidates = withoutPrevious;

  const differentCategory = candidates.filter((question) => question.category !== lastCategory);
  if (differentCategory.length > 0) candidates = differentCategory;

  const totalWeight = candidates.reduce((sum, question) => sum + Math.max(1, question.priority ?? 1), 0);
  let position = random() * totalWeight;
  for (const question of candidates) {
    position -= Math.max(1, question.priority ?? 1);
    if (position < 0) return question;
  }
  return candidates[candidates.length - 1];
}
