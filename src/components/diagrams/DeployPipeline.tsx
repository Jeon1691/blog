import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Stage = { n: string; title: string; body: string; tag?: string };

const STRINGS = {
  ko: {
    caption:
      "Fig 2. 배포 파이프라인 — git push 한 번이 OIDC keyless 인증 → 빌드 → S3 동기화 → 캐시 무효화까지 자동으로 이어진다.",
    note: "장기 보관 액세스 키가 GitHub에 존재하지 않는다 — OIDC로 매 실행마다 단기 STS 자격증명을 발급받아 역할을 위임받는다.",
    stages: [
      { n: "1", title: "git push → main", body: "GitHub Actions deploy 워크플로 트리거" },
      { n: "2", title: "OIDC 인증", body: "GitHub OIDC 토큰 → STS AssumeRoleWithWebIdentity → 단기 자격증명", tag: "keyless (no secrets)" },
      { n: "3", title: "빌드", body: "pnpm install --frozen-lockfile → next export(out/) + Pagefind 색인" },
      { n: "4", title: "S3 동기화", body: "_next/ 는 immutable(1년 캐시), 나머지는 max-age=0 + --delete", tag: "2단계 캐시 정책" },
      { n: "5", title: "CloudFront 무효화", body: "create-invalidation --paths \"/*\" 로 엣지 캐시 갱신" },
    ] as Stage[],
  },
  en: {
    caption:
      "Fig 2. Deploy pipeline — one git push cascades into keyless OIDC auth → build → S3 sync → cache invalidation, all automatically.",
    note: "No long-lived access keys live in GitHub — OIDC mints short-lived STS credentials per run to assume the deploy role.",
    stages: [
      { n: "1", title: "git push → main", body: "Triggers the GitHub Actions deploy workflow" },
      { n: "2", title: "OIDC auth", body: "GitHub OIDC token → STS AssumeRoleWithWebIdentity → short-lived creds", tag: "keyless (no secrets)" },
      { n: "3", title: "Build", body: "pnpm install --frozen-lockfile → next export (out/) + Pagefind index" },
      { n: "4", title: "S3 sync", body: "_next/ immutable (1-yr cache), the rest max-age=0 + --delete", tag: "two-tier cache policy" },
      { n: "5", title: "CloudFront invalidate", body: "create-invalidation --paths \"/*\" refreshes the edge cache" },
    ] as Stage[],
  },
} as const;

export function DeployPipeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {s.stages.map((st, i) => (
          <div key={st.n} className="relative">
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 h-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold w-5 h-5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                  {st.n}
                </span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                  {st.title}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                {st.body}
              </p>
              {st.tag && (
                <span className="inline-block mt-2 text-[10px] font-semibold rounded-full border border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 px-2 py-0.5">
                  {st.tag}
                </span>
              )}
            </div>
            {i < s.stages.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 text-lg z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
