import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/lib/locales";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

async function loadFont(weight: 400 | 700) {
  const url = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-${
    weight === 700 ? "Bold" : "Regular"
  }.otf`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load Pretendard ${weight}`);
  return res.arrayBuffer();
}

export default async function OG({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ko";
  const tagline =
    locale === "ko" ? "기술과 생각의 기록" : "Notes on engineering & thought";

  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, opacity: 0.8 }}>
          {site.domain}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -4 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 44, color: "#a1a1aa" }}>{tagline}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
