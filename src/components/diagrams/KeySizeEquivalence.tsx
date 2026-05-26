import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 3. 동일한 ‘128-bit 보안 등급'에 도달하기 위한 키 길이 — FFDH는 ECDH 키의 12배가 필요.",
    note: "Index Calculus가 FFDH에는 적용되고 ECDLP에는 적용되지 않기 때문. 같은 안전 수준에서 더 작은 키 = 더 빠른 핸드셰이크, 더 적은 대역, 더 작은 인증서.",
    securityLevel: "보안 수준",
    rows: [
      { label: "FFDH", bits: 3072, sub: "유한체 prime $p$" },
      { label: "ECDH", bits: 256, sub: "Curve25519, P-256 등" },
    ],
  },
  en: {
    caption:
      "Fig 3. Key length needed for the same 128-bit security level — FFDH needs 12× the bits ECDH does.",
    note: "Because Index Calculus applies to FFDH but not to ECDLP. Same security with fewer bits means faster handshakes, less bandwidth, smaller certificates.",
    securityLevel: "Security level",
    rows: [
      { label: "FFDH", bits: 3072, sub: "Finite-field prime $p$" },
      { label: "ECDH", bits: 256, sub: "Curve25519, P-256, etc." },
    ],
  },
} as const;

const SCALE_MAX = 3200;

export function KeySizeEquivalence({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="space-y-6">
        {s.rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {r.label}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {r.sub}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-6 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100"
                  style={{ width: `${(r.bits / SCALE_MAX) * 100}%` }}
                />
              </div>
              <div className="w-24 text-right">
                <span className="font-bold tabular-nums text-lg text-zinc-900 dark:text-zinc-100">
                  {r.bits.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                  bit
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{s.securityLevel}: 128-bit (Pollard's rho on ECDH = 2¹²⁸)</span>
      </div>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
