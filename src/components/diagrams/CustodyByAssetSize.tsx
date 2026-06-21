import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 7. 자산 규모에 따른 보관 전략 — 소액은 휴대폰 핫월렛, 중간 규모는 AA 계정, 고액·장기 보관은 콜드 월렛/멀티시그. 자산이 클수록 온라인 노출을 줄이는 쪽으로 옮긴다.",
    q: "보관할 자산 규모는?",
    cols: [
      {
        cond: "소액 · 일상 거래",
        title: "휴대폰 핫월렛",
        sub: "SEP + 트랜잭션 생체 승인",
        tag: "온라인 노출 ↑",
        tone: "warn",
      },
      {
        cond: "중간 규모",
        title: "AA 계정",
        sub: "MPC / 소셜 리커버리 + 한도",
        tag: "위험 분산",
        tone: "neutral",
      },
      {
        cond: "고액 · 장기 보관",
        title: "콜드 월렛 / 멀티시그",
        sub: "오프라인 분리",
        tag: "온라인 노출 ↓",
        tone: "safe",
      },
    ],
  },
  en: {
    caption:
      "Fig 7. Custody strategy by asset size — small amounts in a phone hot wallet, mid-size funds in an AA account, high-value or long-term holdings in a cold/multisig setup. The larger the funds, the further you move offline.",
    q: "How much are you storing?",
    cols: [
      {
        cond: "Small · everyday",
        title: "Phone hot wallet",
        sub: "SEP + per-transaction biometrics",
        tag: "online exposure ↑",
        tone: "warn",
      },
      {
        cond: "Mid-size",
        title: "AA account",
        sub: "MPC / social recovery + limits",
        tag: "risk spread out",
        tone: "neutral",
      },
      {
        cond: "High-value · long-term",
        title: "Cold wallet / multisig",
        sub: "kept offline",
        tag: "online exposure ↓",
        tone: "safe",
      },
    ],
  },
} as const;

const TONE: Record<string, string> = {
  warn: "border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40",
  neutral: "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950",
  safe: "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40",
};
const TAG_TONE: Record<string, string> = {
  warn: "text-amber-700 dark:text-amber-300",
  neutral: "text-zinc-500 dark:text-zinc-400",
  safe: "text-emerald-700 dark:text-emerald-300",
};

export function CustodyByAssetSize({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      {/* Decision node */}
      <div className="flex justify-center">
        <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {s.q}
        </div>
      </div>
      <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
        ↓
      </div>

      {/* Branches by asset size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {s.cols.map((c) => (
          <div key={c.title} className="flex flex-col">
            <div className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1 text-xs text-center text-zinc-600 dark:text-zinc-400">
              {c.cond}
            </div>
            <div className="text-center text-zinc-300 dark:text-zinc-600 leading-none mt-1">
              ↓
            </div>
            <div
              className={`flex-1 rounded-md border px-3 py-3 text-center mt-1 ${TONE[c.tone]}`}
            >
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {c.title}
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                {c.sub}
              </div>
              <div className={`text-[10px] mt-2 font-medium ${TAG_TONE[c.tone]}`}>
                {c.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
