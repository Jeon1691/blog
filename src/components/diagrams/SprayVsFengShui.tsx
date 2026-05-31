import { Figure } from "./Figure";

type Locale = "ko" | "en";

// A 24-slot memory strip. true = occupied by the technique's payload.
const SPRAY = Array.from({ length: 24 }, (_, i) => i % 1 === 0); // all filled (blanket)
const FENGSHUI = Array.from({ length: 24 }, (_, i) => i === 11); // one precise slot

const STRINGS = {
  ko: {
    caption:
      "Fig 4. Heap Spraying vs Heap Feng Shui — 넓게 뿌려 확률을 높이는 전략 vs 단 한 슬롯을 결정적으로 점유하는 전략.",
    sprayTitle: "Heap Spraying",
    spraySub: "payload를 메모리 전역에 도배 → 점프 타겟이 어디든 맞도록",
    sprayTraits: ["확률적 (주소 예측)", "낮은 정밀도", "NOP sled + 셸코드 반복", "점프 타겟 주소 안정화"],
    fengTitle: "Heap Feng Shui",
    fengSub: "단 하나의 슬롯을 victim 옆에 결정적으로 배치",
    fengTraits: ["결정적 (슬롯 단위)", "매우 높은 정밀도", "size class 매칭 + free 패턴 제어", "primitive → 코드 실행 전환"],
    victim: "victim",
    attacker: "attacker",
    note: "실전 익스플로잇은 둘을 결합한다 — 펭수이로 corruption을 만든 뒤, 스프레이로 점프 타겟을 안정화.",
  },
  en: {
    caption:
      "Fig 4. Heap Spraying vs Heap Feng Shui — blanket the heap to raise the odds vs deterministically occupy a single slot.",
    sprayTitle: "Heap Spraying",
    spraySub: "Paint payloads across memory so any jump lands on one",
    sprayTraits: ["Probabilistic (guess address)", "Low precision", "NOP sled + repeated shellcode", "Stabilize the jump target"],
    fengTitle: "Heap Feng Shui",
    fengSub: "Place exactly one slot next to the victim, deterministically",
    fengTraits: ["Deterministic (per slot)", "Very high precision", "Size-class match + free-pattern control", "Primitive → code execution"],
    victim: "victim",
    attacker: "attacker",
    note: "Real exploits combine the two — feng shui builds the corruption, spraying stabilizes the jump target.",
  },
} as const;

export function SprayVsFengShui({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spray */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {s.sprayTitle}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {s.spraySub}
          </div>
          <div className="grid grid-cols-12 gap-1 mt-4">
            {SPRAY.map((_, i) => (
              <div
                key={i}
                className="h-6 rounded-sm bg-rose-300 dark:bg-rose-800"
              />
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            {s.sprayTraits.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">·</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Feng Shui */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {s.fengTitle}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {s.fengSub}
          </div>
          <div className="grid grid-cols-12 gap-1 mt-4">
            {FENGSHUI.map((isAttacker, i) => {
              const isVictim = i === 12;
              return (
                <div
                  key={i}
                  className={`h-6 rounded-sm ${
                    isAttacker
                      ? "bg-rose-400 dark:bg-rose-600"
                      : isVictim
                        ? "bg-zinc-900 dark:bg-zinc-100"
                        : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
              {s.victim}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-rose-400 dark:bg-rose-600" />
              {s.attacker}
            </span>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            {s.fengTraits.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">·</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
