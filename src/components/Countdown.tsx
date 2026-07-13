"use client";

import { useEffect, useRef, useState } from "react";

export function Countdown({ seconds = 5, onComplete }: { seconds?: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const completedRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          if (!completedRef.current) {
            completedRef.current = true;
            window.setTimeout(onComplete, 0);
          }
          return 0;
        }
        return value - 1;
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="countdown" role="timer" aria-live="polite" aria-label={`残り${remaining}秒`}>
      <span>あと</span>
      <strong>{remaining}</strong>
      <span>秒</span>
    </div>
  );
}
