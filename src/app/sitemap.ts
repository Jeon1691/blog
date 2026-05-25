import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { getAllSlugs, getPostMeta } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function langMapForPath(path: (lang: string) => string) {
  return Object.fromEntries(
    locales.map((l) => [l, path(l)])
  ) as Record<string, string>;
}

function langMapForPost(slug: string) {
  const result: Record<string, string> = {};
  for (const l of locales) {
    if (getAllSlugs(l).includes(slug)) {
      result[l] = `${site.url}/${l}/posts/${slug}/`;
    }
  }
  return result;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push(
      {
        url: `${site.url}/${lang}/`,
        lastModified: now,
        priority: 1,
        changeFrequency: "weekly",
        alternates: { languages: langMapForPath((l) => `${site.url}/${l}/`) },
      },
      {
        url: `${site.url}/${lang}/posts/`,
        lastModified: now,
        priority: 0.8,
        changeFrequency: "weekly",
        alternates: {
          languages: langMapForPath((l) => `${site.url}/${l}/posts/`),
        },
      },
      {
        url: `${site.url}/${lang}/about/`,
        lastModified: now,
        priority: 0.5,
        changeFrequency: "monthly",
        alternates: {
          languages: langMapForPath((l) => `${site.url}/${l}/about/`),
        },
      }
    );

    for (const slug of getAllSlugs(lang)) {
      const meta = getPostMeta(lang, slug);
      const isoDate = (() => {
        const d = new Date(meta.date);
        return Number.isNaN(d.getTime()) ? now : d.toISOString();
      })();
      entries.push({
        url: `${site.url}/${lang}/posts/${slug}/`,
        lastModified: isoDate,
        priority: 0.7,
        changeFrequency: "monthly",
        alternates: { languages: langMapForPost(slug) },
      });
    }
  }

  return entries;
}
