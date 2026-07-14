import type { VoteStats } from "@/types/game";

export function getPercentages(stats: VoteStats) {
  const decisions = stats.pressCount + stats.dontPressCount;
  if (decisions === 0) return { pressPercent: 0, dontPressPercent: 0 };
  const pressPercent = Math.round((stats.pressCount / decisions) * 100);
  return { pressPercent, dontPressPercent: 100 - pressPercent };
}

export function VoteResult({ stats }: { stats: VoteStats }) {
  const { pressPercent, dontPressPercent } = getPercentages(stats);
  return (
    <section className="vote-result" aria-label="みんなの回答結果">
      <div className="vote-result__numbers">
        <div><span>押した</span><strong className="text-red">{pressPercent}<small>%</small></strong></div>
        <div><span>押さなかった</span><strong>{dontPressPercent}<small>%</small></strong></div>
      </div>
      <div className="vote-bar" aria-label={`押した${pressPercent}%、押さなかった${dontPressPercent}%`}>
        <span className="vote-bar__press" style={{ width: `${pressPercent}%` }} />
        <span className="vote-bar__dont" style={{ width: `${dontPressPercent}%` }} />
      </div>
      {stats.pressCount + stats.dontPressCount === 0 && <p className="vote-result__empty">まだ有効な回答はありません</p>}
      <p className="vote-result__total">{stats.totalCount.toLocaleString("ja-JP")}票</p>
      <p className="vote-result__source">{stats.source === "local" ? "ローカル集計モード" : "リアルタイム集計"}</p>
    </section>
  );
}
