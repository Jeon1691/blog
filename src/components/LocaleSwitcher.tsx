"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/lib/locales";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();

  function altPath(target: Locale) {
    if (!pathname) return `/${target}/`;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return `/${target}/`;
    parts[0] = target;
    return `/${parts.join("/")}/`;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-300 dark:text-zinc-700">/</span>}
          {l === current ? (
            <span className="text-foreground font-medium">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={altPath(l)}
              className="text-muted-foreground hover:text-foreground"
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
