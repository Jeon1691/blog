import { Figure } from "./Figure";

type Locale = "ko" | "en";

type Tone = "fill" | "outline" | "muted";

type Layer = { title: string; sub: string; tone: Tone };

const STRINGS = {
  ko: {
    caption:
      "Fig 5. Android vs iOS 힙 스택 — 유저 → 커널 → 페이지 보호 계층까지의 mitigation 분포.",
    pageLevel: "Page-level 보호",
    kernelLevel: "커널 할당자",
    userLevel: "유저스페이스 할당자",
    note:
      "Android는 ‘같은 크기 캐시'를 공유하는 SLUB 게임. iOS는 kalloc_type의 ‘randomized bucket' 게임으로, 같은 크기여도 타입 bucket이 다르면 잘 안 섞인다(확률적).",
    android: {
      title: "Android",
      sub: "AOSP / bionic / Linux kernel",
      page: [
        { title: "SLAB_VIRTUAL (실험적)", sub: "slab page를 가상 풀로 격리", tone: "outline" as Tone },
        { title: "pkey · eBPF lockdown", sub: "권한 정책 강화", tone: "muted" as Tone },
      ],
      kernel: [
        { title: "Linux SLUB", sub: "kmalloc-* size class 캐시", tone: "fill" as Tone },
        { title: "FREELIST_HARDENED · RANDOM", sub: "freelist ptr XOR + 슬롯 순서 무작위", tone: "outline" as Tone },
        { title: "RANDOM_KMALLOC_CACHES (6.6+)", sub: "같은 size 캐시 16개 사본 (optional)", tone: "outline" as Tone },
      ],
      user: [
        { title: "Scudo (Android 11+)", sub: "Primary region + Secondary mmap", tone: "fill" as Tone },
        { title: "cookie · quarantine", sub: "CRC32 checksum 손상 시 abort", tone: "outline" as Tone },
        { title: "MTE (Pixel 8+)", sub: "ARMv8.5 HW 태그 · opt-in/설정 기반", tone: "outline" as Tone },
      ],
    },
    ios: {
      title: "iOS",
      sub: "Darwin / XNU",
      page: [
        { title: "PPL → SPTM/TXM (A15+)", sub: "페이지 테이블 자체를 별도 monitor가 보호", tone: "fill" as Tone },
        { title: "MIE · EMTE (A19+, 2025)", sub: "Enhanced MTE 상시 적용", tone: "outline" as Tone },
        { title: "PAC-CFI", sub: "signed function ptr / return addr", tone: "outline" as Tone },
      ],
      kernel: [
        { title: "XNU zalloc / kalloc", sub: "수백 개의 named zone", tone: "fill" as Tone },
        { title: "kalloc_type (iOS 15+)", sub: "타입 시그니처를 randomized bucket으로 격리", tone: "fill" as Tone },
        { title: "Zone require · GC", sub: "free 시 zone 일치 검증, page 회수", tone: "outline" as Tone },
      ],
      user: [
        { title: "libmalloc", sub: "nano / tiny / small / large zone", tone: "fill" as Tone },
        { title: "PAC freelist (arm64e)", sub: "freelist ptr를 IB key로 sign", tone: "outline" as Tone },
        { title: "Magazine secret · cookie", sub: "chunk metadata XOR 보호", tone: "outline" as Tone },
      ],
    },
  },
  en: {
    caption:
      "Fig 5. Android vs iOS heap stack — mitigations across userspace → kernel → page protection.",
    pageLevel: "Page-level protection",
    kernelLevel: "Kernel allocator",
    userLevel: "Userspace allocator",
    note:
      "Android is a ‘same-size cache' SLUB game. iOS, post-kalloc_type, is a ‘randomized bucket' game — same-size objects in different type buckets rarely share slots (probabilistic).",
    android: {
      title: "Android",
      sub: "AOSP / bionic / Linux kernel",
      page: [
        { title: "SLAB_VIRTUAL (experimental)", sub: "Isolates slab pages into a virtual pool", tone: "outline" as Tone },
        { title: "pkey · eBPF lockdown", sub: "Tighter permission policy", tone: "muted" as Tone },
      ],
      kernel: [
        { title: "Linux SLUB", sub: "kmalloc-* size-class caches", tone: "fill" as Tone },
        { title: "FREELIST_HARDENED · RANDOM", sub: "XOR-ed pointers + randomized slot order", tone: "outline" as Tone },
        { title: "RANDOM_KMALLOC_CACHES (6.6+)", sub: "16 sibling caches per size (optional)", tone: "outline" as Tone },
      ],
      user: [
        { title: "Scudo (Android 11+)", sub: "Primary region + Secondary mmap", tone: "fill" as Tone },
        { title: "cookie · quarantine", sub: "CRC32 checksum aborts on corruption", tone: "outline" as Tone },
        { title: "MTE (Pixel 8+)", sub: "ARMv8.5 HW tags · per-process opt-in", tone: "outline" as Tone },
      ],
    },
    ios: {
      title: "iOS",
      sub: "Darwin / XNU",
      page: [
        { title: "PPL → SPTM/TXM (A15+)", sub: "Page tables themselves are guarded by a separate monitor", tone: "fill" as Tone },
        { title: "MIE · EMTE (A19+, 2025)", sub: "Always-on Enhanced MTE", tone: "outline" as Tone },
        { title: "PAC-CFI", sub: "Signed function pointers and return addresses", tone: "outline" as Tone },
      ],
      kernel: [
        { title: "XNU zalloc / kalloc", sub: "Hundreds of named zones", tone: "fill" as Tone },
        { title: "kalloc_type (iOS 15+)", sub: "Type signatures placed into randomized buckets", tone: "fill" as Tone },
        { title: "Zone require · GC", sub: "Zone-id check on free; reclaim empty pages", tone: "outline" as Tone },
      ],
      user: [
        { title: "libmalloc", sub: "nano / tiny / small / large zones", tone: "fill" as Tone },
        { title: "PAC freelist (arm64e)", sub: "Freelist ptrs signed with IB key", tone: "outline" as Tone },
        { title: "Magazine secret · cookie", sub: "XOR-protected chunk metadata", tone: "outline" as Tone },
      ],
    },
  },
} as const;

export function AllocatorStack({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Column
          title={s.android.title}
          sub={s.android.sub}
          sections={[
            { label: s.pageLevel, layers: s.android.page },
            { label: s.kernelLevel, layers: s.android.kernel },
            { label: s.userLevel, layers: s.android.user },
          ]}
        />
        <Column
          title={s.ios.title}
          sub={s.ios.sub}
          sections={[
            { label: s.pageLevel, layers: s.ios.page },
            { label: s.kernelLevel, layers: s.ios.kernel },
            { label: s.userLevel, layers: s.ios.user },
          ]}
        />
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}

function Column({
  title,
  sub,
  sections,
}: {
  title: string;
  sub: string;
  sections: { label: string; layers: ReadonlyArray<Layer> }[];
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
        <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</div>
      </div>
      <div className="space-y-4">
        {sections.map((sec) => (
          <div key={sec.label}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
              {sec.label}
            </div>
            <div className="space-y-1.5">
              {sec.layers.map((l) => (
                <LayerBox key={l.title} layer={l} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayerBox({ layer }: { layer: Layer }) {
  const tone = layer.tone;
  const cls =
    tone === "fill"
      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
      : tone === "outline"
        ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600"
        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800";
  const subCls =
    tone === "fill"
      ? "text-zinc-300 dark:text-zinc-600"
      : tone === "outline"
        ? "text-zinc-500 dark:text-zinc-400"
        : "text-zinc-500 dark:text-zinc-500";
  return (
    <div className={`rounded border px-3 py-2 ${cls}`}>
      <div className="font-semibold text-xs">{layer.title}</div>
      <div className={`text-[11px] leading-snug mt-0.5 ${subCls}`}>
        {layer.sub}
      </div>
    </div>
  );
}
