import { type Locale, locales } from "./locales";
import { getAllPosts, getAllSlugs, getPostBody, getPostMeta, type PostMeta } from "./posts";
import { site } from "./site";

// Plain-Markdown exports for LLM crawlers and retrieval tools (https://llmstxt.org).
// MDX-only syntax is stripped so the text reads cleanly without a JSX runtime.

const LANGUAGE_NAME: Record<Locale, string> = { ko: "Korean", en: "English" };

export const postUrl = (locale: Locale, slug: string) => `${site.url}/${locale}/posts/${slug}/`;
export const postMarkdownUrl = (locale: Locale, slug: string) => `${postUrl(locale, slug)}index.md`;

function cleanMdx(body: string): string {
  return (
    body
      // ESM imports used only for diagram components
      .replace(/^import\s.+?;\s*$/gm, "")
      // MDX comments {/* ... */}, possibly multi-line
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      // Standalone JSX components such as <BinanceHackTimeline locale="en" />
      .replace(/^\s*<[A-Z][A-Za-z0-9]*\b[^>]*\/>\s*$/gm, "")
      // Line breaks inside table cells: keep the row on one line
      .replace(/<br\s*\/?>/g, " ")
      // Escapes needed only by MDX / remark-math
      .replace(/\\([$\\{}])/g, "$1")
      // Site-relative links -> absolute, so the text stands alone
      .replace(/\]\(\/(?!\/)/g, `](${site.url}/`)
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function translationsOf(meta: PostMeta) {
  return locales
    .filter((l) => l !== meta.locale && getAllSlugs(l).includes(meta.slug))
    .map((l) => ({ locale: l, url: postUrl(l, meta.slug) }));
}

/** One post as a self-contained Markdown document with a metadata header. */
export function postAsMarkdown(locale: Locale, slug: string): string {
  const meta = getPostMeta(locale, slug);
  const header = [
    `# ${meta.title}`,
    "",
    `> ${meta.description}`,
    "",
    `- URL: ${postUrl(locale, slug)}`,
    `- Author: ${site.author} (${site.authorUrl})`,
    `- Published: ${meta.date}`,
    ...(meta.updated !== meta.date ? [`- Updated: ${meta.updated}`] : []),
    `- Language: ${LANGUAGE_NAME[locale]}`,
    `- Tags: ${meta.tags.join(", ")}`,
    ...translationsOf(meta).map((t) => `- ${LANGUAGE_NAME[t.locale]} version: ${t.url}`),
  ].join("\n");
  return `${header}\n\n---\n\n${cleanMdx(getPostBody(locale, slug))}\n`;
}

/** The /llms.txt index: what the site is, and every post with a one-line summary. */
export function llmsIndex(): string {
  const sections = locales.map((l) => {
    const heading = l === "ko" ? "## 글 (Korean)" : "## Posts (English)";
    const items = getAllPosts(l).map(
      (p) => `- [${p.title}](${postMarkdownUrl(l, p.slug)}): ${p.description}`,
    );
    return [heading, "", ...items].join("\n");
  });
  return [
    `# ${site.name}`,
    "",
    `> Personal engineering blog by ${site.author}. Long-form analyses of security incidents, cryptography, blockchain wallets, and software practice, published in Korean and English.`,
    "",
    "Each link below points to a clean Markdown version of the post. Every post page also links its Markdown version via <link rel=\"alternate\" type=\"text/markdown\">. Figures are interactive React components on the site and are omitted from the Markdown.",
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## Optional",
    "",
    `- [Full text of every post](${site.url}/llms-full.txt): all posts concatenated in one file`,
    ...locales.map((l) => `- [RSS feed (${LANGUAGE_NAME[l]})](${site.url}/${l}/feed.xml)`),
    `- [Sitemap](${site.url}/sitemap.xml)`,
    "",
  ].join("\n");
}

/** The /llms-full.txt bundle: every published post in full. */
export function llmsFull(): string {
  const docs = locales.flatMap((l) => getAllPosts(l).map((p) => postAsMarkdown(l, p.slug)));
  return `# ${site.name} — full text\n\n${docs.join("\n\n---\n\n")}`;
}
