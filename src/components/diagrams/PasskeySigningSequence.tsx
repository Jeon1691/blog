import { SequenceDiagram, type SeqActor, type SeqEvent } from "./SequenceDiagram";

type Locale = "ko" | "en";

const DATA: Record<
  Locale,
  { caption: string; actors: SeqActor[]; events: SeqEvent[] }
> = {
  ko: {
    caption:
      "Fig 11. Passkey가 AA 계정의 소유자 서명자로 동작하는 전체 흐름 — 시드 문구나 secp256k1 EOA 키가 아니라, SEP 안의 Passkey가 P-256 서명을 만들고 체인은 그 서명의 유효성만 검증한다.",
    actors: [
      { id: "U", label: "사용자" },
      { id: "P", label: "Passkey", sub: "SEP · P-256", tone: "safe" },
      { id: "B", label: "번들러" },
      { id: "A", label: "AA 계정", sub: "ERC-4337" },
      { id: "S", label: "서명 검증", sub: "ERC-7913 · 1271" },
      { id: "V", label: "P-256 검증", sub: "RIP-7212 / 7951", tone: "safe" },
    ],
    events: [
      { kind: "msg", from: "U", to: "P", label: "생체 인증으로 서명 승인" },
      {
        kind: "msg",
        from: "P",
        to: "U",
        label: "P-256 서명 생성 (키는 SEP 밖으로 안 나감)",
        dashed: true,
      },
      { kind: "msg", from: "U", to: "B", label: "서명된 UserOperation 전송" },
      { kind: "msg", from: "B", to: "A", label: "UserOperation 제출" },
      { kind: "msg", from: "A", to: "S", label: "signer와 signature 해석" },
      { kind: "msg", from: "S", to: "V", label: "secp256r1 서명 검증" },
      { kind: "msg", from: "V", to: "S", label: "검증 성공", dashed: true },
      {
        kind: "msg",
        from: "S",
        to: "A",
        label: "유효한 소유자 서명으로 판정",
        dashed: true,
      },
      { kind: "msg", from: "A", to: "A", label: "트랜잭션 실행" },
      {
        kind: "note",
        from: "P",
        to: "A",
        label: "EOA가 아니라 AA 계정의 owner key로 직접 사용",
        tone: "safe",
      },
    ],
  },
  en: {
    caption:
      "Fig 11. The full flow with a Passkey acting as the AA account's owner signer — instead of a seed phrase or a secp256k1 EOA key, the Passkey inside the SEP produces a P-256 signature and the chain only checks that it is valid.",
    actors: [
      { id: "U", label: "User" },
      { id: "P", label: "Passkey", sub: "SEP · P-256", tone: "safe" },
      { id: "B", label: "Bundler" },
      { id: "A", label: "AA account", sub: "ERC-4337" },
      { id: "S", label: "Sig. check", sub: "ERC-7913 · 1271" },
      { id: "V", label: "P-256 verify", sub: "RIP-7212 / 7951", tone: "safe" },
    ],
    events: [
      { kind: "msg", from: "U", to: "P", label: "approve signing via biometrics" },
      {
        kind: "msg",
        from: "P",
        to: "U",
        label: "P-256 signature (key never leaves the SEP)",
        dashed: true,
      },
      { kind: "msg", from: "U", to: "B", label: "send signed UserOperation" },
      { kind: "msg", from: "B", to: "A", label: "submit UserOperation" },
      { kind: "msg", from: "A", to: "S", label: "interpret signer & signature" },
      { kind: "msg", from: "S", to: "V", label: "verify secp256r1 signature" },
      { kind: "msg", from: "V", to: "S", label: "verification ok", dashed: true },
      {
        kind: "msg",
        from: "S",
        to: "A",
        label: "judged a valid owner signature",
        dashed: true,
      },
      { kind: "msg", from: "A", to: "A", label: "execute transaction" },
      {
        kind: "note",
        from: "P",
        to: "A",
        label: "used directly as the AA account's owner key, not an EOA",
        tone: "safe",
      },
    ],
  },
};

export function PasskeySigningSequence({ locale = "ko" }: { locale?: Locale }) {
  const d = DATA[locale];
  return (
    <SequenceDiagram caption={d.caption} actors={d.actors} events={d.events} />
  );
}
