import { EmergencyButton } from "@/components/EmergencyButton";

export function HomeScreen({ totalVotes, onStart }: { totalVotes: number; onStart: () => void }) {
  return (
    <div className="screen screen--home">
      <header className="experiment-label" aria-hidden="true">EXPERIMENT<br />NO.0001</header>
      <section className="home-copy">
        <h1>絶対に<br />押すな</h1>
        <p>その代償、本当に払えますか？</p>
      </section>
      <EmergencyButton label="赤いボタンでゲームを始める" size="hero" onClick={onStart} />
      <button type="button" className="action-button action-button--primary action-button--start" onClick={onStart}>ゲームを始める</button>
      <div className="total-counter" aria-label={`これまで${totalVotes.toLocaleString("ja-JP")}回の決断`}>
        <span>これまで</span><strong>{totalVotes.toLocaleString("ja-JP")}</strong><span>回の決断</span>
      </div>
      <p className="fiction-note"><span aria-hidden="true">△</span> これは架空の二択ゲームです</p>
    </div>
  );
}
