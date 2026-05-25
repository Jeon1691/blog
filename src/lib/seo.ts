import { type Locale } from "./locales";
import { site } from "./site";
import { type PostMeta } from "./posts";

const langTag = (l: Locale) => (l === "ko" ? "ko-KR" : "en-US");

export function personSchema() {
  return {
    "@type": "Person",
    name: site.author,
    url: site.authorUrl,
    sameAs: [site.authorUrl],
  };
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: "Develicit",
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/icon.svg`,
    },
    sameAs: [site.authorUrl],
    inLanguage: langTag(locale),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: `${site.url}/${locale}/`,
    inLanguage: langTag(locale),
    description:
      locale === "ko"
        ? "기술과 생각의 기록"
        : "Notes on engineering & thought",
    publisher: personSchema(),
  };
}

export function articleSchema(post: PostMeta) {
  const url = `${site.url}/${post.locale}/posts/${post.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    inLanguage: langTag(post.locale),
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: personSchema(),
    publisher: personSchema(),
    keywords: post.tags.join(", "),
    image: [`${url}opengraph-image`],
    url,
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}
