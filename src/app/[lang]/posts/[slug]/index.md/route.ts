import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/locales";
import { postAsMarkdown } from "@/lib/llm";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap((lang) => getAllPosts(lang).map((p) => ({ lang, slug: p.slug })));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  return new Response(postAsMarkdown(lang, slug), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
