import { Countdown } from "@/components/Countdown";
import { DecisionHistory } from "@/components/DecisionHistory";
import { EmergencyButton } from "@/components/EmergencyButton";
import { QuestionCard } from "@/components/QuestionCard";
import type { PlayHistory, Question, VoteChoice } from "@/types/game";

type Props = {
  question: Question;
  history: PlayHistory;
  pending: boolean;
  error: string | null;
  onAnswer: (choice: VoteChoice) => void;
  onRetry: () => void;
};

export function QuestionScreen({ question, history, pending, error, onAnswer, onRetry }: Props) {
  return (
    <div className="screen screen--question">
      <DecisionHistory history={history} next />
      <QuestionCard question={question} />
      <EmergencyButton disabled={pending} onClick={() => onAnswer("press")} label="赤いボタンを押す" />
      <div className="choice-row">
        <button type="button" className="choice-button choice-button--press" disabled={pending} onClick={() => onAnswer("press")}>押す</button>
        <button type="button" className="choice-button" disabled={pending} onClick={() => onAnswer("dont_press")}>押さない</button>
      </div>
      {error && <div className="error-message" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>再試行</button></div>}
      <footer className="question-footer">
        <Countdown key={question.id} onComplete={() => onAnswer("timeout")} />
        <div><span>時間切れ</span><strong>{history.timeoutCount}</strong></div>
      </footer>
      {pending && <p className="sending-status" role="status">回答を送信中…</p>}
    </div>
  );
}
