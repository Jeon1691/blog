import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Kind = "skip" | "apply";

type Run = {
  label: string; // nonce range shown on the chip, e.g. "775 … 808"
  count: number; // how many authorizations the chip stands for
  kind: Kind;
};

// The live nonce of Binance 14 when the authorization list was processed.
const LIVE_NONCE = 809;
// Nonces are shown without the shared 189147xx prefix to keep the chips short.
const NONCE_PREFIX = "189147";

const STRINGS = {
  ko: {
    caption:
      "Fig 3. 권한 50개를 어떤 순서로 넣느냐가 흔적의 크기를 바꾼다 — 오름차순이었다면 16개가 줄줄이 적용돼 nonce가 크게 뛰었겠지만, 실제 내림차순에서는 하나만 적용되고 나머지 49개는 조용히 실패했다.",
    prefixNote: `nonce는 앞자리 ${NONCE_PREFIX}를 생략해 표시`,
    liveNonce: `처리 시점 nonce: ${LIVE_NONCE}`,
    ascTitle: "오름차순이었다면",
    descTitle: "실제 — 내림차순",
    skip: "건너뜀",
    apply: "적용",
    ascResult: "nonce 809 → 825 (+16)",
    ascImpact: "이미 서명해 둔 출금(nonce 810~824)이 모두 무효 → 운영 알림",
    descResult: "nonce 809 → 810 (+1)",
    descImpact: "다른 트랜잭션처럼 보임 → 흔적 최소화",
    unit: "개",
  },
  en: {
    caption:
      "Fig 3. The order of the 50 authorizations decides how loud the attack is — in ascending order 16 would have applied in a chain and the nonce would have jumped, but in the actual descending order only one applied and the other 49 failed silently.",
    prefixNote: `nonces shown without the shared ${NONCE_PREFIX} prefix`,
    liveNonce: `live nonce at processing: ${LIVE_NONCE}`,
    ascTitle: "If ascending",
    descTitle: "Actual — descending",
    skip: "skipped",
    apply: "applied",
    ascResult: "nonce 809 → 825 (+16)",
    ascImpact: "every pre-signed withdrawal (nonces 810–824) invalidated → ops alerts",
    descResult: "nonce 809 → 810 (+1)",
    descImpact: "looks like any other transaction → minimal footprint",
    unit: "",
  },
} as const;

const ASCENDING: Run[] = [
  { label: "775 … 808", count: 34, kind: "skip" },
  { label: "809 … 824", count: 16, kind: "apply" },
];

const DESCENDING: Run[] = [
  { label: "824 … 810", count: 15, kind: "skip" },
  { label: "809", count: 1, kind: "apply" },
  { label: "808 … 775", count: 34, kind: "skip" },
];

export function AuthNonceOrdering({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400 mb-5">
          <span className="font-mono">{s.liveNonce}</span>
          <span>·</span>
          <span>{s.prefixNote}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Column
            title={s.ascTitle}
            runs={ASCENDING}
            result={s.ascResult}
            impact={s.ascImpact}
            tone="danger"
            s={s}
          />
          <Column
            title={s.descTitle}
            runs={DESCENDING}
            result={s.descResult}
            impact={s.descImpact}
            tone="quiet"
            s={s}
          />
        </div>
      </div>
    </Figure>
  );
}

function Column({
  title,
  runs,
  result,
  impact,
  tone,
  s,
}: {
  title: string;
  runs: Run[];
  result: string;
  impact: string;
  tone: "danger" | "quiet";
  s: (typeof STRINGS)[Locale];
}) {
  const resultCls =
    tone === "danger"
      ? "border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200"
      : "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200";
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 text-center mb-3">
        {title}
      </div>
      <ol className="space-y-1.5">
        {runs.map((r) => (
          <li
            key={r.label}
            className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs ${
              r.kind === "apply"
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 font-semibold"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span className="font-mono tabular-nums">{r.label}</span>
            <span>
              {r.kind === "apply" ? `✓ ${s.apply}` : s.skip} · {r.count}
              {s.unit}
            </span>
          </li>
        ))}
      </ol>
      <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-2">↓</div>
      <div className={`rounded-md border px-3 py-2 text-center ${resultCls}`}>
        <div className="font-mono text-sm font-bold">{result}</div>
        <div className="text-[11px] mt-0.5 opacity-90">{impact}</div>
      </div>
    </div>
  );
}
