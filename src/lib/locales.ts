export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const dictionaries = {
  ko: {
    siteName: "develicit",
    tagline: "기술과 생각의 기록",
    nav: { posts: "글", about: "소개" },
    home: {
      latestPosts: "최근 글",
      viewAll: "전체 보기",
    },
    post: {
      readingTime: (m: number) => `읽는 시간 ${m}분`,
      publishedOn: "발행일",
      comments: "댓글",
      back: "← 글 목록으로",
    },
    search: {
      placeholder: "글 검색...",
      noResults: "검색 결과 없음",
      open: "검색",
    },
    footer: {
      rss: "RSS",
      github: "GitHub",
      builtWith: "Next.js + AWS로 자체 호스팅",
    },
  },
  en: {
    siteName: "develicit",
    tagline: "Notes on engineering & thought",
    nav: { posts: "Posts", about: "About" },
    home: {
      latestPosts: "Latest posts",
      viewAll: "View all",
    },
    post: {
      readingTime: (m: number) => `${m} min read`,
      publishedOn: "Published",
      comments: "Comments",
      back: "← Back to posts",
    },
    search: {
      placeholder: "Search posts...",
      noResults: "No results",
      open: "Search",
    },
    footer: {
      rss: "RSS",
      github: "GitHub",
      builtWith: "Self-hosted on AWS with Next.js",
    },
  },
} satisfies Record<Locale, unknown>;

export type Dictionary = (typeof dictionaries)[Locale];
export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale];
