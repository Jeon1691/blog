import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { getAllSlugs } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push(
      { url: `${site.url}/${lang}/`, lastModified: now, priority: 1 },
      { url: `${site.url}/${lang}/posts/`, lastModified: now, priority: 0.8 },
      { url: `${site.url}/${lang}/about/`, lastModified: now, priority: 0.5 }
    );
    for (const slug of getAllSlugs(lang)) {
      entries.push({
        url: `${site.url}/${lang}/posts/${slug}/`,
        lastModified: now,
        priority: 0.7,
      });
    }
  }

  return entries;
}
