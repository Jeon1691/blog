import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/lib/locales";
import { getAllSlugs, getPostMeta } from "@/lib/posts";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Titles follow a "headline — subtitle" convention; the part after the dash is drawn smaller.
const TITLE_SEPARATOR = " — ";
// Headlines longer than this many characters drop to the smaller size so they fit in two lines.
const LONG_HEADLINE_CHARS = 30;
const HEADLINE_FONT_PX = { short: 96, long: 72 };
const SUBTITLE_FONT_PX = 40;
const PAGE_PADDING_PX = 72;
// Satori only wraps flex rows against a definite pixel width, so the text block gets one explicitly.
const CONTENT_WIDTH_PX = size.width - PAGE_PADDING_PX * 2;

// Satori breaks Hangul between any two syllables, and its keep-all mode still strands
// trailing punctuation on its own line. Rendering each space-separated word as its own
// box makes lines wrap only between words.
const WORD_GAP_EM = 0.28;

// Returned as a plain array: Satori treats a Fragment as one unbreakable box, which defeats wrapping.
function wordBoxes(text: string, fontSize: number) {
  return text.split(" ").map((word, i) => (
    <span key={i} style={{ display: "flex", flexShrink: 0, marginRight: fontSize * WORD_GAP_EM }}>
      {word}
    </span>
  ));
}

function splitTitle(title: string): { headline: string; subtitle: string | null } {
  const i = title.indexOf(TITLE_SEPARATOR);
  if (i < 0) return { headline: title, subtitle: null };
  return { headline: title.slice(0, i), subtitle: title.slice(i + TITLE_SEPARATOR.length) };
}
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
  const { headline, subtitle } = splitTitle(meta.title);
  const headlineSize =
    headline.length > LONG_HEADLINE_CHARS ? HEADLINE_FONT_PX.long : HEADLINE_FONT_PX.short;
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
          padding: PAGE_PADDING_PX,
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

        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: CONTENT_WIDTH_PX }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: CONTENT_WIDTH_PX,
              fontSize: headlineSize,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.15,
            }}
          >
            {wordBoxes(headline, headlineSize)}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: CONTENT_WIDTH_PX,
                fontSize: SUBTITLE_FONT_PX,
                color: "#a1a1aa",
                letterSpacing: -1,
                lineHeight: 1.3,
              }}
            >
              {wordBoxes(subtitle, SUBTITLE_FONT_PX)}
            </div>
          )}
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
