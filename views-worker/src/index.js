import { publishedSlugs } from "./published-slugs.js";

const ALLOWED_ORIGINS = new Set([
  "https://develicit.com",
  "https://www.develicit.com",
]);

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/i;
const PUBLISHED_SLUGS = new Set(publishedSlugs);

function corsHeaders(origin) {
  return {
    ...(ALLOWED_ORIGINS.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "content-type": "application/json",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function readCount(current) {
  if (current === null) return 0;
  if (!/^\d+$/.test(current)) throw new Error("Invalid stored count");
  const count = Number(current);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid stored count");
  return count;
}

async function rateLimitKey(ip) {
  // Rotate the pseudonymous key daily. Never store an IP or this key in KV/logs.
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${day}:${ip}`));
  const hash = Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
  return `views:${day}:${hash}`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (url.pathname !== "/") return json({ error: "not found" }, 404, origin);

    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "forbidden origin" }, 403, origin);
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "GET" && request.method !== "POST") {
      return json({ error: "method not allowed" }, 405, origin, { Allow: "GET, POST, OPTIONS" });
    }
    if (request.method === "POST" && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "forbidden origin" }, 403, origin);
    }

    const slug = url.searchParams.get("slug");
    if (!slug || !SLUG_RE.test(slug)) {
      return json({ error: "invalid slug" }, 400, origin);
    }
    if (!PUBLISHED_SLUGS.has(slug)) return json({ error: "unknown post" }, 404, origin);

    if (request.method === "POST") {
      // CF-Connecting-IP is supplied by Cloudflare at the edge. Do not use user
      // supplied X-Forwarded-For or a shared fallback bucket when unavailable.
      const ip = request.headers.get("CF-Connecting-IP");
      if (!ip || !env.VIEW_RATE_LIMITER || typeof env.VIEW_RATE_LIMITER.limit !== "function") {
        return json({ error: "counter unavailable" }, 503, origin);
      }
      try {
        const decision = await env.VIEW_RATE_LIMITER.limit({ key: await rateLimitKey(ip) });
        if (decision?.success === false) {
          return json({ error: "rate limited" }, 429, origin, { "Retry-After": "60" });
        }
        if (decision?.success !== true) return json({ error: "counter unavailable" }, 503, origin);
      } catch {
        return json({ error: "counter unavailable" }, 503, origin);
      }
    }

    try {
      if (request.method === "POST") {
        const views = readCount(await env.VIEWS.get(slug)) + 1;
        if (!Number.isSafeInteger(views)) throw new Error("Count overflow");
        await env.VIEWS.put(slug, String(views));
        return json({ views }, 200, origin);
      }
      if (request.method === "GET") {
        const views = readCount(await env.VIEWS.get(slug));
        return json({ views }, 200, origin);
      }
    } catch {
      return json({ error: "internal" }, 500, origin);
    }
  },
};
