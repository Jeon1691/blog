const ALLOWED_ORIGINS = new Set([
  "https://develicit.com",
  "https://www.develicit.com",
]);

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/i;

function corsHeaders(origin) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const slug = url.searchParams.get("slug");
    if (!slug || !SLUG_RE.test(slug)) {
      return json({ error: "invalid slug" }, 400, origin);
    }

    try {
      if (request.method === "POST") {
        const current = await env.VIEWS.get(slug);
        const views = (current ? parseInt(current, 10) : 0) + 1;
        await env.VIEWS.put(slug, String(views));
        return json({ views }, 200, origin);
      }
      if (request.method === "GET") {
        const current = await env.VIEWS.get(slug);
        const views = current ? parseInt(current, 10) : 0;
        return json({ views }, 200, origin);
      }
      return json({ error: "method not allowed" }, 405, origin);
    } catch (err) {
      console.error(err);
      return json({ error: "internal" }, 500, origin);
    }
  },
};
