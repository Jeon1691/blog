import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 4. Prime-field DH (실제 DH 보안에 직결되는 군)에 대한 NFS-DLP 기록 — 2019년 795-bit safe prime 이후 새 공개 기록 없음 (2026년 기준 standing).",
    primeHeader: "Prime-field DLP (DH 안전성과 직결)",
    primeNote:
      "2020~2026: 새 공개 기록 없음. 2048-bit가 안전 기준선으로 자리잡은 직접 근거.",
    binaryHeader: "참고: 특수 체 (DH와 무관)",
    binaryNote:
      "특수 체(특히 작은 표수)는 quasi-polynomial 공격이 가능해 별개로 다뤄짐. DH는 prime-field만 사용하므로 위 기록과 직접 연관 없음.",
    safeline: "현재 권장 임계",
    primeRecords: [
      { year: "2014", bits: 596, tech: "NFS-DLP", who: "Bouvier et al." },
      { year: "2016", bits: 768, tech: "NFS-DLP", who: "Kleinjung et al." },
      {
        year: "2017",
        bits: 1024,
        tech: "SNFS-DLP",
        who: "Fried, Gaudry, Heninger, Thomé (special prime)",
      },
      {
        year: "2019",
        bits: 795,
        tech: "NFS-DLP",
        who: "Boudot et al. (safe prime)",
        standing: true,
      },
    ],
    binaryRecords: [
      {
        year: "2019",
        bits: 30750,
        tech: "FFS",
        who: "Granger, Kleinjung, Lenstra, Wesolowski, Zumbrägel — GF(2^30750)",
      },
      {
        year: "~2022",
        bits: 1051,
        tech: "FFS",
        who: "Medium-characteristic 22-bit",
      },
    ],
    standingTag: "Standing record (2026)",
  },
  en: {
    caption:
      "Fig 4. NFS-DLP records on prime-field DH (the group that actually backs DH security). No new public record since the 795-bit safe prime of 2019 — still the standing record as of 2026.",
    primeHeader: "Prime-field DLP (relevant to DH)",
    primeNote:
      "2020–2026: no new public record. Direct reason 2048-bit became the safe floor.",
    binaryHeader: "For reference: special fields (do not apply to DH)",
    binaryNote:
      "Special fields — especially small characteristic — admit quasi-polynomial attacks and are tracked separately. DH uses prime fields only, so these records do not bear on its security.",
    safeline: "Recommended floor today",
    primeRecords: [
      { year: "2014", bits: 596, tech: "NFS-DLP", who: "Bouvier et al." },
      { year: "2016", bits: 768, tech: "NFS-DLP", who: "Kleinjung et al." },
      {
        year: "2017",
        bits: 1024,
        tech: "SNFS-DLP",
        who: "Fried, Gaudry, Heninger, Thomé (special prime)",
      },
      {
        year: "2019",
        bits: 795,
        tech: "NFS-DLP",
        who: "Boudot et al. (safe prime)",
        standing: true,
      },
    ],
    binaryRecords: [
      {
        year: "2019",
        bits: 30750,
        tech: "FFS",
        who: "Granger, Kleinjung, Lenstra, Wesolowski, Zumbrägel — GF(2^30750)",
      },
      {
        year: "~2022",
        bits: 1051,
        tech: "FFS",
        who: "Medium-characteristic 22-bit",
      },
    ],
    standingTag: "Standing record (2026)",
  },
} as const;

const SCALE_MAX = 2200; // bits axis (prime panel)
const BIN_SCALE_MAX = 32000; // bits axis (binary panel)

export function DLPBreakRecords({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="space-y-7">
        {/* Prime-field panel — primary */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {s.primeHeader}
            </h4>
          </div>
          <div className="space-y-3">
            {s.primeRecords.map((r) => (
              <div
                key={r.year}
                className="grid grid-cols-[3.5rem_1fr_5.5rem] sm:grid-cols-[4.5rem_1fr_6.5rem] items-center gap-3 text-xs sm:text-sm"
              >
                <div className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                  {r.year}
                </div>
                <div className="relative h-6 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 dark:bg-zinc-100"
                    style={{ width: `${(r.bits / SCALE_MAX) * 100}%` }}
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center text-[10px] text-zinc-50 dark:text-zinc-900 mix-blend-difference">
                    {r.tech} · {r.who}
                  </div>
                  {r.standing && (
                    <div className="absolute right-2 inset-y-0 flex items-center text-[9px] font-semibold uppercase tracking-wider text-zinc-50 dark:text-zinc-900 mix-blend-difference">
                      ★ {s.standingTag}
                    </div>
                  )}
                </div>
                <div className="font-bold tabular-nums text-right text-zinc-900 dark:text-zinc-100">
                  {r.bits.toLocaleString()}-bit
                </div>
              </div>
            ))}
            <div className="grid grid-cols-[3.5rem_1fr_5.5rem] sm:grid-cols-[4.5rem_1fr_6.5rem] items-center gap-3 text-xs sm:text-sm">
              <div />
              <div className="relative h-5">
                <div
                  className="absolute top-0 bottom-0 w-px bg-zinc-900 dark:bg-zinc-100 border-l border-dashed"
                  style={{ left: `${(2048 / SCALE_MAX) * 100}%` }}
                />
                <div
                  className="absolute -top-1 -translate-x-1/2 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                  style={{ left: `${(2048 / SCALE_MAX) * 100}%` }}
                >
                  ↑ {s.safeline} 2048-bit
                </div>
              </div>
              <div />
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {s.primeNote}
          </p>
        </section>

        {/* Binary-field panel — context, muted */}
        <section className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100/60 dark:bg-zinc-900/60 p-4">
          <div className="flex items-baseline justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {s.binaryHeader}
            </h4>
          </div>
          <div className="space-y-2">
            {s.binaryRecords.map((r) => (
              <div
                key={r.year + r.bits}
                className="grid grid-cols-[3.5rem_1fr_5.5rem] sm:grid-cols-[4.5rem_1fr_6.5rem] items-center gap-3 text-xs"
              >
                <div className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                  {r.year}
                </div>
                <div className="relative h-4 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div
                    className="h-full bg-zinc-400 dark:bg-zinc-600"
                    style={{ width: `${(r.bits / BIN_SCALE_MAX) * 100}%` }}
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center text-[9px] text-zinc-700 dark:text-zinc-300">
                    {r.tech} · {r.who}
                  </div>
                </div>
                <div className="font-bold tabular-nums text-right text-zinc-700 dark:text-zinc-300">
                  {r.bits.toLocaleString()}-bit
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            {s.binaryNote}
          </p>
        </section>
      </div>
    </Figure>
  );
}
