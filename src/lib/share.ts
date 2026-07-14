export type XShareData = {
  text: string;
  url: string;
};

export function buildQuestionShareText(benefit: string, consequence: string) {
  return `「${benefit}」\nただし\n「${consequence}」\nあなたは押す？押さない？\n#絶対に押すな`;
}

export function buildSummaryShareText(questionCount: number, pressCount: number, playerType: string) {
  return `『絶対に押すな』に挑戦！\n${questionCount}問中${pressCount}回、ボタンを押しました。\nタイプは「${playerType}」\nあなたなら押す？\n#絶対に押すな`;
}

export function buildXShareUrl({ text, url }: XShareData) {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function openXShare(data: XShareData) {
  window.open(buildXShareUrl(data), "_blank", "noopener,noreferrer");
}
