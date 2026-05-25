import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="4" width="4" height="24" rx="1" fill="#ffffff" />
          <circle cx="12" cy="20" r="8" fill="#ffffff" />
          <circle cx="12" cy="20" r="4" fill="#0a0a0a" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
