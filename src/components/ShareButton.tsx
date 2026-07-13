"use client";

import { useState } from "react";
import { shareContent } from "@/lib/share";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="18" cy="5" r="2.25" /><circle cx="6" cy="12" r="2.25" /><circle cx="18" cy="19" r="2.25" />
      <path d="m8 11 7.8-4.5M8 13l7.8 4.5" />
    </svg>
  );
}

export function ShareButton({ title, text, url, label, variant = "secondary" }: ShareData & { label: string; variant?: "primary" | "secondary" }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");

  async function handleShare() {
    try {
      const result = await shareContent({ title, text, url });
      if (result === "copied" || result === "shared") setStatus(result);
    } catch {
      setStatus("error");
    }
    window.setTimeout(() => setStatus("idle"), 2_000);
  }

  const statusLabel = status === "copied" ? "リンクをコピーしました" : status === "shared" ? "共有しました" : status === "error" ? "共有できませんでした" : label;
  return (
    <button type="button" className={`action-button action-button--${variant}`} onClick={handleShare}>
      <ShareIcon /><span>{statusLabel}</span>
    </button>
  );
}
