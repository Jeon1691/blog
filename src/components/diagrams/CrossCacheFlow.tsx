import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Owner = "victimCache" | "buddy" | "attackerCache";

type Step = {
  n: string;
  title: string;
  body: string;
  owner: Owner;
};

const STRINGS = {
  ko: {
    caption:
      "Fig 7. Cross-cache 공격 — 같은 캐시 안에 유용한 객체가 없을 때, slab page 자체를 buddy allocator를 거쳐 다른 캐시로 재활용시킨다.",
    note: "방어: SLAB_VIRTUAL(가상 풀 격리), kvmalloc 분리, page tagging. iOS는 kalloc_type + zone GC + PAC/SPTM으로 cross-zone을 훨씬 어렵게 만든다.",
    ownerLabels: {
      victimCache: "victim 전용 캐시",
      buddy: "buddy allocator (page pool)",
      attackerCache: "attacker 캐시",
    },
    steps: [
      { n: "1", title: "victim 격리", body: "victim이 dedicated/cg 캐시에 갇힘 — 같은 캐시에 쓸 만한 객체가 없다.", owner: "victimCache" },
      { n: "2", title: "slab 전체 free", body: "그 캐시의 slab page를 모두 비워 page를 buddy allocator로 반환시킨다.", owner: "buddy" },
      { n: "3", title: "page 재할당 유도", body: "다른 캐시(msg_msg 등)가 같은 물리 page를 즉시 가져오도록 경합.", owner: "attackerCache" },
      { n: "4", title: "overlap 확보", body: "공격자 객체가 victim의 옛 메모리에 겹쳐 — cross-cache UAF 성립.", owner: "attackerCache" },
    ] as Step[],
  },
  en: {
    caption:
      "Fig 7. Cross-cache attack — when no useful object shares the victim's cache, recycle the slab page itself through the buddy allocator into another cache.",
    note: "Defenses: SLAB_VIRTUAL (virtual-pool isolation), kvmalloc split, page tagging. iOS makes cross-zone far harder with kalloc_type + zone GC + PAC/SPTM.",
    ownerLabels: {
      victimCache: "victim's dedicated cache",
      buddy: "buddy allocator (page pool)",
      attackerCache: "attacker cache",
    },
    steps: [
      { n: "1", title: "Victim isolated", body: "Victim trapped in a dedicated/cg cache — no useful object shares it.", owner: "victimCache" },
      { n: "2", title: "Free all slabs", body: "Empty every slab page in that cache so the page returns to the buddy allocator.", owner: "buddy" },
      { n: "3", title: "Re-allocate page", body: "Race so another cache (e.g. msg_msg) grabs that same physical page.", owner: "attackerCache" },
      { n: "4", title: "Overlap achieved", body: "Attacker object overlays the victim's old memory — cross-cache UAF.", owner: "attackerCache" },
    ] as Step[],
  },
} as const;

const ownerClass: Record<Owner, string> = {
  victimCache: "border-zinc-900 dark:border-zinc-100",
  buddy: "border-amber-400 dark:border-amber-700",
  attackerCache: "border-rose-400 dark:border-rose-700",
};

const ownerDot: Record<Owner, string> = {
  victimCache: "bg-zinc-900 dark:bg-zinc-100",
  buddy: "bg-amber-400 dark:bg-amber-600",
  attackerCache: "bg-rose-400 dark:bg-rose-600",
};

export function CrossCacheFlow({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {s.steps.map((step, i) => (
          <div key={step.n} className="relative">
            <div
              className={`rounded-md border-2 bg-white dark:bg-zinc-950 p-3 h-full ${ownerClass[step.owner]}`}
            >
              <div className="flex items-center gap-2 mb-2">
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
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${ownerDot[step.owner]}`} />
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {s.ownerLabels[step.owner]}
                </span>
              </div>
            </div>
            {i < s.steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 text-lg z-10">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
