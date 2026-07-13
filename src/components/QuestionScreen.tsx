import { Countdown } from "@/components/Countdown";
import { EmergencyButton } from "@/components/EmergencyButton";
import { QuestionCard } from "@/components/QuestionCard";
import type { Question, VoteChoice } from "@/types/game";

type Props = {
  question: Question;
  index: number;
  answeredCount: number;
  pending: boolean;
  error: string | null;
  onAnswer: (choice: VoteChoice) => void;
  onRetry: () => void;
};

export function QuestionScreen({ question, index, answeredCount, pending, error, onAnswer, onRetry }: Props) {
  return (
    <div className="screen screen--question">
      <header className="progress-header">
        <p>QUESTION <strong>{String(index + 1).padStart(2, "0")}</strong> / 03</p>
        <div className="progress-lines" aria-hidden="true">{[0, 1, 2].map((item) => <span key={item} className={item <= index ? "active" : ""} />)}</div>
      </header>
      <QuestionCard question={question} />
      <EmergencyButton disabled={pending} onClick={() => onAnswer("press")} label="赤いボタンを押す" />
      <div className="choice-row">
        <button type="button" className="choice-button choice-button--press" disabled={pending} onClick={() => onAnswer("press")}>押す</button>
        <button type="button" className="choice-button" disabled={pending} onClick={() => onAnswer("dont_press")}>押さない</button>
      </div>
      {error && <div className="error-message" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>再試行</button></div>}
      <footer className="question-footer">
        <Countdown key={question.id} onComplete={() => onAnswer("timeout")} />
        <div><span>連続回答</span><strong>{answeredCount}</strong></div>
      </footer>
      {pending && <p className="sending-status" role="status">回答を送信中…</p>}
    </div>
  );
}
