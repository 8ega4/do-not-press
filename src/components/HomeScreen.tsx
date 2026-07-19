import { EmergencyButton } from "@/components/EmergencyButton";
import { ShareActions } from "@/components/ShareButton";
import { buildTopShareText } from "@/lib/share";
import { topShareUrl } from "@/lib/url";

type TotalVotesState = number | null | "error";

export function HomeScreen({ totalVotes, onStart }: { totalVotes: TotalVotesState; onStart: () => void }) {
  const shareText = buildTopShareText();
  const shareUrl = topShareUrl();
  const formattedTotalVotes = typeof totalVotes === "number" ? totalVotes.toLocaleString("ja-JP") : "—";
  const totalVotesLabel = totalVotes === null
    ? "これまでの決断回数を読み込み中"
    : totalVotes === "error"
      ? "これまでの決断回数を取得できません"
      : `これまで${formattedTotalVotes}回の決断`;

  return (
    <div className="screen screen--home">
      <header className="experiment-label" aria-hidden="true">EXPERIMENT<br />NO.0001</header>
      <section className="home-copy">
        <h1 tabIndex={-1} data-screen-title>絶対に<br />押すな</h1>
        <p><span>押すか、押さないか。<br />決断は何度でも続く。</span></p>
      </section>
      <EmergencyButton label="赤いボタンでゲームを始める" size="hero" onClick={onStart} />
      <button type="button" className="action-button action-button--primary action-button--start" onClick={onStart}>ゲームを始める</button>
      <div
        className={`total-counter ${totalVotes === null ? "total-counter--loading" : ""} ${totalVotes === "error" ? "total-counter--error" : ""}`}
        aria-label={totalVotesLabel}
        aria-live="polite"
      >
        <span>これまで</span><strong>{formattedTotalVotes}</strong><span>回の決断</span>
      </div>
      <div className="home-share">
        <ShareActions text={shareText} url={shareUrl} />
      </div>
      <p className="fiction-note"><span aria-hidden="true">△</span> これは架空の二択ゲームです</p>
    </div>
  );
}
