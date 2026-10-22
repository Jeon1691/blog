# Security controls

The GitHub deploy role accepts only the `repo:OWNER/REPO:ref:refs/heads/main`
OIDC subject and `sts.amazonaws.com` audience. Push deployments and manual
deployments from `main` keep working; pull requests, tags, other branches, and
environment subjects cannot assume the role. If a protected GitHub environment
or immutable OIDC subject format is adopted later, update the trust policy
deliberately to match it. Protect `main` in GitHub separately.

CloudFront enforces the CSP declared in `cloudfront.tf`. It blocks embedding the
blog, plugins, base tag overrides, inline event handlers, external scripts from
unlisted hosts, and connections to unlisted origins. The existing Next.js
hydration and theme bootstrap require `script-src 'unsafe-inline'` for this
static export; this policy does **not** stop all inline script injection. JSON-LD
serialization escapes HTML tag openers separately. Pagefind is allowed to compile
WebAssembly and create its blob worker without permitting JavaScript eval.
Giscus frames are allowed, and the view counter has its exact connection origin.
HTTPS images remain allowed for article illustrations.

AdSense is currently disabled in `src/lib/site.ts`. Before enabling it, review
Google's current CSP guidance, add only the required origins, and test ads with
the enforced policy. Other third-party embeds need the same review. Test search,
theme switching, and Giscus in a browser using the policy before applying it.

These files change infrastructure configuration only. `terraform validate`
checks configuration and provider schemas; it does not establish live AWS state.
Review a Terraform plan before applying the policy or OIDC restriction, and
verify the response header and deployment role after an authorized apply.

References:
- [GitHub OIDC trust policy](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [Next.js JSON-LD safety](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js CSP and static pages](https://nextjs.org/docs/app/guides/content-security-policy)
