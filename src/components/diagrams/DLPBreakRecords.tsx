import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 4. NFS-DLP로 깨진 prime-field DH 비트 수 — 2014~2019, 단조 증가 추세.",
    note: "1024-bit (널리 공유된 prime 포함)이 2017년에 학술 자원으로 깨졌다. 그래서 NIST/IETF는 2048-bit를 최소선으로 본다.",
    safeline: "권장 임계 (현재)",
    records: [
      { year: "2014", bits: 596, tech: "NFS-DLP", who: "Bouvier et al." },
      { year: "2016", bits: 768, tech: "NFS-DLP", who: "Kleinjung et al." },
      { year: "2017", bits: 1024, tech: "SNFS-DLP", who: "Logjam follow-up (special prime)" },
      { year: "2019+", bits: 795, tech: "NFS-DLP", who: "Boudot et al. (safe prime)" },
    ],
  },
  en: {
    caption:
      "Fig 4. Prime-field DH bits broken by NFS-DLP — 2014 through 2019, monotonically climbing.",
    note: "1024-bit (including widely-shared primes) fell to academic compute in 2017. That's why NIST/IETF now treat 2048-bit as the floor.",
    safeline: "Recommended floor (today)",
    records: [
      { year: "2014", bits: 596, tech: "NFS-DLP", who: "Bouvier et al." },
      { year: "2016", bits: 768, tech: "NFS-DLP", who: "Kleinjung et al." },
      { year: "2017", bits: 1024, tech: "SNFS-DLP", who: "Logjam follow-up (special prime)" },
      { year: "2019+", bits: 795, tech: "NFS-DLP", who: "Boudot et al. (safe prime)" },
    ],
  },
} as const;

const SCALE_MAX = 2200; // bits axis

export function DLPBreakRecords({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="relative">
        <div className="space-y-3">
          {s.records.map((r) => (
            <div
              key={r.year}
              className="grid grid-cols-[3.5rem_1fr_5rem] sm:grid-cols-[4rem_1fr_5.5rem] items-center gap-3 text-xs sm:text-sm"
            >
              <div className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                {r.year}
              </div>
              <div className="relative h-5 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100"
                  style={{ width: `${(r.bits / SCALE_MAX) * 100}%` }}
                />
                <div className="absolute inset-y-0 left-2 flex items-center text-[10px] text-zinc-50 dark:text-zinc-900 mix-blend-difference">
                  {r.tech} · {r.who}
                </div>
              </div>
              <div className="font-bold tabular-nums text-right text-zinc-900 dark:text-zinc-100">
                {r.bits.toLocaleString()}-bit
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[3.5rem_1fr_5rem] sm:grid-cols-[4rem_1fr_5.5rem] items-center gap-3 text-xs sm:text-sm">
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
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
