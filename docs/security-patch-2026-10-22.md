# Security patch, 2026-10-22

This patch updates the static blog and its separately deployed view counter.
This records the implementation and local verification on
`fix/blog-security-2026-10-22`, before the separately authorized production
rollout. Local verification did not deploy or write to production.

## Changes

- Next.js and `@next/mdx` 16.2.6 → 16.4.2, including the October 14 security
  fixes; Wrangler 3.114.17 → 4.151.3.
- Refresh compatible dependencies and lockfiles, including `js-yaml` 3.15.2,
  `sharp` 0.35.5, patched PostCSS, nanoid, and source-map-js versions.
- Scope KaTeX 0.18.10 overrides to `rehype-katex` and
  `micromark-extension-math`; scope selector-parser 7.1.6 to Tailwind typography.
  These cross the consumers' declared major ranges, so tests exercise real MDX
  inline/display math, matching KaTeX styles, trust restrictions, micromark
  rendering, and typography CSS compilation.
- Admit only published post slugs to the Worker. The site and generator share
  supported locale keys; drafts and unsupported language directories are
  excluded. Generated output is included with source changes, freshness is checked, and Wrangler
  regenerates it before a build without rewriting unchanged output.
- Reject unapproved POST origins before KV access and rate-limit approved POSTs
  across all posts to approximately 30 checks/minute/IP/Cloudflare location.
  Missing or broken limiter bindings or client IPs fail closed. Existing counts
  and the `{ "views": number }` contract are preserved. Origin is not
  authentication, and this is not an exact global limit or unique-visitor count.
- Restrict AWS deployment-role trust to the exact `main` OIDC subject and the
  existing STS audience.
- Add CloudFront CSP and escape HTML tag openers in JSON-LD serialization.
  Static Next.js hydration still needs script `unsafe-inline`; the policy does
  not eliminate all inline script injection. AdSense is disabled and not
  allowlisted. Review CSP before enabling it or other embeds.
- Add PR security checks and deployment gates for tests, types and high-severity
  audit findings. CI installs disable dependency lifecycle scripts and freeze
  both lockfiles. CI uses pnpm 9.15.4 and Node 22.
- Upload hashed Next.js and Pagefind assets additively so open pages retain
  access to the preceding release. Refresh stable search entrypoints and
  extensionless metadata images with revalidation instead of immutable caching.
  Remove obsolete versioned assets only through a separate retention review.

## Remaining advisory

Root audit: **38 → 1 moderate**, with zero high/critical. Worker tooling audit:
**21 → 0**. Counts are dependency audit findings, not publicly reachable bugs.

`GHSA-hp3w-g68c-fv3c` / `CVE-2026-97058` affects `sprintf-js` and has no fixed
release at the time of this patch. It remains unsuppressed through
`gray-matter → js-yaml → argparse → sprintf-js`. `gray-matter/lib/engines.js`
uses the js-yaml library entry, which does not import argparse; js-yaml's CLI
entry `bin/js-yaml.js` imports it. A real frontmatter parse loaded neither
argparse nor sprintf-js. This blog parses repository content during static
builds, with no public YAML input or server endpoint. Do not invoke that CLI
with untrusted formatting inputs; recheck this exception by **2026-11-22** or
when this dependency path changes. The high-severity CI audit gate intentionally
does not hide the remaining moderate warning.

The original Next server RCE warnings were not evidence of an exposed server:
the site exports static files to S3/CloudFront with image optimization disabled.
Patching still protects the build/development dependency chain.

## Verification and rollout

Local results on the final source:

- Node 22: **28/28 tests pass** (6 blog, 22 Worker).
- Node 22 Next.js build: **42/42 static outputs**, Pagefind indexes both languages.
- Type checking, allowlist freshness, diff whitespace and actionlint checks pass.
- Both lockfiles install frozen with lifecycle scripts disabled in fresh temporary
  directories. Worker bundling dry-run and Terraform formatting/schema validation
  pass.
- Independent review found an unsupported-locale admission issue; the shared
  locale source and regression fixture resolve it.

Tests cover script-context JSON-LD breakout, dependency compatibility, Worker
origin/slug/limiter/KV boundaries, drafts and unsupported locales, and allowlist
freshness. Original Worker boundary failures and the unsupported-locale case
were reproduced before their fixes. Wrangler local HTTP testing used isolated
temporary KV data and exercised normal GET/POST, 403/404, and native 429 behavior.
Dry-run validates bundles and binding configuration; it is not a deployment.

Browser checks use the exported site behind the exact proposed CSP on loopback.
Production view-counter requests are blocked in the test tab. Search results,
theme switching and math rendering are checked locally. Giscus initialization
can be inspected locally, but authenticated comment behavior remains an
operational check. No comments are submitted.

Terraform validation uses a scratch copy of the same `.tf` files with the
backend disabled and no state/tfvars. The source lockfile contains a pre-existing
unused archive provider; only the scratch lockfile was normalized for validation.
This validates configuration, not live IAM or CloudFront settings. GitHub Actions
itself has not run for this branch.

Before production rollout, review/apply a Terraform plan for CSP and IAM, confirm
that native limiter namespace `2026102201` is reserved for this Worker in its
Cloudflare account, and deploy the Worker and static site through their reviewed
paths. Static-site deployment alone does not update Worker code or Terraform.
Worker allowlists must be deployed when posts are added, removed or made draft;
otherwise a newly published post's optional count stays hidden. Verify live
headers, deployment-role behavior and Worker read responses after deployment.

Detailed contracts and operating limits: [Worker README](../views-worker/README.md)
and [infrastructure security controls](../infra/SECURITY.md).

Context7 requests were blocked by the monthly quota; current official docs and
installed package docs were used. Higher limits require Context7 login or
`CONTEXT7_API_KEY`.

References:

- [Next.js October 14 security update](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Cloudflare rate-limit bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Unfixed sprintf-js advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)
