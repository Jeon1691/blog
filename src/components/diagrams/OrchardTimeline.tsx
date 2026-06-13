import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Phase = "vuln" | "tool" | "discovery" | "fix";

type Event = {
  date: string;
  title: string;
  body: string;
  phase: Phase;
};

const STRINGS = {
  ko: {
    caption:
      "Fig 2. Orchard 취약점 전체 타임라인 — 2022-05 활성화부터 약 4년간 잠복하다, 발견(2026-05-29) 닷새 만에 소프트포크 + NU6.2 하드포크로 마무리됐다.",
    note: "왼쪽 띠 색이 국면을 구분한다 — 취약점 잠복(rose) → AI 도구(amber) → 발견·제보(강조) → 긴급 수정(emerald).",
    events: [
      { date: "2022-05", title: "Orchard 활성화", body: "최신 shielded pool인 Orchard가 메인넷에 적용 — 이 시점부터 취약점이 존재.", phase: "vuln" },
      { date: "2026-05-28", title: "Opus 4.8 출시", body: "Anthropic이 Opus 4.8 모델 공개. Hornby는 직후 이를 Orchard 회로 집중 검토에 활용.", phase: "tool" },
      { date: "2026-05-29", title: "Hornby 발견 → ZODL 제보", body: "Taylor Hornby가 critical counterfeiting 취약점 발견, Zcash Open Development Lab에 즉시 비공개 제보.", phase: "discovery" },
      { date: "2026-06-01", title: "긴급 fix 배포", body: "수정 패치 배포. 취약점은 이 시점까지 약 4년간 존재했다.", phase: "fix" },
      { date: "2026-06-02", title: "소프트포크 — 블록 3,363,426", body: "임시 소프트포크 활성화로 Orchard actions를 비활성화.", phase: "fix" },
      { date: "2026-06-03", title: "NU6.2 하드포크 — 블록 3,364,600", body: "NU6.2 하드포크 활성화로 수정된 회로와 함께 Orchard 재활성화.", phase: "fix" },
    ] as Event[],
  },
  en: {
    caption:
      "Fig 2. Full timeline of the Orchard bug — it lay dormant for ~4 years from the 2022-05 activation, then wrapped up five days after discovery (2026-05-29) via a soft fork plus the NU6.2 hard fork.",
    note: "Left stripe color marks the phase — dormant vulnerability (rose) → AI tooling (amber) → discovery/report (strong) → emergency fix (emerald).",
    events: [
      { date: "2022-05", title: "Orchard activated", body: "Orchard, the newest shielded pool, goes live on mainnet — the vulnerability exists from here on.", phase: "vuln" },
      { date: "2026-05-28", title: "Opus 4.8 released", body: "Anthropic ships Opus 4.8. Hornby applies it to a focused review of the Orchard circuit right after.", phase: "tool" },
      { date: "2026-05-29", title: "Hornby finds it → reports to ZODL", body: "Taylor Hornby discovers the critical counterfeiting bug and privately reports it to the Zcash Open Development Lab.", phase: "discovery" },
      { date: "2026-06-01", title: "Emergency fix shipped", body: "The fix is deployed. The vulnerability had existed for roughly four years up to this point.", phase: "fix" },
      { date: "2026-06-02", title: "Soft fork — block 3,363,426", body: "A temporary soft fork activates and disables Orchard actions.", phase: "fix" },
      { date: "2026-06-03", title: "NU6.2 hard fork — block 3,364,600", body: "The NU6.2 hard fork activates and re-enables Orchard with the corrected circuit.", phase: "fix" },
    ] as Event[],
  },
} as const;

const phaseStripe: Record<Phase, string> = {
  vuln: "bg-rose-400 dark:bg-rose-600",
  tool: "bg-amber-400 dark:bg-amber-600",
  discovery: "bg-zinc-900 dark:bg-zinc-100",
  fix: "bg-emerald-500 dark:bg-emerald-600",
};

export function OrchardTimeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <ol className="relative space-y-3">
        {s.events.map((e) => (
          <li
            key={e.date}
            className="grid grid-cols-[5rem_1fr] sm:grid-cols-[6.5rem_1fr] gap-3 items-stretch"
          >
            <div className="font-mono tabular-nums text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 pt-2 text-right">
              {e.date}
            </div>
            <div className="flex gap-3">
              <div className={`w-1 shrink-0 rounded-full ${phaseStripe[e.phase]}`} />
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
