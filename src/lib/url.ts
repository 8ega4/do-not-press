import { SHARE_PREVIEW_VERSION } from "@/lib/og";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function versionedShareUrl(path: string) {
  const versionedPath = `${path}?og=${SHARE_PREVIEW_VERSION}`;
  return typeof window === "undefined" ? versionedPath : new URL(versionedPath, window.location.origin).toString();
}

export function questionShareUrl(questionId: string) {
  const path = `${BASE_PATH}/q/${questionId}/`;
  return versionedShareUrl(path);
}

export function gameShareUrl() {
  const path = `${BASE_PATH}/`;
  return versionedShareUrl(path);
}
