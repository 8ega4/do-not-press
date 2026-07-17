import type { Question } from "@/types/game";

export function QuestionCard({ question, variant = "question" }: { question: Question; variant?: "question" | "result" }) {
  return (
    <section className={`question-card question-card--${variant}`} aria-labelledby={`question-${question.id}-${variant}`}>
      <h1
        id={`question-${question.id}-${variant}`}
        className="question-card__benefit"
        tabIndex={variant === "question" ? -1 : undefined}
        data-screen-title={variant === "question" ? true : undefined}
      >
        {question.benefit}
      </h1>
      <div className="question-card__divider"><span />ただし<span /></div>
      <p className="question-card__consequence">{question.consequence}</p>
    </section>
  );
}
