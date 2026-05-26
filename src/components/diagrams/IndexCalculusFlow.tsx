import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 3. Index Calculus 4단계 — 작은 소수 인수분해를 활용해 DLP를 선형대수 문제로 환원한다.",
    steps: [
      {
        id: "1",
        title: "Factor base",
        body: "작은 소수 집합 선택",
        formula: "B = {2, 3, 5, 7, …, p_k}",
      },
      {
        id: "2",
        title: "Relations",
        body: "B-smooth한 g^e 를 모아 관계식 생성",
        formula: "g^e ≡ ∏ p_i^{a_i} (mod p)",
      },
      {
        id: "3",
        title: "Linear algebra",
        body: "선형 연립방정식 풀어 log_g p_i 추출",
        formula: "{ log_g p_i }  mod (p−1)",
      },
      {
        id: "4",
        title: "Individual log",
        body: "h·g^s 가 smooth해질 때까지 시도",
        formula: "log_g h = Σ b_i · log_g p_i − s",
      },
    ],
    bottom: "한 번 Step 1–3을 수행하면, 같은 p에서의 새 목표 h는 Step 4만으로 즉시 풀린다 — Logjam의 핵심.",
  },
  en: {
    caption: "Fig 3. Index Calculus in four steps — small-prime factorization reduces the DLP to a linear-algebra problem.",
    steps: [
      {
        id: "1",
        title: "Factor base",
        body: "Pick a set of small primes",
        formula: "B = {2, 3, 5, 7, …, p_k}",
      },
      {
        id: "2",
        title: "Relations",
        body: "Gather smooth g^e to form relations",
        formula: "g^e ≡ ∏ p_i^{a_i} (mod p)",
      },
      {
        id: "3",
        title: "Linear algebra",
        body: "Solve the system for log_g p_i",
        formula: "{ log_g p_i }  mod (p−1)",
      },
      {
        id: "4",
        title: "Individual log",
        body: "Retry until h·g^s becomes smooth",
        formula: "log_g h = Σ b_i · log_g p_i − s",
      },
    ],
    bottom: "Do Steps 1–3 once and any new target h sharing the same p falls in Step 4 alone — the trick behind Logjam.",
  },
} as const;

export function IndexCalculusFlow({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="relative">
        <div className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-3 relative">
          {s.steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="relative z-10 w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-bold text-xl">
                {step.id}
              </div>
              <div className="mt-3 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {step.title}
              </div>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                {step.body}
              </p>
              <div className="mt-3 inline-flex font-mono text-[10px] text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 leading-tight">
                {step.formula}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.bottom}
      </p>
    </Figure>
  );
}
