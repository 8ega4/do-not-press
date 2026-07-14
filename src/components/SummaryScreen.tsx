import { ShareButton } from "@/components/ShareButton";
import { resultShareUrl } from "@/lib/url";
import { buildSummaryShareText } from "@/lib/share";
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
  const resultText = buildSummaryShareText(answers.length, pressCount, playerType.title);
  const url = resultShareUrl();
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
        <ShareButton text={resultText} url={url} />
      </div>
    </div>
  );
}
