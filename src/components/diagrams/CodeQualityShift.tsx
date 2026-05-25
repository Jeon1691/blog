import { Figure } from "./Figure";

const metrics = [
  {
    label: "Moved (리팩토링·재사용)",
    before: 25,
    after: 8, // <10%, draw at ~8 for visual
    afterLabel: "<10%",
    direction: "down" as const,
    note: "재사용 줄어듦",
  },
  {
    label: "Copy/Paste (복사·붙여넣기)",
    before: 8,
    after: 18, // ~18%
    afterLabel: "~18%",
    direction: "up" as const,
    note: "중복 코드 폭증",
  },
];

const SCALE_MAX = 30; // % axis

export function CodeQualityShift() {
  return (
    <Figure caption="Fig 2. GitClear — 211M LOC를 4년에 걸쳐 분석한 결과 재사용은 줄고, 복사는 늘었다">
      <div className="space-y-6">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {m.label}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {m.note} {m.direction === "down" ? "↓" : "↑"}
              </div>
            </div>
            <Row year="2021" pct={m.before} label={`${m.before}%`} muted />
            <Row year="2025" pct={m.after} label={m.afterLabel} />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>사상 처음으로 복사된 라인이 이동된 라인을 초과</span>
      </div>
    </Figure>
  );
}

function Row({
  year,
  pct,
  label,
  muted = false,
}: {
  year: string;
  pct: number;
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="w-10 text-zinc-500 dark:text-zinc-400 tabular-nums">
        {year}
      </div>
      <div className="flex-1 h-5 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <div
          className={`h-full ${muted ? "bg-zinc-300 dark:bg-zinc-700" : "bg-zinc-900 dark:bg-zinc-100"}`}
          style={{ width: `${(pct / SCALE_MAX) * 100}%` }}
        />
      </div>
      <div className="w-12 font-bold tabular-nums text-zinc-900 dark:text-zinc-100 text-right">
        {label}
      </div>
    </div>
  );
}
