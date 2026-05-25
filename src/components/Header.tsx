import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/locales";
import { site } from "@/lib/site";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SearchTrigger } from "./Search";

export function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
        <Link href={`/${locale}/`} className="font-bold tracking-tight">
          {site.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href={`/${locale}/posts/`}
            className="text-muted-foreground hover:text-foreground"
          >
            {dict.nav.posts}
          </Link>
          <Link
            href={`/${locale}/about/`}
            className="text-muted-foreground hover:text-foreground"
          >
            {dict.nav.about}
          </Link>
          <SearchTrigger locale={locale} />
          <LocaleSwitcher current={locale} />
        </nav>
      </div>
    </header>
  );
}
