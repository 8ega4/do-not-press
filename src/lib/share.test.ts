import { afterEach, describe, expect, it, vi } from "vitest";
import { buildQuestionResultShareText, buildTopShareText, buildXIntentUrl, openXShare } from "@/lib/share";

describe("X sharing", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("encodes Japanese text, line breaks, hashtag, and URL", () => {
    const text = "「1億円もらえる」\nただし\n「一生Wi-Fiが1本になる」\n#絶対に押すな";
    const url = "https://example.com/q/q001/";
    const intent = new URL(buildXIntentUrl({ text, url }));

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

  it("builds a question result post with answer, percentage, and majority label", () => {
    expect(buildQuestionResultShareText({
      benefit: "1億円もらえる",
      consequence: "一生Wi-Fiが1本になる",
      choice: "dont_press",
      outcome: { status: "minority", label: "あなたは少数派です", sameAnswerPercent: 27 },
    })).toBe(
      "「1億円もらえる」\nただし\n「一生Wi-Fiが1本になる」\n\n私は「押さない」を選びました。\n同じ回答は27％。少数派でした。\n\nあなたなら押す？\n\n#絶対に押すな",
    );
    expect(buildTopShareText()).toBe(
      "『絶対に押すな』\nその代償、本当に払えますか？\nあなたなら押す？\n#絶対に押すな",
    );
  });

  it("uses a natural small-sample sentence", () => {
    const text = buildQuestionResultShareText({
      benefit: "一生信号に引っかからない",
      consequence: "エレベーターは毎回すべての階に止まる",
      choice: "press",
      outcome: { status: "insufficient", label: "まだ回答が集まっていません", sameAnswerPercent: 75 },
    });
    expect(text).toContain("同じ回答は75％。まだ回答は集まっていません。");
  });
});
