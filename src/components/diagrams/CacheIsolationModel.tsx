import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Chip = { label: string; kind: "victim" | "attacker" | "other" };

const STRINGS = {
  ko: {
    caption:
      "Fig 6. SLUB(크기 기준) vs kalloc_type(타입 기준) — 무엇이 같은 풀을 공유하는가가 펭수이의 난이도를 가른다.",
    slubTitle: "Linux SLUB — 크기 기준",
    slubSub: "kmalloc-1k : 1KB짜리는 타입과 무관하게 한 캐시",
    slubVerdict: "같은 크기 유용 객체를 victim 옆에 둘 수 있다 → 펭수이 가능",
    typeTitle: "iOS kalloc_type — 타입 기준",
    typeSub: "같은 1KB라도 타입 시그니처별로 zone 분리",
    typeVerdict: "다른 타입은 같은 슬롯을 재활용 못 함 → type confusion 봉쇄",
    poolLabel: "kmalloc-1k",
    zoneA: "zone: type A",
    zoneB: "zone: type B",
    victim: "취약 객체",
    attacker: "공격자 객체",
    slub: [
      { label: "victim (1KB)", kind: "victim" },
      { label: "msg_msg", kind: "attacker" },
      { label: "tty_struct", kind: "other" },
      { label: "pipe_buffer", kind: "attacker" },
    ] as Chip[],
    typeA: [{ label: "victim (type A)", kind: "victim" }, { label: "type A obj", kind: "other" }] as Chip[],
    typeB: [{ label: "attacker (type B)", kind: "attacker" }, { label: "type B obj", kind: "other" }] as Chip[],
  },
  en: {
    caption:
      "Fig 6. SLUB (by size) vs kalloc_type (by type) — what shares a pool decides how hard feng shui is.",
    slubTitle: "Linux SLUB — by size",
    slubSub: "kmalloc-1k: every 1KB object shares one cache regardless of type",
    slubVerdict: "Place a same-size useful object next to the victim → feng shui works",
    typeTitle: "iOS kalloc_type — by type",
    typeSub: "Even at 1KB, zones are split per type signature",
    typeVerdict: "Different types can't reuse the same slot → type confusion blocked",
    poolLabel: "kmalloc-1k",
    zoneA: "zone: type A",
    zoneB: "zone: type B",
    victim: "victim",
    attacker: "attacker",
    slub: [
      { label: "victim (1KB)", kind: "victim" },
      { label: "msg_msg", kind: "attacker" },
      { label: "tty_struct", kind: "other" },
      { label: "pipe_buffer", kind: "attacker" },
    ] as Chip[],
    typeA: [{ label: "victim (type A)", kind: "victim" }, { label: "type A obj", kind: "other" }] as Chip[],
    typeB: [{ label: "attacker (type B)", kind: "attacker" }, { label: "type B obj", kind: "other" }] as Chip[],
  },
} as const;

const chipClass: Record<Chip["kind"], string> = {
  victim: "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100",
  attacker: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-400 dark:border-rose-700",
  other: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700",
};

function ChipRow({ chips }: { chips: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <div
          key={c.label}
          className={`rounded border px-2.5 py-1.5 text-xs font-mono font-medium ${chipClass[c.kind]}`}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

export function CacheIsolationModel({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SLUB */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {s.slubTitle}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {s.slubSub}
          </div>
          <div className="mt-4 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 p-3">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-2 font-mono">
              {s.poolLabel}
            </div>
            <ChipRow chips={s.slub} />
          </div>
          <p className="mt-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
            {s.slubVerdict}
          </p>
        </div>

        {/* kalloc_type */}
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
          <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {s.typeTitle}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
            {s.typeSub}
          </div>
          <div className="mt-4 space-y-2">
            <div className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-2 font-mono">
                {s.zoneA}
              </div>
              <ChipRow chips={s.typeA} />
            </div>
            <div className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-2 font-mono">
                {s.zoneB}
              </div>
              <ChipRow chips={s.typeB} />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
            {s.typeVerdict}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 justify-center text-xs text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded border bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100" />
          {s.victim}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded border bg-rose-100 dark:bg-rose-950 border-rose-400 dark:border-rose-700" />
          {s.attacker}
        </span>
      </div>
    </Figure>
  );
}
