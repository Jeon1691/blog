"use client";

import { Figure } from "./Figure";
import { useStepReveal, Reveal, ReplayButton, Arrow } from "./useStepReveal";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 8. Passkey 기반 AA 지갑의 표준 조합 — Passkey가 만든 P-256 서명을 ERC-4337 AA 계정이 받고, ERC-1271·ERC-7913로 해석한 뒤 P-256 precompile로 검증한다. EOA가 아니라 AA 계정의 소유자 키로 동작한다.",
    user: "사용자",
    passkey: "Passkey / WebAuthn",
    passkeySub: "P-256 서명 생성",
    userop: "UserOperation",
    useropSub: "서명 데이터 포함",
    aa: "ERC-4337 AA 계정",
    aaSub: "validateUserOp",
    erc1271: "ERC-1271",
    erc1271Sub: "외부 서명 검증 인터페이스",
    erc7913: "ERC-7913",
    erc7913Sub: "주소 없는 signer 표현",
    verifier: "P-256 verifier",
    precompile: "RIP-7212 / EIP-7951",
    precompileSub: "P-256 precompile",
    decision: "검증 성공?",
    yes: "예",
    no: "아니오",
    exec: "트랜잭션 실행",
    reject: "거부",
  },
  en: {
    caption:
      "Fig 8. The standard stack for a Passkey-based AA wallet — an ERC-4337 AA account takes the P-256 signature the Passkey produced, interprets it via ERC-1271 / ERC-7913, then verifies it with a P-256 precompile. It acts as the AA account's owner key, not an EOA.",
    user: "User",
    passkey: "Passkey / WebAuthn",
    passkeySub: "produces a P-256 signature",
    userop: "UserOperation",
    useropSub: "carries the signature data",
    aa: "ERC-4337 AA account",
    aaSub: "validateUserOp",
    erc1271: "ERC-1271",
    erc1271Sub: "external signature-check interface",
    erc7913: "ERC-7913",
    erc7913Sub: "addressless signer representation",
    verifier: "P-256 verifier",
    precompile: "RIP-7212 / EIP-7951",
    precompileSub: "P-256 precompile",
    decision: "Verification passes?",
    yes: "yes",
    no: "no",
    exec: "Execute transaction",
    reject: "Reject",
  },
} as const;

export function PasskeyAccountFlow({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const a = useStepReveal(9);
  return (
    <Figure caption={s.caption}>
      <div ref={a.ref} className="max-w-md mx-auto flex flex-col">
        <Reveal shown={a.shown(0)} current={a.current(0)}>
          <Box title={s.user} />
        </Reveal>
        <Arrow shown={a.shown(1)} current={a.current(1)} />
        <Reveal shown={a.shown(1)} current={a.current(1)}>
          <Box title={s.passkey} sub={s.passkeySub} tone="safe" />
        </Reveal>
        <Arrow shown={a.shown(2)} current={a.current(2)} />
        <Reveal shown={a.shown(2)} current={a.current(2)}>
          <Box title={s.userop} sub={s.useropSub} />
        </Reveal>
        <Arrow shown={a.shown(3)} current={a.current(3)} />
        <Reveal shown={a.shown(3)} current={a.current(3)}>
          <Box title={s.aa} sub={s.aaSub} mono />
        </Reveal>
        <Arrow shown={a.shown(4)} current={a.current(4)} />

        {/* Branch: two standards interpret the signature */}
        <Reveal shown={a.shown(4)} current={a.current(4)}>
          <div className="grid grid-cols-2 gap-3">
            <Box title={s.erc1271} sub={s.erc1271Sub} />
            <Box title={s.erc7913} sub={s.erc7913Sub} />
          </div>
        </Reveal>
        <Arrow shown={a.shown(5)} current={a.current(5)} />
        <Reveal shown={a.shown(5)} current={a.current(5)}>
          <Box title={s.verifier} />
        </Reveal>
        <Arrow shown={a.shown(6)} current={a.current(6)} />
        <Reveal shown={a.shown(6)} current={a.current(6)}>
          <Box title={s.precompile} sub={s.precompileSub} tone="safe" />
        </Reveal>
        <Arrow shown={a.shown(7)} current={a.current(7)} />

        {/* Decision */}
        <div className="flex justify-center">
          <Reveal shown={a.shown(7)} current={a.current(7)}>
            <div className="rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {s.decision}
            </div>
          </Reveal>
        </div>
        <Reveal shown={a.shown(8)} current={a.current(8)}>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex flex-col items-center">
              <Branch shown={a.shown(8)} current={a.current(8)} label={s.yes} />
              <div className="w-full rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-center text-emerald-800 dark:text-emerald-200 mt-1">
                ✓ {s.exec}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Branch shown={a.shown(8)} current={a.current(8)} label={s.no} />
              <div className="w-full rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm font-semibold text-center text-rose-800 dark:text-rose-200 mt-1">
                ✗ {s.reject}
              </div>
            </div>
          </div>
        </Reveal>

        {a.enabled && (
          <ReplayButton onClick={a.replay} playing={a.playing} locale={locale} />
        )}
      </div>
    </Figure>
  );
}

// Small labelled connector for the yes/no branches under the decision.
function Branch({
  shown,
  current,
  label,
}: {
  shown: boolean;
  current: boolean;
  label: string;
}) {
  return (
    <div
      className="text-[10px] text-zinc-500 dark:text-zinc-400 transition-all duration-300"
      style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(4px)" }}
    >
      <span className={current ? "text-amber-600 dark:text-amber-400" : ""}>↓</span>{" "}
      {label}
    </div>
  );
}

function Box({
  title,
  sub,
  tone,
  mono,
}: {
  title: string;
  sub?: string;
  tone?: "safe";
  mono?: boolean;
}) {
  const cls =
    tone === "safe"
      ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950";
  return (
    <div className={`rounded-md border px-4 py-2 text-center ${cls}`}>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </div>
      {sub && (
        <div
          className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 ${
            mono ? "font-mono" : ""
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
