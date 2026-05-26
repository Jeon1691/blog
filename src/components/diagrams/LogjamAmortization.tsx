import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 5. Logjam의 비용 구조 — 같은 prime을 공유하는 시스템이 많을수록 공격자 ROI가 극단적으로 좋아진다.",
    bottom: "공유 prime은 단일 시스템의 위험이 아니라 그 prime을 쓰는 모든 세션의 위험으로 번진다.",
    naive: {
      title: "공유 prime이 없을 때",
      tag: "세션마다 전체 NFS-DLP",
      precomp: { label: "사전계산", value: "—" },
      perSession: { label: "세션당", value: "~ $1M" },
      scale: { label: "공격 가능 세션", value: "1" },
    },
    logjam: {
      title: "공유 prime이 있을 때 (Logjam)",
      tag: "사전계산 1회 + Step 4만 반복",
      precomp: { label: "사전계산 (1회)", value: "~ $1M" },
      perSession: { label: "세션당", value: "~ 90s" },
      scale: { label: "공격 가능 세션", value: "공유 prime의 모든 세션" },
    },
  },
  en: {
    caption: "Fig 5. Logjam's cost structure — the more systems share a prime, the better the attacker's ROI.",
    bottom: "A shared prime isn't just one system's risk; it's the risk of every session that uses that prime.",
    naive: {
      title: "Without a shared prime",
      tag: "Full NFS-DLP per session",
      precomp: { label: "Precomputation", value: "—" },
      perSession: { label: "Per session", value: "~ $1M" },
      scale: { label: "Sessions in scope", value: "1" },
    },
    logjam: {
      title: "With a shared prime (Logjam)",
      tag: "Precompute once + Step 4 forever",
      precomp: { label: "Precomputation (once)", value: "~ $1M" },
      perSession: { label: "Per session", value: "~ 90s" },
      scale: { label: "Sessions in scope", value: "every session on the prime" },
    },
  },
} as const;

export function LogjamAmortization({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Panel data={s.naive} tone="muted" />
        <Panel data={s.logjam} tone="strong" />
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.bottom}
      </p>
    </Figure>
  );
}

type PanelData = {
  title: string;
  tag: string;
  precomp: { label: string; value: string };
  perSession: { label: string; value: string };
  scale: { label: string; value: string };
};

function Panel({ data, tone }: { data: PanelData; tone: "muted" | "strong" }) {
  const borderClass =
    tone === "strong"
      ? "border-zinc-900 dark:border-zinc-100"
      : "border-zinc-200 dark:border-zinc-800";
  return (
    <div
      className={`rounded-md border ${borderClass} bg-white dark:bg-zinc-950 p-5`}
    >
      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        {data.title}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
        {data.tag}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        <Row label={data.precomp.label} value={data.precomp.value} />
        <Row label={data.perSession.label} value={data.perSession.value} />
        <Row label={data.scale.label} value={data.scale.value} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100 text-right">
        {value}
      </div>
    </div>
  );
}
