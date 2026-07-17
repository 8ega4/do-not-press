import type { VoteChoice, VoteOutcome } from "@/types/game";

export type XShareData = {
  text: string;
  url: string;
};

export type ShareSource = "x" | "threads" | "line" | "native" | "copy";

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

export function withShareSource(url: string, source: ShareSource) {
  const sharedUrl = new URL(url);
  sharedUrl.searchParams.set("utm_source", source);
  return sharedUrl.toString();
}

export function buildThreadsIntentUrl({ text, url }: XShareData) {
  const params = new URLSearchParams({ text: `${text}\n${url}` });
  return `https://www.threads.net/intent/post?${params.toString()}`;
}

export function buildLineShareUrl({ text, url }: XShareData) {
  const params = new URLSearchParams({ url, text });
  return `https://social-plugins.line.me/lineit/share?${params.toString()}`;
}

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openXShare(data: XShareData) {
  openShareWindow(buildXIntentUrl(data));
}

export function openThreadsShare(data: XShareData) {
  openShareWindow(buildThreadsIntentUrl(data));
}

export function openLineShare(data: XShareData) {
  openShareWindow(buildLineShareUrl(data));
}

export async function shareWithDevice({ text, url }: XShareData) {
  if (!window.navigator.share) return false;
  await window.navigator.share({ text, url });
  return true;
}

export async function copyShareLink(url: string) {
  if (window.navigator.clipboard?.writeText) {
    await window.navigator.clipboard.writeText(url);
    return;
  }

  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("リンクをコピーできませんでした。");
}
