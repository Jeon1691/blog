import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Level = 0 | 1 | 2; // 0 = no impact, 1 = partial, 2 = full

const STRINGS = {
  ko: {
    caption:
      "Fig 8. mitigation × 공격 단계 커버리지 — 어떤 방어가 펭수이의 어느 단계를 막는가.",
    stages: ["Massage", "Hole", "Adjacent", "Trigger", "Corruption", "Exec"],
    rows: [
      { name: "Freelist 난독화", row: [0, 2, 1, 0, 0, 0] as Level[] },
      { name: "슬롯 순서 무작위화", row: [0, 0, 2, 0, 0, 0] as Level[] },
      { name: "캐시/zone 격리 (kalloc_type)", row: [1, 0, 2, 0, 0, 0] as Level[] },
      { name: "Quarantine / GC", row: [0, 1, 1, 1, 0, 0] as Level[] },
      { name: "MTE / PAC · MIE/EMTE", row: [0, 0, 0, 1, 2, 0] as Level[] },
      { name: "CFI", row: [0, 0, 0, 0, 0, 2] as Level[] },
      { name: "PPL · SPTM/TXM", row: [0, 0, 0, 0, 1, 2] as Level[] },
    ],
    legendFull: "강력 차단",
    legendPartial: "부분 차단",
    legendNone: "영향 없음",
    note: "어떤 단일 방어도 모든 단계를 막지 못한다 — 다층 방어가 필수.",
  },
  en: {
    caption:
      "Fig 8. Mitigation × attack-stage coverage — which defense blocks which step.",
    stages: ["Massage", "Hole", "Adjacent", "Trigger", "Corruption", "Exec"],
    rows: [
      { name: "Freelist obfuscation", row: [0, 2, 1, 0, 0, 0] as Level[] },
      { name: "Slot-order randomization", row: [0, 0, 2, 0, 0, 0] as Level[] },
      { name: "Cache/zone isolation (kalloc_type)", row: [1, 0, 2, 0, 0, 0] as Level[] },
      { name: "Quarantine / GC", row: [0, 1, 1, 1, 0, 0] as Level[] },
      { name: "MTE / PAC · MIE/EMTE", row: [0, 0, 0, 1, 2, 0] as Level[] },
      { name: "CFI", row: [0, 0, 0, 0, 0, 2] as Level[] },
      { name: "PPL · SPTM/TXM", row: [0, 0, 0, 0, 1, 2] as Level[] },
    ],
    legendFull: "Full block",
    legendPartial: "Partial",
    legendNone: "No impact",
    note: "No single mitigation covers every stage — defense in depth is required.",
  },
} as const;

const cellClass: Record<Level, string> = {
  0: "bg-zinc-100 dark:bg-zinc-900",
  1: "bg-zinc-400 dark:bg-zinc-600",
  2: "bg-zinc-900 dark:bg-zinc-100",
};

export function DefenseCoverage({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const cols = s.stages.length;
  return (
    <Figure caption={s.caption}>
      <div className="overflow-x-auto">
        <div className="min-w-[36rem]">
          {/* Header */}
          <div
            className="grid gap-1 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2"
            style={{ gridTemplateColumns: `14rem repeat(${cols}, 1fr)` }}
          >
            <div />
            {s.stages.map((stage) => (
              <div key={stage} className="text-center px-1">
                {stage}
              </div>
            ))}
          </div>
          {/* Rows */}
          <div className="space-y-1">
            {s.rows.map((row) => (
              <div
                key={row.name}
                className="grid gap-1 items-center"
                style={{ gridTemplateColumns: `14rem repeat(${cols}, 1fr)` }}
              >
                <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 pr-2 truncate">
                  {row.name}
                </div>
                {row.row.map((lvl, i) => (
                  <div
                    key={i}
                    className={`h-7 rounded ${cellClass[lvl]}`}
                    aria-label={`${row.name} × ${s.stages[i]}: ${lvl}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 justify-center text-xs text-zinc-600 dark:text-zinc-400">
        <LegendChip className={cellClass[2]} label={s.legendFull} />
        <LegendChip className={cellClass[1]} label={s.legendPartial} />
        <LegendChip className={cellClass[0]} label={s.legendNone} bordered />
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}

function LegendChip({
  className,
  label,
  bordered = false,
}: {
  className: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-6 h-4 rounded ${className} ${bordered ? "border border-zinc-300 dark:border-zinc-700" : ""}`}
      />
      <span>{label}</span>
    </div>
  );
}
