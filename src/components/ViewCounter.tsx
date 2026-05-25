"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { type Locale } from "@/lib/locales";

export function ViewCounter({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!site.viewsApiUrl) return;
    const key = `view:${slug}`;
    const counted = sessionStorage.getItem(key);
    const url = `${site.viewsApiUrl}?slug=${encodeURIComponent(slug)}`;
    const method = counted ? "GET" : "POST";

    fetch(url, { method })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { views?: number } | null) => {
        if (data && typeof data.views === "number") {
          setCount(data.views);
          if (!counted) sessionStorage.setItem(key, "1");
        }
      })
      .catch(() => {
        /* silent — view count is non-critical */
      });
  }, [slug]);

  if (count === null) return null;
  const formatted = count.toLocaleString();
  const label = locale === "ko" ? `조회 ${formatted}` : `${formatted} views`;
  return <span>{label}</span>;
}
