import { Figure } from "./Figure";

type Locale = "ko" | "en";

const SCALE_MAX = 260; // visual cap (bits of security)
const SECURITY_THRESHOLD = 128;

const STRINGS = {
  ko: {
    caption:
      "Fig 1. 2048-bit FFDH에 대한 각 알고리즘의 비용 — log₂(연산 수) 기준. 128-bit 위가 \"안전\"한 영역.",
    threshold: "안전 임계 (128-bit)",
    note: "Brute-force / Pollard's rho는 스케일을 한참 벗어남. Index Calculus 계열만이 실용적 위협이고, 그중 NFS-DLP가 2048-bit를 ‘NIST 112-128bit 보안 등급'에 묶는다.",
    rows: [
      { label: "Brute-force", bits: 2048, overflow: true, tone: "muted" },
      { label: "Pollard's rho / BSGS", bits: 1024, overflow: true, tone: "muted" },
      { label: "Index Calculus  $L_p[1/2]$", bits: 180, overflow: false, tone: "subtle" },
      { label: "NFS-DLP  $L_p[1/3]$", bits: 128, overflow: false, tone: "strong" },
    ],
  },
  en: {
    caption:
      "Fig 1. Per-algorithm cost against 2048-bit FFDH — log₂(operations). Anything above the 128-bit line counts as ‘secure today'.",
    threshold: "Secure threshold (128-bit)",
    note: "Brute-force and Pollard's rho are off-scale; only the Index Calculus family is a practical threat. NFS-DLP is what pins 2048-bit FFDH at the NIST 112–128-bit security level.",
    rows: [
      { label: "Brute-force", bits: 2048, overflow: true, tone: "muted" },
      { label: "Pollard's rho / BSGS", bits: 1024, overflow: true, tone: "muted" },
      { label: "Index Calculus  $L_p[1/2]$", bits: 180, overflow: false, tone: "subtle" },
      { label: "NFS-DLP  $L_p[1/3]$", bits: 128, overflow: false, tone: "strong" },
    ],
  },
} as const;

export function DLPComplexity({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="space-y-3">
        {s.rows.map((r) => {
          const width = Math.min(r.bits, SCALE_MAX) / SCALE_MAX;
          const barClass =
            r.tone === "strong"
              ? "bg-zinc-900 dark:bg-zinc-100"
              : r.tone === "subtle"
                ? "bg-zinc-500 dark:bg-zinc-400"
                : "bg-zinc-300 dark:bg-zinc-600";
          return (
            <div key={r.label} className="grid grid-cols-[10rem_1fr_6rem] sm:grid-cols-[14rem_1fr_7rem] items-center gap-3 text-xs sm:text-sm">
              <div className="text-zinc-700 dark:text-zinc-300 truncate">
                {r.label}
              </div>
              <div className="relative h-5 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <div
                  className={`h-full ${barClass}`}
                  style={{ width: `${width * 100}%` }}
                />
                {r.overflow && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                    →
                  </div>
                )}
              </div>
              <div className="font-bold tabular-nums text-right text-zinc-900 dark:text-zinc-100">
                2<sup>{r.bits}</sup>
              </div>
            </div>
          );
        })}
        <div className="grid grid-cols-[10rem_1fr_6rem] sm:grid-cols-[14rem_1fr_7rem] items-center gap-3 text-xs sm:text-sm">
          <div />
          <div className="relative h-5">
            <div
              className="absolute top-0 bottom-0 w-px bg-zinc-900 dark:bg-zinc-100"
              style={{ left: `${(SECURITY_THRESHOLD / SCALE_MAX) * 100}%` }}
            />
            <div
              className="absolute -top-1 -translate-x-1/2 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
              style={{ left: `${(SECURITY_THRESHOLD / SCALE_MAX) * 100}%` }}
            >
              ↑ {s.threshold}
            </div>
          </div>
          <div />
        </div>
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
