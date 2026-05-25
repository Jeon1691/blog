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
  // Cloudflare Worker for view counting; set after `wrangler deploy`.
  viewsApiUrl: "" as string,
} as const;
