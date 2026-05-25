import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/locales";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { site } from "@/lib/site";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = getAllPosts(lang).slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          {site.name}
        </h1>
        <p className="text-lg text-muted-foreground">{dict.tagline}</p>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {dict.home.latestPosts}
          </h2>
          <Link
            href={`/${lang}/posts/`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {dict.home.viewAll} →
          </Link>
        </div>
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              {lang === "ko" ? "아직 글이 없습니다." : "No posts yet."}
            </p>
          ) : (
            posts.map((p) => <PostCard key={p.slug} post={p} dict={dict} />)
          )}
        </div>
      </section>
    </div>
  );
}
