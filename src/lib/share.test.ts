import { afterEach, describe, expect, it, vi } from "vitest";
import { shareContent } from "@/lib/share";

describe("shareContent", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("prefers the Web Share API", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share, clipboard: { writeText: vi.fn() } });
    await expect(shareContent({ title: "title", text: "text", url: "https://example.com" })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledOnce();
  });

  it("copies text and URL when Web Share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(shareContent({ text: "本文", url: "https://example.com/q/q001" })).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("本文\n\nhttps://example.com/q/q001");
  });
});
