import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Era = "origin" | "kernel" | "mobile" | "mitigation" | "automation";

type Event = {
  year: string;
  title: string;
  body: string;
  era: Era;
};

const STRINGS = {
  ko: {
    caption:
      "Fig 1. 힙 펭수이 계보 — 브라우저 힙을 결정적으로 다루는 데서 출발해 커널·모바일로 번지고, 하드웨어 mitigation이 비용을 끌어올린 흐름.",
    note: "왼쪽 띠 색이 시대를 구분한다 — 태동(유저) → 커널 확장 → 모바일 실전 → 하드웨어 mitigation → 자동화.",
    events: [
      { year: "2007", title: "Heap Feng Shui in JS", body: "Sotirov (Black Hat) — IE 힙을 결정적으로 제어, heaplib.js 공개. 기법 명명.", era: "origin" },
      { year: "2010", title: "Pool Feng Shui", body: "Windows 커널 풀로 개념 확장 (Chen).", era: "kernel" },
      { year: "2013", title: "iOS kernel feng shui", body: "Mandt — XNU kalloc / zone을 결정적으로 제어하는 연구 시초.", era: "kernel" },
      { year: "2016", title: "Drammer / Flip Feng Shui", body: "VUSec — Rowhammer 비트플립 + 페이지 배치로 모바일 루트.", era: "mobile" },
      { year: "2020", title: "Scudo · kalloc_type", body: "Android 11 Scudo(2020) · iOS 15 kalloc_type(2021) — 유저·커널 양쪽 익스플로잇 비용 급상승.", era: "mitigation" },
      { year: "2021", title: "Maze (USENIX)", body: "심볼릭 실행으로 힙 배치 시퀀스 자동 합성.", era: "automation" },
      { year: "2023", title: "CVE-2023-20938 / -32434", body: "Android Binder UAF · iOS Triangulation — 양 진영 실전 펭수이.", era: "mobile" },
      { year: "2024", title: "Scudo 우회 2종 (WOOT)", body: "hardened allocator도 구조적 약점이 있음을 증명.", era: "automation" },
      { year: "2024", title: "Dirty Pagedirectory", body: "CVE-2024-1086(nf_tables) — buddy로 반환된 page를 PTE로 재활용하는 page-level feng shui.", era: "kernel" },
      { year: "2025", title: "CROSS-X (CCS)", body: "cross-cache를 일반화·고신뢰화 (대상 객체 대부분 99%+, pipe_inode_info는 94%). SLUBStick 계보.", era: "automation" },
      { year: "2025", title: "Apple MIE (EMTE)", body: "iPhone 17/A19 — 커널+70여 유저 프로세스에 EMTE 상시 적용. (Android MTE는 CVE-2025-0072로 우회 사례 — 별개 플랫폼)", era: "mitigation" },
    ] as Event[],
  },
  en: {
    caption:
      "Fig 1. A lineage of heap feng shui — from browser heap shaping to kernel and mobile, with hardware mitigations raising the cost.",
    note: "Left stripe color marks the era — origins (userland) → kernel → mobile in the wild → hardware mitigations → automation.",
    events: [
      { year: "2007", title: "Heap Feng Shui in JS", body: "Sotirov (Black Hat) — shaped the IE heap, released heaplib.js. Named the technique.", era: "origin" },
      { year: "2010", title: "Pool Feng Shui", body: "Extended to the Windows kernel pool (Chen).", era: "kernel" },
      { year: "2013", title: "iOS kernel feng shui", body: "Mandt — first study of XNU kalloc / zone shaping.", era: "kernel" },
      { year: "2016", title: "Drammer / Flip Feng Shui", body: "VUSec — Rowhammer bit flips + page placement for mobile root.", era: "mobile" },
      { year: "2020", title: "Scudo · kalloc_type", body: "Android 11 Scudo (2020) · iOS 15 kalloc_type (2021) — sharply raised exploit cost on both sides.", era: "mitigation" },
      { year: "2021", title: "Maze (USENIX)", body: "Symbolic execution auto-synthesizes the heap layout sequence.", era: "automation" },
      { year: "2023", title: "CVE-2023-20938 / -32434", body: "Android Binder UAF · iOS Triangulation — feng shui in the wild on both platforms.", era: "mobile" },
      { year: "2024", title: "Two Scudo bypasses (WOOT)", body: "Proved even a hardened allocator has structural weaknesses.", era: "automation" },
      { year: "2024", title: "Dirty Pagedirectory", body: "CVE-2024-1086 (nf_tables) — reuse a buddy-returned page as a PTE: page-level feng shui.", era: "kernel" },
      { year: "2025", title: "CROSS-X (CCS)", body: "Generalized, reliable cross-cache (mostly 99%+, 94% for pipe_inode_info). The SLUBStick lineage.", era: "automation" },
      { year: "2025", title: "Apple MIE (EMTE)", body: "iPhone 17/A19 — always-on EMTE across the kernel + 70+ userland processes. (Android MTE was bypassed by CVE-2025-0072 — a separate platform.)", era: "mitigation" },
    ] as Event[],
  },
} as const;

const eraStripe: Record<Era, string> = {
  origin: "bg-zinc-300 dark:bg-zinc-600",
  kernel: "bg-zinc-500 dark:bg-zinc-400",
  mobile: "bg-rose-400 dark:bg-rose-600",
  mitigation: "bg-zinc-900 dark:bg-zinc-100",
  automation: "bg-amber-400 dark:bg-amber-600",
};

export function HeapFengShuiTimeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <ol className="relative space-y-3">
        {s.events.map((e) => (
          <li
            key={`${e.year}-${e.title}`}
            className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_1fr] gap-3 items-stretch"
          >
            <div className="font-mono tabular-nums text-sm font-bold text-zinc-500 dark:text-zinc-400 pt-2 text-right">
              {e.year}
            </div>
            <div className="flex gap-3">
              <div className={`w-1 shrink-0 rounded-full ${eraStripe[e.era]}`} />
              <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 flex-1">
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {e.title}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug mt-0.5">
                  {e.body}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
