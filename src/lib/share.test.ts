import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQuestionShareText, buildSummaryShareText, buildXShareUrl, openXShare } from "@/lib/share";

describe("X sharing", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("encodes Japanese text, line breaks, hashtag, and URL", () => {
    const text = "「1億円もらえる」\nただし\n「一生Wi-Fiが1本になる」\n#絶対に押すな";
    const url = "https://example.com/q/q001/";
    const intent = new URL(buildXShareUrl({ text, url }));

    expect(intent.origin + intent.pathname).toBe("https://twitter.com/intent/tweet");
    expect(intent.searchParams.get("text")).toBe(text);
    expect(intent.searchParams.get("url")).toBe(url);
  });

  it("opens the X composer in a protected new tab", () => {
    const open = vi.fn();
    vi.stubGlobal("window", { open });

    openXShare({ text: "本文", url: "https://example.com/q/q001/" });

    expect(open).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("https://twitter.com/intent/tweet?"),
      "_blank",
      "noopener,noreferrer",
    );
  });
});
  it("builds the requested question and summary post formats", () => {
    expect(buildQuestionShareText("1億円もらえる", "一生Wi-Fiが1本になる")).toBe(
      "「1億円もらえる」\nただし\n「一生Wi-Fiが1本になる」\nあなたは押す？押さない？\n#絶対に押すな",
    );
    expect(buildSummaryShareText(3, 2, "攻めの決断者")).toBe(
      "『絶対に押すな』に挑戦！\n3問中2回、ボタンを押しました。\nタイプは「攻めの決断者」\nあなたなら押す？\n#絶対に押すな",
    );
  });
