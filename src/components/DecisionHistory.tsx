import type { PlayHistory } from "@/types/game";

export function DecisionHistory({ history, next = false }: { history: PlayHistory; next?: boolean }) {
  const decisionNumber = history.totalAnswered + (next ? 1 : 0);
  return (
    <header className="decision-history" aria-label={`${decisionNumber}回目の決断。押した${history.pressCount}回、押さなかった${history.dontPressCount}回`}>
      <p>DECISION <strong>{String(decisionNumber).padStart(2, "0")}</strong></p>
      <p>押した <strong className="text-red">{history.pressCount}</strong><span aria-hidden="true">｜</span>押さなかった <strong>{history.dontPressCount}</strong></p>
    </header>
  );
}
