import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, getDictionary, locales } from "@/lib/locales";
import { getAllSlugs, getPostMeta } from "@/lib/posts";
import { Giscus } from "@/components/Giscus";
import { JsonLd } from "@/components/JsonLd";
import { ViewCounter } from "@/components/ViewCounter";
import { articleSchema, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const meta = getPostMeta(lang, slug);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    authors: [{ name: site.author, url: site.authorUrl }],
    alternates: { canonical: `/${lang}/posts/${slug}/` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${site.url}/${lang}/posts/${slug}/`,
      publishedTime: meta.date,
      tags: meta.tags,
      authors: [site.author],
      locale: lang === "ko" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const meta = getPostMeta(lang, slug);
  const { default: Post } = await import(`@/../content/${lang}/posts/${slug}.mdx`);

  const crumb = breadcrumbSchema(lang, [
    { name: site.name, url: `${site.url}/${lang}/` },
    {
      name: dict.nav.posts,
      url: `${site.url}/${lang}/posts/`,
    },
    {
      name: meta.title,
      url: `${site.url}/${lang}/posts/${slug}/`,
    },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <JsonLd data={[articleSchema(meta), crumb]} />
      <div className="mb-10">
        <Link
          href={`/${lang}/posts/`}
          className="text-sm text-muted-foreground hover:text-foreground inline-block mb-6"
        >
          {dict.post.back}
        </Link>
        <h1
          className="text-4xl font-bold tracking-tight mb-3"
          data-pagefind-meta="title"
        >
          {meta.title}
        </h1>
        <div className="flex gap-3 text-sm text-muted-foreground">
          <time dateTime={meta.date}>{meta.dateDisplay}</time>
          <span>·</span>
          <span>{dict.post.readingTime(meta.readingMinutes)}</span>
          <span aria-hidden>·</span>
          <ViewCounter slug={slug} locale={lang} />
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:rounded-lg prose-pre:border prose-pre:bg-zinc-50 dark:prose-pre:bg-zinc-900">
        <Post />
      </div>

      <hr className="my-16 border-zinc-200 dark:border-zinc-800" />

      <section data-pagefind-ignore>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          {dict.post.comments}
        </h2>
        <Giscus locale={lang} />
      </section>
    </article>
  );
}
