# Blog view counter

This public Worker counts published blog posts. It retains the existing client
contract: `GET /?slug=<post>` reads `{ "views": number }`; `POST /?slug=<post>`
increments and returns the same shape. Korean and English translations share a
counter when they share a filename slug. Responses use `Cache-Control: no-store`.

POST accepts only the exact browser origins `https://develicit.com` and
`https://www.develicit.com`. An Origin header is a browser protection, not
authentication: scripts can forge it. The native limiter therefore applies to
every approved POST before any KV operation, across all post slugs for that IP.
GET stays public and never writes. Approved OPTIONS requests return 204.

| Status | Meaning |
| --- | --- |
| 200 | Existing or newly initialized count; JSON `{ "views": number }` |
| 400 | Missing or malformed slug |
| 403 | POST/OPTIONS Origin is missing or outside the exact origin allowlist |
| 404 | Unknown post slug or path other than `/` |
| 405 | Unsupported method; `Allow: GET, POST, OPTIONS` |
| 429 | Native limiter denied the POST; `Retry-After: 60` |
| 500 | KV error, invalid stored count, or count overflow; no backend details |
| 503 | Missing client IP/limiter binding, or limiter error/invalid decision |

Refused requests do not access KV. POST requires Cloudflare's edge-provided
`CF-Connecting-IP`; forwarded headers are not a fallback. The limiter receives a
SHA-256 digest of the current UTC date and IP, shared across posts and rotated
daily. The application stores neither raw IPs nor these keys in KV and does not
log them. This digest is pseudonymous, not anonymous or a secret; application
logging behavior does not control Cloudflare platform retention.

The configured threshold is 30 POST checks per 60 seconds for an IP in each
Cloudflare location. Cloudflare documents approximate, eventually consistent
counters: bursts may exceed the threshold, and locations have separate buckets.
Shared networks may share the allowance. This bounds casual abuse; it does not
establish unique visitors, authenticated views, or an exact global limit. KV
read-modify-write increments also remain approximate under concurrency.

## Content and local checks

Run from the repository root with Node 22 or newer and pnpm:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm --dir views-worker install --frozen-lockfile --ignore-scripts
pnpm --dir views-worker allowlist:generate
pnpm --dir views-worker allowlist:check
pnpm --dir views-worker test
pnpm --dir views-worker exec wrangler deploy --dry-run --outdir /tmp/blog-views-dist
```

The generator uses the blog's `gray-matter` parser and draft truthiness from
`src/lib/posts.ts`. It unions published MDX filename slugs from the site's shared
`src/lib/supported-locales.json` locales and writes sorted `src/published-slugs.js`.
Unsupported locale directories are excluded. Commit the generated file whenever
posts change. CI's check rejects stale output; Wrangler's custom build also
regenerates it during dev/deploy. Missing/empty content fails generation. Root
dependencies and the content tree are required when building this Worker.

For local HTTP testing, use `pnpm --dir views-worker exec wrangler dev --local`
and a separate `--persist-to /tmp/<test-directory>` directory if local KV state
must be isolated. Never use production POSTs for these tests. Node tests use
mock bindings to verify missing/failing limiter behavior and refused-request
storage isolation; a Wrangler dry-run validates bundling and binding config but
does not establish production behavior.

## Deployment

Before an authorized production deploy, check that rate-limit namespace
`2026102201` is reserved for this Worker in this Cloudflare account. Namespaces
are account-scoped integers; reusing one with another binding shares counters.
No API key, extra database, paid integration, or application secret is added.
The existing VIEWS KV namespace is preserved, so existing counts are retained.

Deploy the Worker using its `pnpm --dir views-worker deploy` script and deploy
the static site after merging the patch through the normal reviewed path.
Publish the generated allowlist to the Worker whenever a post is added, removed,
or made draft; a static-site-only deployment cannot update Worker code. Without
that Worker deployment, a new post's optional view count stays hidden until its
slug is allowed. After deployment, verify public GET responses and error status
distribution. Production increment tests require separate authorization.

Official implementation references:

- [Native rate-limit bindings and limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
