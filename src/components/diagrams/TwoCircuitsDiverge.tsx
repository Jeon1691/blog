import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 3. 같은 위조 입력, 두 회로의 다른 결과 — 정상 회로는 곱셈 제약에서 위조를 거부하지만, 제약이 일부 누락된 under-constrained 회로는 같은 입력을 통과시킨다.",
    input: "위조 입력",
    inputSub: "EC multiplication을 만족하지 않는 false witness",
    normal: "정상 회로",
    normalSub: "모든 제약을 검사",
    normalCheck: "모든 제약 통과?",
    normalEdge: "곱셈 제약에서 걸림",
    normalOut: "거부 — 위조 차단",
    under: "under-constrained 회로",
    underSub: "곱셈 검증 제약 일부 누락",
    underCheck: "남은 제약만 통과?",
    underEdge: "누락된 제약은 검사 안 함",
    underOut: "통과 — 위조 ZEC 생성",
    note: "차이는 ‘공식이 틀려서'가 아니라 ‘검사해야 할 관계가 회로에 적혀 있지 않아서' 생긴다.",
  },
  en: {
    caption:
      "Fig 3. Same forged input, two different outcomes — a sound circuit rejects the forgery at the multiplication constraint, while an under-constrained circuit (a missing check) lets the same input through.",
    input: "Forged input",
    inputSub: "A false witness that does not satisfy the EC multiplication",
    normal: "Sound circuit",
    normalSub: "Checks every constraint",
    normalCheck: "All constraints satisfied?",
    normalEdge: "caught by the multiplication constraint",
    normalOut: "Reject — forgery blocked",
    under: "Under-constrained circuit",
    underSub: "Some multiplication checks missing",
    underCheck: "Only the remaining constraints?",
    underEdge: "missing constraint is never checked",
    underOut: "Pass — counterfeit ZEC minted",
    note: "The difference is not a wrong formula — it is a relationship that was never written into the circuit to be checked.",
  },
} as const;

export function TwoCircuitsDiverge({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      {/* Shared forged input */}
      <div className="mx-auto max-w-sm rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-4 py-2.5 text-center">
        <div className="font-bold text-sm text-rose-800 dark:text-rose-200">
          {s.input}
        </div>
        <div className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
          {s.inputSub}
        </div>
      </div>

      <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
        ↓
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sound circuit → reject (good) */}
        <Branch
          title={s.normal}
          sub={s.normalSub}
          check={s.normalCheck}
          edge={s.normalEdge}
          outcome={s.normalOut}
          tone="safe"
          mark="✓"
        />
        {/* Under-constrained → pass (bad) */}
        <Branch
          title={s.under}
          sub={s.underSub}
          check={s.underCheck}
          edge={s.underEdge}
          outcome={s.underOut}
          tone="danger"
          mark="✗"
        />
      </div>

      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}

function Branch({
  title,
  sub,
  check,
  edge,
  outcome,
  tone,
  mark,
}: {
  title: string;
  sub: string;
  check: string;
  edge: string;
  outcome: string;
  tone: "safe" | "danger";
  mark: string;
}) {
  const outClass =
    tone === "safe"
      ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
      : "border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200";
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
        {title}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{sub}</div>

      <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none mt-3">
        ↓
      </div>
      <div className="rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-xs text-center text-zinc-700 dark:text-zinc-300 mt-1">
        {check}
      </div>
      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-1.5 leading-tight">
        {edge}
      </div>
      <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none">
        ↓
      </div>
      <div
        className={`rounded-md border px-3 py-2 text-sm font-semibold text-center mt-1 ${outClass}`}
      >
        {mark} {outcome}
      </div>
    </div>
  );
}
