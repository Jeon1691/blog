import { Feed } from "feed";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locales";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getAllPosts(lang);
  const feed = new Feed({
    title: `${site.name}${lang === "ko" ? " (한국어)" : ""}`,
    description:
      lang === "ko"
        ? "기술과 생각의 기록"
        : "Notes on engineering & thought",
    id: `${site.url}/${lang}/`,
    link: `${site.url}/${lang}/`,
    language: lang === "ko" ? "ko-KR" : "en-US",
    copyright: `© ${new Date().getFullYear()} ${site.author}`,
    feedLinks: { atom: `${site.url}/${lang}/feed.xml` },
    author: { name: site.author, link: site.authorUrl },
  });

  for (const p of posts) {
    feed.addItem({
      title: p.title,
      id: `${site.url}/${lang}/posts/${p.slug}/`,
      link: `${site.url}/${lang}/posts/${p.slug}/`,
      description: p.description,
      date: new Date(p.date),
    });
  }

  return new Response(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
