import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 10. P-256 검증 비용 — Solidity만으로 구현하면 가스가 비싸 지갑 UX에 부담이 되지만, precompile을 쓰면 네이티브 검증으로 비용이 낮아져 Passkey 기반 AA가 실용화된다.",
    leftTitle: "Solidity만으로 P-256 검증",
    leftSteps: ["복잡한 타원곡선 연산을 직접 수행", "큰 가스 비용"],
    leftOut: "실사용 지갑 UX에 부담",
    rightTitle: "P-256 precompile 사용",
    rightSteps: ["고정된 네이티브 검증 경로", "낮은 가스 비용 · 단순한 verifier"],
    rightOut: "Passkey 기반 AA 실용화",
    vs: "vs",
  },
  en: {
    caption:
      "Fig 10. Cost of P-256 verification — pure-Solidity verification is gas-heavy and strains wallet UX, while a precompile drops it to a native path and makes Passkey-based AA practical.",
    leftTitle: "P-256 verification in pure Solidity",
    leftSteps: ["Runs the elliptic-curve math by hand", "High gas cost"],
    leftOut: "Strains real wallet UX",
    rightTitle: "Using a P-256 precompile",
    rightSteps: ["Fixed native verification path", "Low gas · simple verifier"],
    rightOut: "Passkey-based AA becomes practical",
    vs: "vs",
  },
} as const;

export function P256VerificationCost({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <Lane
          title={s.leftTitle}
          steps={s.leftSteps}
          outcome={s.leftOut}
          tone="bad"
        />
        <div className="hidden sm:flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          {s.vs}
        </div>
        <Lane
          title={s.rightTitle}
          steps={s.rightSteps}
          outcome={s.rightOut}
          tone="good"
        />
      </div>
    </Figure>
  );
}

function Lane({
  title,
  steps,
  outcome,
  tone,
}: {
  title: string;
  steps: readonly string[];
  outcome: string;
  tone: "bad" | "good";
}) {
  const headClass =
    tone === "good"
      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
      : "border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100";
  const outClass =
    tone === "good"
      ? "border-emerald-400 dark:border-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200"
      : "border-rose-400 dark:border-rose-700 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200";
  return (
    <div className="flex flex-col">
      <div
        className={`rounded-md border px-3 py-2.5 text-center text-sm font-bold ${headClass}`}
      >
        {title}
      </div>
      {steps.map((step) => (
        <div key={step} className="contents">
          <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none mt-1">
            ↓
          </div>
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-center text-zinc-700 dark:text-zinc-300 mt-1">
            {step}
          </div>
        </div>
      ))}
      <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none mt-1">
        ↓
      </div>
      <div
        className={`flex-1 rounded-md border px-3 py-2.5 text-center text-sm font-semibold mt-1 flex items-center justify-center ${outClass}`}
      >
        {tone === "good" ? "✓ " : "✗ "}
        {outcome}
      </div>
    </div>
  );
}
