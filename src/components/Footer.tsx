import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/locales";
import { site } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Develicit</div>
        <div className="flex gap-4">
          <Link
            href={`/${locale}/feed.xml`}
            className="hover:text-foreground"
            prefetch={false}
          >
            {dict.footer.rss}
          </Link>
          <a
            href={site.authorUrl}
            className="hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            {dict.footer.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
