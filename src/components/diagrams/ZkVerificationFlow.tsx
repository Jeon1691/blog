import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 4. ZK 회로 검증 흐름 — 증명자는 advice column에 witness를 채우고, 회로는 selector가 켜진 행에서 다항식 제약을 평가한다. 검증자는 witness를 직접 보지 않고 제약 충족 여부만 확인한다.",
    steps: [
      { n: "1", title: "비밀 witness", body: "증명자만 아는 비밀 입력값" },
      { n: "2", title: "advice column 채움", body: "witness를 회로의 advice 열에 배치" },
      { n: "3", title: "제약 평가", body: "selector ON 행에서 다항식 제약 계산" },
    ],
    decision: "모든 제약 = 0 ?",
    pass: "검증 통과",
    fail: "검증 실패",
    noteSeen: "검증자는 witness를 직접 보지 않고, 제약이 0이 되는지만 확인한다.",
    noteRisk: "제약이 빠지면(under-constrained) 실제로 틀린 값도 통과할 수 있다.",
  },
  en: {
    caption:
      "Fig 4. ZK circuit verification flow — the prover fills the advice columns with the witness, and the circuit evaluates polynomial constraints on selector-enabled rows. The verifier never sees the witness; it only checks that the constraints hold.",
    steps: [
      { n: "1", title: "Secret witness", body: "Private input known only to the prover" },
      { n: "2", title: "Fill advice columns", body: "Place the witness in the circuit's advice columns" },
      { n: "3", title: "Evaluate constraints", body: "Compute polynomial constraints on selector-ON rows" },
    ],
    decision: "All constraints = 0 ?",
    pass: "Verification passes",
    fail: "Verification fails",
    noteSeen: "The verifier never inspects the witness directly — only whether every constraint evaluates to 0.",
    noteRisk: "If a constraint is missing (under-constrained), a genuinely wrong value can still pass.",
  },
} as const;

export function ZkVerificationFlow({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {s.steps.map((step, i) => (
          <div key={step.n} className="relative">
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 h-full">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                  {step.n}
                </span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                {step.body}
              </p>
            </div>
            {i < s.steps.length - 1 && (
              <div className="hidden sm:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 text-lg z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Decision + outcomes */}
      <div className="flex flex-col items-center mt-4">
        <div className="text-zinc-400 dark:text-zinc-600 leading-none">↓</div>
        <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
          {s.decision}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 w-full max-w-md">
          <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-center text-emerald-800 dark:text-emerald-200">
            ✓ {s.pass}
          </div>
          <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-center text-zinc-700 dark:text-zinc-300">
            ✗ {s.fail}
          </div>
        </div>
      </div>

      {/* Side notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        <div className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
          {s.noteSeen}
        </div>
        <div className="rounded-md border border-dashed border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs text-rose-700 dark:text-rose-300 leading-snug">
          {s.noteRisk}
        </div>
      </div>
    </Figure>
  );
}
