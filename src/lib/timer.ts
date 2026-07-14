export const QUESTION_TIME_LIMIT_SECONDS = 10;

export function getRemainingSeconds(deadlineMs: number, nowMs: number) {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1_000));
}
