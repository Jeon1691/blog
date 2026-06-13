import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 5. 가치 보존 불변식과 위조 발생 — 정상 회로는 입력·출력 가치의 합을 강제하지만, 제약이 누락되면 하나의 note를 중복 소비해 가치를 복제할 수 있다(개념 모델).",
    okTitle: "정상 (제약 충족)",
    okInvariant: "Σ value_in  =  Σ value_out + public_balance",
    okOut: "공급 보존",
    badTitle: "취약 (제약 누락 · 개념 모델)",
    badNote: "하나의 shielded note",
    badSpend: "소비",
    badDouble: "중복 소비",
    badDup: "가치 복제  (Σ in ≠ Σ out)",
    badOut: "counterfeit ZEC",
    note: "Bitquery는 이를 ‘하나의 note를 반복 소비해 가치를 복제하는 missing constraint'로 설명한다 — 공식 설명의 ‘무제한 위조'와 방향은 같되, 세부 구조는 공식 원문과 구분해야 한다.",
  },
  en: {
    caption:
      "Fig 5. The value-conservation invariant and how forgery arises — a sound circuit enforces the sum of input and output value, but a missing constraint lets one note be double-spent to duplicate value (conceptual model).",
    okTitle: "Sound (constraint enforced)",
    okInvariant: "Σ value_in  =  Σ value_out + public_balance",
    okOut: "Supply conserved",
    badTitle: "Vulnerable (missing constraint · concept)",
    badNote: "One shielded note",
    badSpend: "spend",
    badDouble: "double-spend",
    badDup: "value duplicated  (Σ in ≠ Σ out)",
    badOut: "counterfeit ZEC",
    note: "Bitquery frames this as a missing constraint that lets a single note be re-spent to duplicate value — same direction as the official ‘unlimited counterfeit', but the detailed structure must be kept distinct from the official write-up.",
  },
} as const;

export function ValueBalanceForgery({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sound */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {s.okTitle}
          </div>
          <div className="mt-4 flex-1 flex flex-col items-center justify-center">
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 font-mono text-[11px] sm:text-xs text-center text-zinc-700 dark:text-zinc-300">
              {s.okInvariant}
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none my-2">↓</div>
            <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              ✓ {s.okOut}
            </div>
          </div>
        </div>

        {/* Vulnerable */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {s.badTitle}
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              {s.badNote}
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none my-1">↓</div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[14rem]">
              <div className="rounded-md border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-2 py-1.5 text-xs text-center text-rose-700 dark:text-rose-300">
                {s.badSpend}
              </div>
              <div className="rounded-md border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-2 py-1.5 text-xs text-center text-rose-700 dark:text-rose-300">
                {s.badDouble}
              </div>
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none my-1">↓</div>
            <div className="rounded-md border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 font-mono text-[11px] text-center text-rose-700 dark:text-rose-300">
              {s.badDup}
            </div>
            <div className="text-zinc-400 dark:text-zinc-600 leading-none my-1">↓</div>
            <div className="rounded-md border border-rose-400 dark:border-rose-700 bg-rose-100 dark:bg-rose-950/60 px-4 py-2 text-sm font-bold text-rose-800 dark:text-rose-200">
              ✗ {s.badOut}
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
