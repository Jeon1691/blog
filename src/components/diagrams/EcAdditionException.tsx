import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 6. EC 점 덧셈의 예외 케이스와 제약 필요성 — incomplete addition 공식은 x₁ = x₂ 같은 예외 입력에서 안전하지 않아, 회로가 그 케이스를 추가로 제약하지 않으면 false input이 통과할 수 있다.",
    root: "EC 점 덧셈  P + Q",
    decision: "예외 케이스?  (x₁ = x₂)",
    generalEdge: "일반 케이스",
    general: "incomplete addition 사용 가능",
    exceptionEdge: "예외 케이스",
    exception: "추가 제약 또는 complete addition 필요",
    riskEdge: "제약 부족 시",
    risk: "false input 통과 — soundness failure",
    note: "halo2 Book도 incomplete addition이 임의 입력에 안전하지 않음을 명시한다. 공식 자체가 아니라 ‘어떤 입력 영역에서 쓰는지'를 회로가 강제해야 한다.",
  },
  en: {
    caption:
      "Fig 6. The exception case in EC point addition and why it needs a constraint — the incomplete-addition formula is unsafe for exception inputs such as x₁ = x₂, so unless the circuit constrains that case, a false input can pass.",
    root: "EC point addition  P + Q",
    decision: "Exception case?  (x₁ = x₂)",
    generalEdge: "general case",
    general: "incomplete addition is usable",
    exceptionEdge: "exception case",
    exception: "needs an extra constraint or complete addition",
    riskEdge: "if under-constrained",
    risk: "false input passes — soundness failure",
    note: "The halo2 Book itself states incomplete addition is not safe for arbitrary inputs. It is not the formula that is wrong — the circuit must enforce the input domain it is used on.",
  },
} as const;

export function EcAdditionException({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="flex flex-col items-center">
        {/* Root */}
        <div className="rounded-md border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-50 dark:text-zinc-900 font-mono">
          {s.root}
        </div>
        <div className="text-zinc-400 dark:text-zinc-600 leading-none mt-1">↓</div>

        {/* Decision */}
        <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
          {s.decision}
        </div>
      </div>

      {/* Two branches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* General → safe */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
            {s.generalEdge}
          </div>
          <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
          <div className="w-full rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-center text-emerald-800 dark:text-emerald-200">
            {s.general}
          </div>
        </div>

        {/* Exception → needs constraint → risk */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-500">
            {s.exceptionEdge}
          </div>
          <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
          <div className="w-full rounded-md border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm text-center text-amber-800 dark:text-amber-200">
            {s.exception}
          </div>
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">
            {s.riskEdge}
          </div>
          <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
          <div className="w-full rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm font-semibold text-center text-rose-800 dark:text-rose-200 mt-1">
            {s.risk}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
