import { ImageResponse } from "next/og";

export const alt = "絶対に押すな — その代償、本当に払えますか？";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "68px 82px", background: "#eef0f1", color: "#121314" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 670 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 900, letterSpacing: "-5px", lineHeight: 1.05 }}><span>絶対に</span><span>押すな</span></div>
        <div style={{ display: "flex", marginTop: 34, paddingTop: 24, borderTop: "2px solid #6d7275", fontSize: 28, fontWeight: 700 }}>その代償、本当に払えますか？</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 290, height: 290, borderRadius: "50%", border: "3px dashed #c9151e" }}>
        <div style={{ display: "flex", width: 210, height: 150, borderRadius: "50%", background: "#59070b", alignItems: "flex-start", justifyContent: "center", boxShadow: "0 24px 20px rgba(0,0,0,.25)" }}>
          <div style={{ display: "flex", width: 196, height: 130, marginTop: -32, borderRadius: "50%", background: "#d71922", border: "4px solid #9d0d14" }} />
        </div>
      </div>
    </div>, { ...size },
  );
}
