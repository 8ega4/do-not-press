import { ImageResponse } from "next/og";
import { getQuestionById } from "@/data/questions";

export const alt = "絶対に押すな — 問題";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function QuestionOpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = getQuestionById(id);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 86px", background: "#eef0f1", color: "#121314", textAlign: "center" }}>
      <div style={{ display: "flex", fontSize: 54, fontWeight: 900 }}>{question?.benefit ?? "このボタン、押せますか？"}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "30px 0 20px", fontSize: 24, color: "#5f6467" }}><span style={{ width: 90, borderTop: "2px solid #6d7275" }} />ただし<span style={{ width: 90, borderTop: "2px solid #6d7275" }} /></div>
      <div style={{ display: "flex", fontSize: 42, fontWeight: 800 }}>{question?.consequence ?? "結果は開いてからのお楽しみ"}</div>
      <div style={{ display: "flex", marginTop: 40, padding: "14px 34px", background: "#c9151e", color: "white", fontSize: 28, fontWeight: 800 }}>あなたは押す？</div>
    </div>, { ...size },
  );
}
