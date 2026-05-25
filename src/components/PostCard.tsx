import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import type { Dictionary } from "@/lib/locales";

export function PostCard({
  post,
  dict,
}: {
  post: PostMeta;
  dict: Dictionary;
}) {
  return (
    <article className="group">
      <Link
        href={`/${post.locale}/posts/${post.slug}/`}
        className="block space-y-1.5"
      >
        <h3 className="text-xl font-semibold tracking-tight group-hover:underline underline-offset-4">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}
        <div className="flex gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{dict.post.readingTime(post.readingMinutes)}</span>
        </div>
      </Link>
    </article>
  );
}
