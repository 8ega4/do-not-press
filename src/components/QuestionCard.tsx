import type { Question } from "@/types/game";

export function QuestionCard({ question }: { question: Question }) {
  return (
    <section className="question-card" aria-labelledby={`question-${question.id}`}>
      <h1 id={`question-${question.id}`} className="question-card__benefit">{question.benefit}</h1>
      <div className="question-card__divider"><span />ただし<span /></div>
      <p className="question-card__consequence">{question.consequence}</p>
    </section>
  );
}
