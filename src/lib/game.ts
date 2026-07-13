import type { GameAnswer, PlayerType, Question, VoteChoice } from "@/types/game";

export const GAME_LENGTH = 3;

export function buildQuestionSequence(
  allQuestions: Question[],
  firstQuestionId?: string,
  random: () => number = Math.random,
) {
  const active = allQuestions.filter((question) => question.active);
  const first = firstQuestionId
    ? active.find((question) => question.id === firstQuestionId)
    : undefined;
  const pool = active.filter((question) => question.id !== first?.id);

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [pool[index], pool[target]] = [pool[target], pool[index]];
  }

  return [...(first ? [first] : []), ...pool].slice(0, GAME_LENGTH);
}

export function getPlayerType(pressCount: number): PlayerType {
  if (pressCount === 3) return { title: "欲望フルスロットル", description: "迷いよりも可能性を選ぶ、一直線な決断でした。" };
  if (pressCount === 2) return { title: "攻めの決断者", description: "代償を見極めながら、勝負どころでは押すタイプ。" };
  if (pressCount === 1) return { title: "慎重な冒険者", description: "基本は堅実。でも一度だけ誘惑に賭けました。" };
  return { title: "鉄壁の理性", description: "どんなメリットにも、冷静さを手放しませんでした。" };
}

export function summarizeAnswers(answers: GameAnswer[]) {
  const pressCount = answers.filter((answer) => answer.choice === "press").length;
  const dontPressCount = answers.filter((answer) => answer.choice === "dont_press").length;
  const timeoutCount = answers.filter((answer) => answer.choice === "timeout").length;

  return { pressCount, dontPressCount, timeoutCount, playerType: getPlayerType(pressCount) };
}

export function reactionFor(choice: VoteChoice, seed: number) {
  const messages = {
    press: ["欲望に正直ですね", "その覚悟、嫌いじゃない", "代償より利益を選びました", "あなたは押した側です"],
    dont_press: ["慎重派ですね", "誘惑に勝ちました", "その代償は重すぎたようです", "あなたは押さない側です"],
    timeout: ["決めきれないのも、ひとつの答えです", "5秒では選べませんでした", "迷っている間に時間切れです", "今回は見送りになりました"],
  } satisfies Record<VoteChoice, string[]>;
  const choices = messages[choice];
  return choices[Math.abs(seed) % choices.length];
}
