import { ShareButton } from "@/components/ShareButton";
import { VoteResult } from "@/components/VoteResult";
import { reactionFor } from "@/lib/game";
import { questionShareUrl } from "@/lib/url";
import type { Question, VoteChoice, VoteStats } from "@/types/game";

const ANSWER_LABEL: Record<VoteChoice, string> = { press: "押した", dont_press: "押さなかった", timeout: "時間切れ" };

type Props = {
  question: Question;
  choice: VoteChoice;
  stats: VoteStats;
  isLast: boolean;
  onNext: () => void;
};

export function AnswerScreen({ question, choice, stats, isLast, onNext }: Props) {
  const shareText = `${question.benefit}けど、${question.consequence}。\n\nあなたは押す？\n\n『絶対に押すな』`;
  const shareUrl = questionShareUrl(question.id);
  return (
    <div className="screen screen--answer">
      <header className="section-rule"><span />ANSWER RESULT<span /></header>
      <h1 className="answer-heading">あなたは<strong className={choice === "press" ? "text-red" : ""}>{ANSWER_LABEL[choice]}</strong></h1>
      <VoteResult stats={stats} />
      <p className="reaction"><span aria-hidden="true">△</span>{reactionFor(choice, stats.totalCount)}</p>
      <div className="screen-actions">
        <button type="button" className="action-button action-button--primary" onClick={onNext}>{isLast ? "結果を見る" : "次の問題"}<span aria-hidden="true">→</span></button>
        <ShareButton title="絶対に押すな" text={shareText} url={shareUrl} label="この問題を共有" />
      </div>
    </div>
  );
}
