import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 10. 2018 Sprout vs 2026 Orchard — 둘 다 ZK soundness failure가 공급 무결성을 위협했지만, Sprout는 proving system/parameter 계열, Orchard는 회로 내부 under-constrained EC multiplication이라는 차이가 있다.",
    sprout: {
      year: "2018 · Sprout",
      cause: "BCTV14 기반 zk-SNARK — proving system / parameter flaw",
      fix: "Sapling 업그레이드로 수정 (2018-10-28)",
    },
    orchard: {
      year: "2026 · Orchard",
      cause: "회로 내부 under-constrained EC multiplication",
      fix: "소프트포크 + NU6.2 하드포크로 수정 (2026-06)",
    },
    causeLabel: "원인",
    fixLabel: "수정",
    common: "공통 — ZK soundness failure → 공급 무결성 위협 · privacy에는 영향 없음",
  },
  en: {
    caption:
      "Fig 10. 2018 Sprout vs 2026 Orchard — both were ZK soundness failures that threatened supply integrity, but Sprout was a proving-system/parameter flaw while Orchard was an under-constrained EC multiplication inside the circuit.",
    sprout: {
      year: "2018 · Sprout",
      cause: "BCTV14-based zk-SNARK — proving system / parameter flaw",
      fix: "Fixed by the Sapling upgrade (2018-10-28)",
    },
    orchard: {
      year: "2026 · Orchard",
      cause: "Under-constrained EC multiplication inside the circuit",
      fix: "Fixed by a soft fork + the NU6.2 hard fork (2026-06)",
    },
    causeLabel: "Cause",
    fixLabel: "Fix",
    common: "Shared — a ZK soundness failure threatens supply integrity · no impact on privacy",
  },
} as const;

export function SproutVsOrchard({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel
          year={s.sprout.year}
          cause={s.sprout.cause}
          fix={s.sprout.fix}
          causeLabel={s.causeLabel}
          fixLabel={s.fixLabel}
        />
        <Panel
          year={s.orchard.year}
          cause={s.orchard.cause}
          fix={s.orchard.fix}
          causeLabel={s.causeLabel}
          fixLabel={s.fixLabel}
        />
      </div>

      <div className="mt-4 rounded-md border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-center text-sm font-semibold text-zinc-50 dark:text-zinc-900">
        {s.common}
      </div>
    </Figure>
  );
}

function Panel({
  year,
  cause,
  fix,
  causeLabel,
  fixLabel,
}: {
  year: string;
  cause: string;
  fix: string;
  causeLabel: string;
  fixLabel: string;
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
        {year}
      </div>
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
          {causeLabel}
        </div>
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-snug">
          {cause}
        </div>
      </div>
      <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none my-1.5">
        ↓
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-500">
          {fixLabel}
        </div>
        <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-200 mt-1 leading-snug">
          {fix}
        </div>
      </div>
    </div>
  );
}
