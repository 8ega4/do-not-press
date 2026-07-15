import { afterEach, describe, expect, it, vi } from "vitest";

describe("share URLs", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("adds UTM parameters and the GitHub Pages base path to question sharing", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/do-not-press");
    vi.stubGlobal("window", { location: { origin: "https://8ega4.github.io" } });
    const { questionShareUrl } = await import("@/lib/url");

    const url = new URL(questionShareUrl("q030"));
    expect(url.pathname).toBe("/do-not-press/q/q030/");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: "x",
      utm_medium: "social",
      utm_campaign: "question_share",
      utm_content: "q030",
    });
    expect(url.searchParams.has("og")).toBe(false);
  });

  it("uses the top-page campaign for top sharing", async () => {
    vi.stubGlobal("window", { location: { origin: "https://example.com" } });
    const { topShareUrl } = await import("@/lib/url");

    expect(new URL(topShareUrl()).searchParams.get("utm_campaign")).toBe("top_share");
  });
});
