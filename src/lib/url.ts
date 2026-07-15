const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type XShareCampaign = "question_share" | "top_share";

type BuildXShareUrlOptions = {
  path: string;
  campaign: XShareCampaign;
  content?: string;
};

export function buildXShareUrl({ path, campaign, content }: BuildXShareUrlOptions) {
  const origin = typeof window === "undefined" ? SITE_URL : window.location.origin;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${BASE_PATH}${normalizedPath}`, origin);
  const params = new URLSearchParams({
    utm_source: "x",
    utm_medium: "social",
    utm_campaign: campaign,
  });
  if (content) params.set("utm_content", content);
  url.search = params.toString();
  return url.toString();
}

export function questionShareUrl(questionId: string) {
  return buildXShareUrl({ path: `/q/${questionId}/`, campaign: "question_share", content: questionId });
}

export function topShareUrl() {
  return buildXShareUrl({ path: "/", campaign: "top_share" });
}
