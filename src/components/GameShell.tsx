import type { ReactNode } from "react";

export function GameShell({ children, isImpact = false }: { children: ReactNode; isImpact?: boolean }) {
  return (
    <main className={`game-shell ${isImpact ? "game-shell--impact" : ""}`}>
      <div className="technical-frame" aria-hidden="true">
        <span className="corner corner--tl" /><span className="corner corner--tr" />
        <span className="corner corner--bl" /><span className="corner corner--br" />
      </div>
      <div className="game-surface">{children}</div>
    </main>
  );
}
