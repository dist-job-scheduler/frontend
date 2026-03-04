import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Renders the Fliq F-lettermark as a 32×32 PNG favicon.
// Satori (used by ImageResponse) doesn't support SVG filters/gradients,
// so we approximate the icon with solid colours.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#09090b",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Vertical stroke */}
        <div style={{
          position: "absolute",
          left: 7, top: 5,
          width: 5, height: 22,
          borderRadius: 1,
          background: "white",
        }} />

        {/* Top horizontal bar */}
        <div style={{
          position: "absolute",
          left: 7, top: 5,
          width: 18, height: 5,
          borderRadius: 1,
          background: "#6366f1",
        }} />

        {/* Mid horizontal bar */}
        <div style={{
          position: "absolute",
          left: 7, top: 15,
          width: 13, height: 4,
          borderRadius: 1,
          background: "#818cf8",
        }} />

        {/* Corner accent dot */}
        <div style={{
          position: "absolute",
          right: 5, top: 5,
          width: 5, height: 5,
          borderRadius: "50%",
          background: "#6366f1",
        }} />
      </div>
    ),
    { ...size },
  );
}
