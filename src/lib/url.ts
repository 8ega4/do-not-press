const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function questionShareUrl(questionId: string) {
  const path = `${BASE_PATH}/q/${questionId}/`;
  return typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
}

export function gameShareUrl() {
  const path = `${BASE_PATH}/`;
  return typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
}
