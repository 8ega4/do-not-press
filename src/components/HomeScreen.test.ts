import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeScreen } from "@/components/HomeScreen";

describe("HomeScreen sharing", () => {
  it("shows every sharing destination on the top page", () => {
    const html = renderToStaticMarkup(createElement(HomeScreen, {
      totalVotes: 0,
      onStart: vi.fn(),
    }));

    expect(html).toContain('aria-label="SNSで共有"');
    expect(html).toContain('aria-label="Xで共有"');
    expect(html).toContain('aria-label="Threadsで共有"');
    expect(html).toContain('aria-label="LINEで送る"');
    expect(html).toContain('aria-label="シェア先を選ぶ"');
    expect(html).toContain('aria-label="リンクをコピー"');
  });
});
