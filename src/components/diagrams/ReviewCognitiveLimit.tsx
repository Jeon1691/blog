import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 3. SmartBear–Cisco — 리뷰 한 건당 인지 한계(스위트 스팟)와 AI 생성 PR의 위치",
    zones: {
      small: "작음",
      sweet: "스위트 스팟",
      sweetSub: "결함 검출률 70–90%",
      decline: "검출률 하락",
      ai: "AI 영역",
    },
    pills: {
      humanH: "인간 리뷰어",
      humanB: "200~400 LOC · 60~90분 · 시간당 500 LOC 이하",
      aiH: "AI 생성 PR",
      aiB: "1,000줄급 — 인간 리뷰어가 구조적으로 검출 불가",
    },
  },
  en: {
    caption: "Fig 3. SmartBear–Cisco — per-review cognitive limits (the sweet spot) and where AI-generated PRs land",
    zones: {
      small: "small",
      sweet: "sweet spot",
      sweetSub: "70–90% defect detection",
      decline: "detection declines",
      ai: "AI territory",
    },
    pills: {
      humanH: "Human reviewer envelope",
      humanB: "200–400 LOC · 60–90 min · ≤ 500 LOC/hr",
      aiH: "AI-generated PR",
      aiB: "~1,000 LOC — structurally beyond human review capacity",
    },
  },
} as const;

export function ReviewCognitiveLimit({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div>
        <div className="relative h-16 flex">
          <Zone width={200 / 1200} label={s.zones.small} tone="muted" />
          <Zone
            width={(400 - 200) / 1200}
            label={s.zones.sweet}
            tone="strong"
            subtext={s.zones.sweetSub}
          />
          <Zone
            width={(1000 - 400) / 1200}
            label={s.zones.decline}
            tone="subtle"
          />
          <Zone width={200 / 1200} label={s.zones.ai} tone="muted" />
        </div>
        <div className="relative h-6">
          <Tick at={0} label="0" />
          <Tick at={200 / 1200} label="200" />
          <Tick at={400 / 1200} label="400" />
          <Tick at={1000 / 1200} label="1,000" />
          <Tick at={1} label="LOC" muted />
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Pill heading={s.pills.humanH} body={s.pills.humanB} />
          <Pill heading={s.pills.aiH} body={s.pills.aiB} inverted />
        </div>
      </div>
    </Figure>
  );
}

function Zone({
  width,
  label,
  tone,
  subtext,
}: {
  width: number;
  label: string;
  tone: "muted" | "subtle" | "strong";
  subtext?: string;
}) {
  const bg =
    tone === "strong"
      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
      : tone === "subtle"
        ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400";
  return (
    <div
      className={`${bg} flex flex-col items-center justify-center text-[10px] sm:text-xs border-r border-white dark:border-zinc-950 last:border-r-0 overflow-hidden`}
      style={{ width: `${width * 100}%` }}
    >
      <div className="font-semibold leading-tight">{label}</div>
      {subtext && (
        <div className="text-[9px] sm:text-[10px] opacity-80 leading-tight mt-0.5 px-1 text-center">
          {subtext}
        </div>
      )}
    </div>
  );
}

function Tick({
  at,
  label,
  muted = false,
}: {
  at: number;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`absolute top-0 -translate-x-1/2 text-[10px] tabular-nums ${muted ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}
      style={{ left: `${at * 100}%` }}
    >
      {label}
    </div>
  );
}

function Pill({
  heading,
  body,
  inverted = false,
}: {
  heading: string;
  body: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-3 ${inverted ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-200 dark:border-zinc-800"}`}
    >
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        {heading}
      </div>
      <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
        {body}
      </div>
    </div>
  );
}
