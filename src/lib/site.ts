export const site = {
  name: "develicit",
  domain: "develicit.com",
  url: "https://develicit.com",
  author: "Jeon1691",
  authorUrl: "https://github.com/Jeon1691",
  email: "jeon1691951@gmail.com",
  giscus: {
    repo: "Jeon1691/blog" as `${string}/${string}`,
    repoId: "R_kgDOSm-G5Q",
    category: "Announcements",
    categoryId: "DIC_kwDOSm-G5c4C9x7E",
  },
  // Cloudflare Worker for view counting (KV-backed).
  viewsApiUrl: "https://develicit-views.develicit.workers.dev",
  // Google AdSense — leave clientId empty until the AdSense application
  // is approved. When set (e.g. "ca-pub-1234567890123456"), the loader
  // script, ads.txt, and AdSlot units all activate automatically.
  adsense: {
    clientId: "" as string,
    postBottomSlot: "" as string,
  },
  // Webmaster console verification codes. Fill in after registering
  // the site at each provider. Empty values are omitted from meta.
  verification: {
    google: "" as string, // Google Search Console — meta content value
    naver: "" as string, // Naver Search Advisor — meta content value
  },
} as const;
