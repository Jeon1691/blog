import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 1. 요청 경로 아키텍처 — DNS → 엣지(CloudFront) → OAC 서명 → 비공개 S3. 조회수만 별도 Cloudflare Worker로 분리.",
    note: "정적 자산은 100% AWS 엣지에서, 동적 조회수만 Cloudflare Worker+KV로 — origin(S3)은 외부에 직접 노출되지 않는다.",
    tierClient: "클라이언트",
    tierDns: "DNS",
    tierEdge: "엣지 / CDN",
    tierOrigin: "오리진 (비공개)",
    browser: "방문자 브라우저",
    browserSub: "develicit.com 요청",
    route53: "Route 53",
    route53Sub: "호스트존 · apex A/AAAA alias → CloudFront",
    cf: "CloudFront 배포",
    cfSub: "글로벌 엣지 캐시",
    oac: "OAC (SigV4 서명)",
    oacSub: "이 배포만 S3 접근 — 버킷 정책으로 강제",
    s3: "S3 버킷",
    s3Sub: "Block Public Access · next export(out/) 정적 자산",
    cfBadges: [
      "ACM TLS 인증서 (us-east-1)",
      "HTTP/2 · HTTP/3",
      "Brotli · Gzip 압축",
      "보안 헤더 정책 (HSTS 등)",
      "SPA 404 → index 매핑",
    ],
    sidecarTitle: "조회수 카운터 (사이드카)",
    worker: "Cloudflare Worker",
    workerSub: "POST /views/:slug",
    kv: "Workers KV",
    kvSub: "slug별 카운트 영구 저장",
  },
  en: {
    caption:
      "Fig 1. Request-path architecture — DNS → edge (CloudFront) → OAC-signed → private S3. View counts split off to a Cloudflare Worker.",
    note: "Static assets serve 100% from the AWS edge; only the dynamic view count lives on a Cloudflare Worker + KV — the S3 origin is never exposed directly.",
    tierClient: "Client",
    tierDns: "DNS",
    tierEdge: "Edge / CDN",
    tierOrigin: "Origin (private)",
    browser: "Visitor browser",
    browserSub: "requests develicit.com",
    route53: "Route 53",
    route53Sub: "hosted zone · apex A/AAAA alias → CloudFront",
    cf: "CloudFront distribution",
    cfSub: "global edge cache",
    oac: "OAC (SigV4 signed)",
    oacSub: "only this distribution can read S3 — enforced by bucket policy",
    s3: "S3 bucket",
    s3Sub: "Block Public Access · next-export (out/) static assets",
    cfBadges: [
      "ACM TLS cert (us-east-1)",
      "HTTP/2 · HTTP/3",
      "Brotli · Gzip compression",
      "Security-headers policy (HSTS, …)",
      "SPA 404 → index mapping",
    ],
    sidecarTitle: "View counter (sidecar)",
    worker: "Cloudflare Worker",
    workerSub: "POST /views/:slug",
    kv: "Workers KV",
    kvSub: "persists per-slug counts",
  },
} as const;

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-1">
      {label && (
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-0.5">
          {label}
        </span>
      )}
      <span className="text-zinc-400 dark:text-zinc-600 text-lg leading-none">↓</span>
    </div>
  );
}

function Node({
  tier,
  title,
  sub,
  filled = false,
}: {
  tier: string;
  title: string;
  sub: string;
  filled?: boolean;
}) {
  return (
    <div
      className={`rounded-md border w-full max-w-md mx-auto px-4 py-3 ${
        filled
          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
          : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${
          filled ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400 dark:text-zinc-500"
        }`}
      >
        {tier}
      </div>
      <div className="font-bold text-sm">{title}</div>
      <div
        className={`text-xs leading-snug mt-0.5 ${
          filled ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {sub}
      </div>
    </div>
  );
}

export function SelfHostArchitecture({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="flex flex-col">
        <Node tier={s.tierClient} title={s.browser} sub={s.browserSub} />
        <Arrow />
        <Node tier={s.tierDns} title={s.route53} sub={s.route53Sub} />
        <Arrow />
        <Node tier={s.tierEdge} title={s.cf} sub={s.cfSub} filled />

        {/* CloudFront capability badges */}
        <div className="w-full max-w-md mx-auto mt-2 flex flex-wrap gap-1.5 justify-center">
          {s.cfBadges.map((b) => (
            <span
              key={b}
              className="text-[10px] rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2 py-0.5"
            >
              {b}
            </span>
          ))}
        </div>

        <Arrow />
        <Node tier={s.tierEdge} title={s.oac} sub={s.oacSub} />
        <Arrow />
        <Node tier={s.tierOrigin} title={s.s3} sub={s.s3Sub} />
      </div>

      {/* Sidecar: view counter */}
      <div className="mt-6 pt-5 border-t border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-3 text-center">
          {s.sidecarTitle}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-center">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {s.worker}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {s.workerSub}
            </div>
          </div>
          <span className="text-zinc-400 dark:text-zinc-600 rotate-90 sm:rotate-0">↔</span>
          <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-center">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {s.kv}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{s.kvSub}</div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
