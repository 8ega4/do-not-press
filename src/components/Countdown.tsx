"use client";

import { useEffect, useRef, useState } from "react";
import { getRemainingSeconds, QUESTION_TIME_LIMIT_SECONDS } from "@/lib/timer";

const COUNTDOWN_TICK_MS = 100;

export function Countdown({ seconds = QUESTION_TIME_LIMIT_SECONDS, onComplete }: { seconds?: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const deadlineMs = Date.now() + seconds * 1_000;
    const timer = window.setInterval(() => {
      const nextRemaining = getRemainingSeconds(deadlineMs, Date.now());
      setRemaining((current) => current === nextRemaining ? current : nextRemaining);

      if (nextRemaining === 0 && !completedRef.current) {
        completedRef.current = true;
        window.clearInterval(timer);
        window.setTimeout(() => onCompleteRef.current(), 0);
      }
    }, COUNTDOWN_TICK_MS);

    return () => window.clearInterval(timer);
  }, [seconds]);

  return (
    <div className="countdown" role="timer" aria-live="polite" aria-label={`残り${remaining}秒`}>
      <span>あと</span>
      <strong>{remaining}</strong>
      <span>秒</span>
    </div>
  );
}
