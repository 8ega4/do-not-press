import type { VoteChoice } from "@/types/game";

const SESSION_KEY = "do-not-press:session-id";
const VOTE_KEY_PREFIX = "do-not-press:voted:";

function fallbackId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
    const value = Math.floor(Math.random() * 16);
    return (token === "x" ? value : (value & 0x3) | 0x8).toString(16);
  });
}

export function getOrCreateSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = window.crypto?.randomUUID?.() ?? fallbackId();
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

export function getRecordedChoice(questionId: string) {
  return window.localStorage.getItem(`${VOTE_KEY_PREFIX}${questionId}`) as VoteChoice | null;
}

export function recordChoice(questionId: string, choice: VoteChoice) {
  window.localStorage.setItem(`${VOTE_KEY_PREFIX}${questionId}`, choice);
}
