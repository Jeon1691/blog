import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 1. AI 도입 패러독스 — 개인 지표는 오르지만 조직 단위 전달 성과는 떨어진다",
    individual: "개인 단위",
    organization: "조직 단위",
    footer: "가장 느린 단계(리뷰)가 전체 속도를 결정 — Amdahl의 법칙",
    individualMetrics: [
      { label: "코드 품질", value: "+3.4%", source: "DORA 2024" },
      { label: "코드 리뷰 속도", value: "+3.1%", source: "DORA 2024" },
      { label: "문서 품질", value: "+7.5%", source: "DORA 2024" },
      { label: "작업 완료", value: "+21%", source: "Faros 2025" },
      { label: "Copilot 그룹 코딩 속도", value: "+55.8%", source: "Peng 2023" },
    ],
    orgMetrics: [
      { label: "Delivery throughput", value: "−1.5%", source: "DORA 2024" },
      { label: "Delivery stability", value: "−7.2%", source: "DORA 2024" },
      { label: "PR 리뷰 시간", value: "+91%", source: "Faros 2025" },
      { label: "첫 리뷰까지 시간 중앙값", value: "+156.6%", source: "Faros 2026" },
      { label: "리뷰 체류 시간 중앙값", value: "+441.5%", source: "Faros 2026" },
    ],
  },
  en: {
    caption: "Fig 1. The AI productivity paradox — individual metrics climb while org-level delivery slips",
    individual: "Individual",
    organization: "Organization",
    footer: "The slowest stage (review) governs throughput — Amdahl's Law",
    individualMetrics: [
      { label: "Code quality", value: "+3.4%", source: "DORA 2024" },
      { label: "Code review speed", value: "+3.1%", source: "DORA 2024" },
      { label: "Documentation quality", value: "+7.5%", source: "DORA 2024" },
      { label: "Task completion", value: "+21%", source: "Faros 2025" },
      { label: "Copilot group coding speed", value: "+55.8%", source: "Peng 2023" },
    ],
    orgMetrics: [
      { label: "Delivery throughput", value: "−1.5%", source: "DORA 2024" },
      { label: "Delivery stability", value: "−7.2%", source: "DORA 2024" },
      { label: "PR review time", value: "+91%", source: "Faros 2025" },
      { label: "Median time-to-first-review", value: "+156.6%", source: "Faros 2026" },
      { label: "Median review linger time", value: "+441.5%", source: "Faros 2026" },
    ],
  },
} as const;

export function ProductivityParadox({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Panel direction="up" label={s.individual}>
          {s.individualMetrics.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </Panel>
        <Panel direction="down" label={s.organization}>
          {s.orgMetrics.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </Panel>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
        {s.footer}
      </p>
    </Figure>
  );
}

function Panel({
  direction,
  label,
  children,
}: {
  direction: "up" | "down";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </div>
        <div className="text-zinc-900 dark:text-zinc-100 text-xl font-bold leading-none">
          {direction === "up" ? "↑" : "↓"}
        </div>
      </div>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  source,
}: {
  label: string;
  value: string;
  source: string;
}) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <div className="text-zinc-700 dark:text-zinc-300 truncate pr-2">
        {label}
      </div>
      <div className="flex items-baseline gap-2 flex-shrink-0">
        <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
          {source}
        </span>
      </div>
    </div>
  );
}
