import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { type Locale, locales } from "./locales";

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function postsDir(locale: Locale) {
  return path.join(CONTENT_DIR, locale, "posts");
}

function readPostFile(locale: Locale, slug: string) {
  const file = path.join(postsDir(locale), `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw);
}

export function getAllSlugs(locale: Locale): string[] {
  const dir = postsDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostMeta(locale: Locale, slug: string): PostMeta {
  const { data, content } = readPostFile(locale, slug);
  const stats = readingTime(content);
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft ?? false),
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

export function getAllPosts(locale: Locale, includeDrafts = false): PostMeta[] {
  return getAllSlugs(locale)
    .map((slug) => getPostMeta(locale, slug))
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsAcrossLocales(): PostMeta[] {
  return locales.flatMap((l) => getAllPosts(l));
}
