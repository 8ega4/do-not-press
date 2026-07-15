import { DecisionHistory } from "@/components/DecisionHistory";
import { QuestionCard } from "@/components/QuestionCard";
import { ShareButton } from "@/components/ShareButton";
import { getVoteOutcome, VoteResult } from "@/components/VoteResult";
import { buildQuestionResultShareText } from "@/lib/share";
import { questionShareUrl } from "@/lib/url";
import type { PlayHistory, Question, VoteChoice, VoteStats } from "@/types/game";

const ANSWER_LABEL: Record<VoteChoice, string> = { press: "押した", dont_press: "押さなかった", timeout: "時間切れ" };

type Props = {
  question: Question;
  choice: VoteChoice;
  stats: VoteStats;
  history: PlayHistory;
  onNext: () => void;
};

export function AnswerScreen({ question, choice, stats, history, onNext }: Props) {
  const outcome = getVoteOutcome(stats, choice);
  const shareText = buildQuestionResultShareText({
    benefit: question.benefit,
    consequence: question.consequence,
    choice,
    outcome,
  });
  const shareUrl = questionShareUrl(question.id);
  return (
    <div className="screen screen--answer">
      <DecisionHistory history={history} />
      <header className="section-rule"><span />ANSWER RESULT<span /></header>
      <QuestionCard question={question} variant="result" />
      <section className="answer-choice" aria-label={`あなたの回答は${ANSWER_LABEL[choice]}`}>
        <span>あなたは</span>
        <strong className={choice === "press" ? "text-red" : ""}>「{ANSWER_LABEL[choice]}」</strong>
      </section>
      <VoteResult stats={stats} choice={choice} />
      <div className="screen-actions">
        <button type="button" className="action-button action-button--primary" onClick={onNext}>次の問題<span aria-hidden="true">→</span></button>
        <ShareButton text={shareText} url={shareUrl} />
      </div>
    </div>
  );
}
