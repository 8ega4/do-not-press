import { afterEach, describe, expect, it, vi } from "vitest";
import { gameShareUrl, questionShareUrl } from "@/lib/url";

describe("share URLs", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("adds the OGP cache version to question and top-page URLs", () => {
    vi.stubGlobal("window", { location: { origin: "https://example.com" } });

    expect(questionShareUrl("q001")).toBe("https://example.com/q/q001/?og=2");
    expect(gameShareUrl()).toBe("https://example.com/?og=2");
  });
});
