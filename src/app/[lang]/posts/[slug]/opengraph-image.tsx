import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/lib/locales";
import { getAllSlugs, getPostMeta } from "@/lib/posts";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const slug of getAllSlugs(lang)) {
      params.push({ lang, slug });
    }
  }
  return params;
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
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) {
    return new Response("Not found", { status: 404 });
  }
  const meta = getPostMeta(lang, slug);
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
          padding: 72,
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          <div>{site.name}</div>
          <div>{meta.dateDisplay}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: meta.title.length > 30 ? 72 : 96,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.15,
          }}
        >
          {meta.title}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 24,
            color: "#71717a",
          }}
        >
          {meta.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #3f3f46",
              }}
            >
              #{t}
            </span>
          ))}
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
