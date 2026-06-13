import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 9. 새 shielded pool + turnstile accounting 회복 방안 — Orchard에서 빠져나오는 총량을 공개적으로 추적해, 정당한 유입보다 더 많이 빠져나오면 과거 위조 가능성이 드러나게 한다.",
    from: "Orchard pool",
    fromSub: "위조 가능했던 구역",
    edge: "turnstile accounting 강제",
    to: "새 shielded pool",
    toSub: "공개적으로 관측 가능한 경계",
    decision: "빠져나온 총량 > 정당한 유입 총량?",
    yes: "예",
    yesOut: "과거 위조분 존재 가능성 노출",
    no: "아니오",
    noOut: "공급 무결성 검증 가능",
    note: "fake coin이 pool 안에 머무르면 보이지 않지만, 현금화하거나 다른 pool로 옮기려면 공개 경계를 지나야 한다 — 사후 검증 가능한 accounting boundary.",
  },
  en: {
    caption:
      "Fig 9. Recovery plan: a new shielded pool + turnstile accounting — publicly track the total leaving Orchard, so if more exits than legitimately entered, past forgery becomes visible.",
    from: "Orchard pool",
    fromSub: "the region where forgery was possible",
    edge: "enforce turnstile accounting",
    to: "new shielded pool",
    toSub: "a publicly observable boundary",
    decision: "Total exiting > total legitimately entered?",
    yes: "yes",
    yesOut: "past forgery may be exposed",
    no: "no",
    noOut: "supply integrity is verifiable",
    note: "A fake coin is invisible while it stays in the pool, but cashing it out or moving it to another pool must cross a public boundary — an after-the-fact accounting boundary.",
  },
} as const;

export function TurnstileRecovery({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      {/* Orchard → new pool */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
        <div className="rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-4 py-2.5 text-center flex-1 sm:max-w-[16rem]">
          <div className="font-bold text-sm text-rose-800 dark:text-rose-200">
            {s.from}
          </div>
          <div className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
            {s.fromSub}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-1">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight text-center max-w-[8rem]">
            {s.edge}
          </div>
          <div className="text-zinc-400 dark:text-zinc-600 text-lg leading-none rotate-90 sm:rotate-0">
            →
          </div>
        </div>

        <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-center flex-1 sm:max-w-[16rem]">
          <div className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
            {s.to}
          </div>
          <div className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
            {s.toSub}
          </div>
        </div>
      </div>

      {/* Decision + branches */}
      <div className="flex flex-col items-center mt-5">
        <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-center text-zinc-800 dark:text-zinc-200">
          {s.decision}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 w-full max-w-lg">
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400">
              {s.yes}
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
            <div className="w-full rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs sm:text-sm text-center text-rose-800 dark:text-rose-200">
              {s.yesOut}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              {s.no}
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
            <div className="w-full rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-xs sm:text-sm text-center text-emerald-800 dark:text-emerald-200">
              {s.noOut}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
