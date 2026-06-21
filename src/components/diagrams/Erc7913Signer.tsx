import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 9. ERC-7913의 주소 없는 signer 표현 — Ethereum 주소가 없는 P-256 키를 'verifier ‖ key' 바이트열로 표현한다. verifier가 signature를 해석하고, 필요하면 P-256 precompile을 호출해 검증한다.",
    signer: "signer (bytes)",
    verifier: "verifier",
    verifierSub: "20 bytes — 검증 컨트랙트 주소",
    key: "key",
    keySub: "P-256 공개키 등 실제 식별자",
    sigChip: "signature · WebAuthn / P-256 서명",
    process: "verifier가 signature를 해석 → 필요 시 P-256 precompile 호출",
    decision: "유효한 signer인가?",
    yes: "예",
    no: "아니오",
    accept: "AA 계정 owner로 인정",
    reject: "검증 실패",
  },
  en: {
    caption:
      "Fig 9. ERC-7913's addressless signer — a P-256 key with no Ethereum address is represented as a 'verifier ‖ key' byte string. The verifier interprets the signature, calling the P-256 precompile when needed.",
    signer: "signer (bytes)",
    verifier: "verifier",
    verifierSub: "20 bytes — verification contract address",
    key: "key",
    keySub: "real identifier, e.g. a P-256 public key",
    sigChip: "signature · WebAuthn / P-256 signature",
    process: "the verifier interprets the signature → calls the P-256 precompile if needed",
    decision: "Valid signer?",
    yes: "yes",
    no: "no",
    accept: "Recognized as the AA account owner",
    reject: "Verification fails",
  },
} as const;

export function Erc7913Signer({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="max-w-xl mx-auto">
        {/* Byte layout: signer = verifier ‖ key */}
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-center mb-1.5">
          {s.signer}
        </div>
        <div className="flex items-stretch rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 font-mono">
          <div className="flex-[2] bg-zinc-100 dark:bg-zinc-900 px-3 py-2.5 text-center">
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {s.verifier}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
              {s.verifierSub}
            </div>
          </div>
          <div className="flex items-center bg-zinc-300 dark:bg-zinc-700 px-1 text-zinc-600 dark:text-zinc-300 text-sm font-bold">
            ‖
          </div>
          <div className="flex-[3] bg-white dark:bg-zinc-950 px-3 py-2.5 text-center">
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {s.key}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
              {s.keySub}
            </div>
          </div>
        </div>

        <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
          ↓
        </div>

        {/* signature input + verifier processing */}
        <div className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1.5 text-center text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
          {s.sigChip}
        </div>
        <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
          ↓
        </div>
        <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-center text-sm text-zinc-800 dark:text-zinc-200">
          {s.process}
        </div>

        <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
          ↓
        </div>
        <div className="flex justify-center">
          <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {s.decision}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
              ↓ {s.yes}
            </div>
            <div className="w-full rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-center text-emerald-800 dark:text-emerald-200 mt-1">
              ✓ {s.accept}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
              ↓ {s.no}
            </div>
            <div className="w-full rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm font-semibold text-center text-rose-800 dark:text-rose-200 mt-1">
              ✗ {s.reject}
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}
