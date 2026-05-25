import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/locales";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default async function PostsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = getAllPosts(lang);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-10">
        {dict.nav.posts}
      </h1>
      <div className="space-y-10">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} dict={dict} />
        ))}
      </div>
    </div>
  );
}
