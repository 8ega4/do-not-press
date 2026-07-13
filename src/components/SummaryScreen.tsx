import { ShareButton } from "@/components/ShareButton";
import type { GameAnswer, PlayerType } from "@/types/game";

type Props = {
  answers: GameAnswer[];
  pressCount: number;
  dontPressCount: number;
  timeoutCount: number;
  playerType: PlayerType;
  onRestart: () => void;
};

export function SummaryScreen({ answers, pressCount, dontPressCount, timeoutCount, playerType, onRestart }: Props) {
  const resultText = `『絶対に押すな』で${answers.length}つの決断。\n押した ${pressCount}回 / 押さなかった ${dontPressCount}回${timeoutCount ? ` / 時間切れ ${timeoutCount}回` : ""}\nタイプは「${playerType.title}」でした。`;
  const url = typeof window === "undefined" ? "/" : window.location.origin;
  return (
    <div className="screen screen--summary">
      <header className="section-rule"><span />SUMMARY<span /></header>
      <h1>3つの決断が終了</h1>
      <section className="summary-counts" aria-label="回答の内訳">
        <div><span className="text-red">押した</span><strong className="text-red">{pressCount}</strong></div>
        <div><span>押さなかった</span><strong>{dontPressCount}</strong></div>
        {timeoutCount > 0 && <div><span>時間切れ</span><strong>{timeoutCount}</strong></div>}
      </section>
      <section className="player-type"><h2>{playerType.title}</h2><p>{playerType.description}</p></section>
      <div className="screen-actions">
        <button type="button" className="action-button action-button--primary" onClick={onRestart}>もう一度遊ぶ<span aria-hidden="true">↻</span></button>
        <ShareButton title="絶対に押すな｜診断結果" text={resultText} url={url} label="結果を共有" />
        <ShareButton title="絶対に押すな" text="この3問、あなたなら押す？『絶対に押すな』に挑戦してみて。" url={url} label="友達に挑戦させる" />
      </div>
    </div>
  );
}
