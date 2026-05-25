import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Variant = "block" | "warn" | "recover";

const STRINGS = {
  ko: {
    caption:
      "Fig 5. 다층 신뢰 게이트 — 단일 LGTM 대신 L1~L5가 각각 다른 위험을 막는다",
    footer:
      "하나의 PR이 머지되려면 L1 → L2 → L3 → L4를 통과해야 하고, L5는 머지 후 안전망 역할",
    badges: {
      block: "차단",
      autoBlock: "자동 차단",
      warn: "경고",
      recover: "사후 복구",
    },
    layers: [
      {
        id: "L1",
        title: "Deterministic Guardrails",
        desc: "린트 · 타입 · 단위/통합 테스트 · 보안 스캔",
        badgeKey: "autoBlock" as const,
        variant: "block" as Variant,
      },
      {
        id: "L2",
        title: "AI Code Review",
        desc: "구문 · 스타일 · 단순 버그 · 보안 패턴 1차 필터",
        badgeKey: "warn" as const,
        variant: "warn" as Variant,
      },
      {
        id: "L3",
        title: "Spec / Intent Review",
        desc: "사람이 의도와 수용 기준 검토 — 코드 작성 전 권장",
        badgeKey: "block" as const,
        variant: "block" as Variant,
      },
      {
        id: "L4",
        title: "Human Block Zone",
        desc: "Tribal Knowledge · Regulated · 네이티브 크리티컬 패스",
        badgeKey: "block" as const,
        variant: "block" as Variant,
      },
      {
        id: "L5",
        title: "Post-merge Observability",
        desc: "모니터링 · Feature Flag · Canary · 자동 롤백",
        badgeKey: "recover" as const,
        variant: "recover" as Variant,
      },
    ],
  },
  en: {
    caption:
      "Fig 5. Multi-layer gates — L1–L5 each catch different risks, replacing the single LGTM bottleneck",
    footer:
      "A PR must clear L1 → L2 → L3 → L4 to merge; L5 is the post-merge safety net",
    badges: {
      block: "block",
      autoBlock: "auto-block",
      warn: "warn",
      recover: "recover",
    },
    layers: [
      {
        id: "L1",
        title: "Deterministic Guardrails",
        desc: "Lint · types · unit/integration tests · security scans",
        badgeKey: "autoBlock" as const,
        variant: "block" as Variant,
      },
      {
        id: "L2",
        title: "AI Code Review",
        desc: "First-pass filter: syntax · style · obvious bugs · security patterns",
        badgeKey: "warn" as const,
        variant: "warn" as Variant,
      },
      {
        id: "L3",
        title: "Spec / Intent Review",
        desc: "Humans review intent + acceptance criteria — before coding starts",
        badgeKey: "block" as const,
        variant: "block" as Variant,
      },
      {
        id: "L4",
        title: "Human Block Zone",
        desc: "Tribal knowledge · regulated paths · native critical paths",
        badgeKey: "block" as const,
        variant: "block" as Variant,
      },
      {
        id: "L5",
        title: "Post-merge Observability",
        desc: "Monitoring · feature flags · canary · auto-rollback",
        badgeKey: "recover" as const,
        variant: "recover" as Variant,
      },
    ],
  },
} as const;

function Badge({ variant, children }: { variant: Variant; children: string }) {
  const styles: Record<Variant, string> = {
    block: "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900",
    warn: "border border-zinc-400 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400",
    recover: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function SwissCheeseGate({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="space-y-2">
        {s.layers.map((l) => (
          <div
            key={l.id}
            className="flex items-stretch gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="flex items-center justify-center w-14 sm:w-16 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-bold text-sm flex-shrink-0">
              {l.id}
            </div>
            <div className="flex-1 min-w-0 py-2.5 sm:py-3">
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                {l.title}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {l.desc}
              </div>
            </div>
            <div className="flex items-center pr-3 sm:pr-4 flex-shrink-0">
              <Badge variant={l.variant}>{s.badges[l.badgeKey]}</Badge>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
        {s.footer}
      </p>
    </Figure>
  );
}
