import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 3. Secure Enclave의 곡선 불일치 — SEP는 밖으로 꺼낼 수 없는 P-256 키만 다루지만, 블록체인은 secp256k1·Ed25519 서명을 요구한다. 그래서 실제 모바일 지갑은 두 우회 패턴 중 하나를 쓴다.",
    sep: "SEP 내부 P-256 키",
    sepSub: "export 불가 — 키 비트는 SEP 밖으로 안 나감",
    chain: "블록체인 서명 요구",
    chainSub: "secp256k1 · Ed25519",
    mismatch: "곡선 불일치로 직접 서명 불가",
    p1: "패턴 1 · 래핑 키(KEK)",
    p1sub: "실제 secp256k1 키를 암호화해 저장하고, 그 암호화 키를 SEP가 생체인증으로 게이팅한다.",
    p1out: "서명 시 앱 메모리로 복호화 → 짧은 노출 구간 발생",
    p2: "패턴 2 · AA 계정의 P-256 서명자",
    p2sub: "ERC-4337 · ERC-1271 · ERC-7913이 P-256 서명을 유효한 소유자 서명으로 인정한다.",
    p2out: "시드 문구 불필요 → Passkey가 직접 소유자 키 역할",
  },
  en: {
    caption:
      "Fig 3. Secure Enclave's curve mismatch — the SEP only handles non-exportable P-256 keys, but blockchains demand secp256k1 / Ed25519 signatures. So real mobile wallets take one of two workaround paths.",
    sep: "P-256 key inside the SEP",
    sepSub: "Non-exportable — key bits never leave the SEP",
    chain: "Blockchain signing requirement",
    chainSub: "secp256k1 · Ed25519",
    mismatch: "curve mismatch — cannot sign directly",
    p1: "Pattern 1 · Wrapping key (KEK)",
    p1sub: "Store the real secp256k1 key encrypted, and gate that encryption key behind the SEP with biometrics.",
    p1out: "Decrypted into app memory at signing time → a brief exposure window",
    p2: "Pattern 2 · P-256 signer for an AA account",
    p2sub: "ERC-4337 · ERC-1271 · ERC-7913 accept the P-256 signature as a valid owner signature.",
    p2out: "No seed phrase → the Passkey is the owner key itself",
  },
} as const;

export function SepCurveMismatch({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      {/* Mismatch row: SEP key vs chain requirement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
        <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-center">
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            {s.sep}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {s.sepSub}
          </div>
        </div>
        <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-center">
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            {s.chain}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
            {s.chainSub}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 my-3">
        <span className="text-rose-600 dark:text-rose-400 text-base leading-none font-bold">
          ✗
        </span>
        <span className="text-xs text-rose-700 dark:text-rose-300">
          {s.mismatch}
        </span>
      </div>

      <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none mb-1">
        ↓
      </div>

      {/* Two workaround patterns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Pattern
          title={s.p1}
          sub={s.p1sub}
          outcome={s.p1out}
          tone="warn"
          mark="⚠"
        />
        <Pattern
          title={s.p2}
          sub={s.p2sub}
          outcome={s.p2out}
          tone="safe"
          mark="✓"
        />
      </div>
    </Figure>
  );
}

function Pattern({
  title,
  sub,
  outcome,
  tone,
  mark,
}: {
  title: string;
  sub: string;
  outcome: string;
  tone: "warn" | "safe";
  mark: string;
}) {
  const outClass =
    tone === "safe"
      ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
      : "border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200";
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col">
      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
        {title}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug flex-1">
        {sub}
      </div>
      <div className="text-center text-zinc-400 dark:text-zinc-600 leading-none mt-3">
        ↓
      </div>
      <div
        className={`rounded-md border px-3 py-2 text-sm font-semibold text-center mt-1 ${outClass}`}
      >
        {mark} {outcome}
      </div>
    </div>
  );
}
