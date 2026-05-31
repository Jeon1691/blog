import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Slot = "F" | "A" | "H" | "V" | "X"; // Free / Allocated (other) / Hole / Victim / Attacker

const STAGES_KO = [
  {
    title: "0. 초기 상태",
    desc: "힙은 단편화되어 있고 hole 위치가 예측 불가",
    slots: ["F", "A", "F", "A", "A", "F", "A", "F", "A", "F"] as Slot[],
  },
  {
    title: "1. Massage",
    desc: "같은 크기 객체를 대량 할당 → freelist 비움, 새 slab 강제 생성",
    slots: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "2. Punch hole",
    desc: "원하는 위치만 free → 다음 할당이 그 자리로 들어가도록 유도",
    slots: ["A", "A", "A", "A", "H", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "3. Pin victim",
    desc: "취약 객체를 hole에 정확히 배치",
    slots: ["A", "A", "A", "A", "V", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "4. Place attacker",
    desc: "공격자 제어 객체를 victim 인접 슬롯에 배치",
    slots: ["A", "A", "A", "X", "V", "X", "A", "A", "A", "A"] as Slot[],
  },
];

const STAGES_EN = [
  {
    title: "0. Initial state",
    desc: "Heap is fragmented; hole positions unpredictable",
    slots: ["F", "A", "F", "A", "A", "F", "A", "F", "A", "F"] as Slot[],
  },
  {
    title: "1. Massage",
    desc: "Mass-allocate same-size chunks → drain freelist, force new slab",
    slots: ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "2. Punch hole",
    desc: "Free exactly the target slot so the next allocation lands there",
    slots: ["A", "A", "A", "A", "H", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "3. Pin victim",
    desc: "Place the vulnerable object in the hole",
    slots: ["A", "A", "A", "A", "V", "A", "A", "A", "A", "A"] as Slot[],
  },
  {
    title: "4. Place attacker",
    desc: "Place attacker-controlled chunks adjacent to the victim",
    slots: ["A", "A", "A", "X", "V", "X", "A", "A", "A", "A"] as Slot[],
  },
];

const LEGEND_KO: { code: Slot; label: string }[] = [
  { code: "F", label: "free" },
  { code: "A", label: "기타 할당" },
  { code: "H", label: "공격자가 뚫은 hole" },
  { code: "V", label: "취약(victim)" },
  { code: "X", label: "공격자 제어" },
];

const LEGEND_EN: { code: Slot; label: string }[] = [
  { code: "F", label: "free" },
  { code: "A", label: "other alloc" },
  { code: "H", label: "punched hole" },
  { code: "V", label: "victim" },
  { code: "X", label: "attacker-controlled" },
];

const STRINGS = {
  ko: {
    caption:
      "Fig 3. 힙 상태 변화 — Massage → Hole → Victim → Attacker 순으로 동일한 슬롯 행이 어떻게 변하는지.",
    stages: STAGES_KO,
    legend: LEGEND_KO,
    note: "실제로는 슬롯이 수백~수만 개. 그림은 핵심 5개 슬롯만 확대해 보여준다.",
  },
  en: {
    caption:
      "Fig 3. Heap state evolution — how the same slot row transforms across Massage → Hole → Victim → Attacker.",
    stages: STAGES_EN,
    legend: LEGEND_EN,
    note: "Real heaps have hundreds to thousands of slots; this only highlights five.",
  },
} as const;

const slotStyle: Record<Slot, string> = {
  F: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-500",
  A: "bg-zinc-300 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400",
  H: "bg-amber-100 dark:bg-amber-950 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-300",
  V: "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-zinc-50 dark:text-zinc-900",
  X: "bg-rose-200 dark:bg-rose-950 border-rose-500 dark:border-rose-700 text-rose-800 dark:text-rose-300",
};

const legendStyle: Record<Slot, string> = {
  F: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
  A: "bg-zinc-300 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600",
  H: "bg-amber-100 dark:bg-amber-950 border-amber-400 dark:border-amber-700",
  V: "bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100",
  X: "bg-rose-200 dark:bg-rose-950 border-rose-500 dark:border-rose-700",
};

export function HeapStateEvolution({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="space-y-4">
        {s.stages.map((stage) => (
          <div
            key={stage.title}
            className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] sm:items-center gap-3"
          >
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {stage.title}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug mt-1">
                {stage.desc}
              </div>
            </div>
            <div className="flex gap-1.5">
              {stage.slots.map((code, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 sm:h-9 rounded border flex items-center justify-center font-mono text-[11px] font-bold ${slotStyle[code]}`}
                  aria-label={code}
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-zinc-600 dark:text-zinc-400">
        {s.legend.map((l) => (
          <div key={l.code} className="flex items-center gap-1.5">
            <div
              className={`w-4 h-4 rounded border ${legendStyle[l.code]} flex items-center justify-center font-mono text-[9px] font-bold ${l.code === "V" ? "text-zinc-50 dark:text-zinc-900" : ""}`}
            >
              {l.code}
            </div>
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
