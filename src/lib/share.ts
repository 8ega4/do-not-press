import type { VoteChoice, VoteOutcome } from "@/types/game";

export type XShareData = {
  text: string;
  url: string;
};

const ANSWER_SHARE_LABEL: Record<VoteChoice, string> = {
  press: "押す",
  dont_press: "押さない",
  timeout: "時間切れ",
};

function buildOutcomeSentence(outcome: VoteOutcome) {
  if (outcome.status === "timeout") return "今回は時間内に決められませんでした。";
  const percentage = `同じ回答は${outcome.sameAnswerPercent ?? 0}％。`;
  if (outcome.status === "majority") return `${percentage}多数派でした。`;
  if (outcome.status === "minority") return `${percentage}少数派でした。`;
  if (outcome.status === "split") return `${percentage}意見は真っ二つでした。`;
  if (outcome.status === "first") return `${percentage}最初の回答者でした。`;
  return `${percentage}まだ回答は集まっていません。`;
}

export function buildQuestionResultShareText({
  benefit,
  consequence,
  choice,
  outcome,
}: {
  benefit: string;
  consequence: string;
  choice: VoteChoice;
  outcome: VoteOutcome;
}) {
  const answer = choice === "timeout"
    ? "私は「時間切れ」でした。"
    : `私は「${ANSWER_SHARE_LABEL[choice]}」を選びました。`;
  return `「${benefit}」\nただし\n「${consequence}」\n\n${answer}\n${buildOutcomeSentence(outcome)}\n\nあなたなら押す？\n\n#絶対に押すな`;
}

export function buildTopShareText() {
  return `『絶対に押すな』\nその代償、本当に払えますか？\nあなたなら押す？\n#絶対に押すな`;
}

export function buildXIntentUrl({ text, url }: XShareData) {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function openXShare(data: XShareData) {
  window.open(buildXIntentUrl(data), "_blank", "noopener,noreferrer");
}
