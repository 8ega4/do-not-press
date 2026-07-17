import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildLineShareUrl,
  buildQuestionResultShareText,
  buildThreadsIntentUrl,
  buildTopShareText,
  buildXIntentUrl,
  openXShare,
  withShareSource,
} from "@/lib/share";

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

  it("builds encoded Threads and LINE share URLs", () => {
    const data = {
      text: "日本語の結果\n#絶対に押すな",
      url: "https://example.com/q/q001/?utm_source=threads",
    };
    const threads = new URL(buildThreadsIntentUrl(data));
    const line = new URL(buildLineShareUrl(data));

    expect(threads.origin + threads.pathname).toBe("https://www.threads.net/intent/post");
    expect(threads.searchParams.get("text")).toBe(`${data.text}\n${data.url}`);
    expect(line.origin + line.pathname).toBe("https://social-plugins.line.me/lineit/share");
    expect(line.searchParams.get("text")).toBe(data.text);
    expect(line.searchParams.get("url")).toBe(data.url);
  });

  it("changes only the UTM source for each share destination", () => {
    const shared = new URL(withShareSource(
      "https://example.com/q/q001/?utm_source=x&utm_medium=social&utm_campaign=question_share&utm_content=q001",
      "line",
    ));

    expect(Object.fromEntries(shared.searchParams)).toEqual({
      utm_source: "line",
      utm_medium: "social",
      utm_campaign: "question_share",
      utm_content: "q001",
    });
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
