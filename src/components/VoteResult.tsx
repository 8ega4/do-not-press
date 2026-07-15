import type { VoteChoice, VoteOutcome, VoteStats } from "@/types/game";

export const MIN_VOTES_FOR_MAJORITY_LABEL = 5;

export function getPercentages(stats: VoteStats) {
  const decisions = stats.pressCount + stats.dontPressCount;
  if (decisions === 0) return { pressPercent: 0, dontPressPercent: 0 };
  const pressPercent = Math.round((stats.pressCount / decisions) * 100);
  return { pressPercent, dontPressPercent: 100 - pressPercent };
}

export function getVoteOutcome(stats: VoteStats, choice: VoteChoice): VoteOutcome {
  const { pressPercent, dontPressPercent } = getPercentages(stats);
  const validVotes = stats.pressCount + stats.dontPressCount;
  if (choice === "timeout") {
    return { status: "timeout", label: "今回は時間切れです", sameAnswerPercent: null };
  }

  const sameAnswerPercent = choice === "press" ? pressPercent : dontPressPercent;
  if (validVotes === 1) {
    return { status: "first", label: "最初の回答者です", sameAnswerPercent };
  }
  if (validVotes < MIN_VOTES_FOR_MAJORITY_LABEL) {
    return { status: "insufficient", label: "まだ回答が集まっていません", sameAnswerPercent };
  }
  if (sameAnswerPercent === 50) {
    return { status: "split", label: "意見が真っ二つです", sameAnswerPercent };
  }
  if (sameAnswerPercent > 50) {
    return { status: "majority", label: "あなたは多数派です", sameAnswerPercent };
  }
  return { status: "minority", label: "あなたは少数派です", sameAnswerPercent };
}

export function VoteResult({ stats, choice }: { stats: VoteStats; choice: VoteChoice }) {
  const { pressPercent, dontPressPercent } = getPercentages(stats);
  const outcome = getVoteOutcome(stats, choice);
  const validVotes = stats.pressCount + stats.dontPressCount;
  return (
    <section className="vote-result" aria-label="みんなの回答結果">
      <h2>みんなの選択</h2>
      <div className="vote-result__row">
        <span>押す</span>
        <div className="vote-meter" aria-hidden="true"><span className="vote-meter__press" style={{ width: `${pressPercent}%` }} /></div>
        <strong className="text-red">{pressPercent}<small>%</small></strong>
      </div>
      <div className="vote-result__row">
        <span>押さない</span>
        <div className="vote-meter" aria-hidden="true"><span className="vote-meter__dont" style={{ width: `${dontPressPercent}%` }} /></div>
        <strong>{dontPressPercent}<small>%</small></strong>
      </div>
      <p className={`vote-outcome vote-outcome--${outcome.status}`}>{outcome.label}</p>
      <p className="vote-result__total">有効回答 {validVotes.toLocaleString("ja-JP")}票</p>
      <p className="vote-result__source">{stats.source === "local" ? "ローカル集計モード" : "リアルタイム集計"}</p>
    </section>
  );
}
