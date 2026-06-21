import { SequenceDiagram, type SeqActor, type SeqEvent } from "./SequenceDiagram";

type Locale = "ko" | "en";

const DATA: Record<
  Locale,
  { caption: string; actors: SeqActor[]; events: SeqEvent[] }
> = {
  ko: {
    caption:
      "Fig 4. 서명 위임의 역설 — 멀웨어는 키를 빼내지 못해도, 사용자를 속여 서명을 '요청'하게 만들면 보안 영역은 그대로 서명해준다. 키의 기밀성은 지켜지지만 자산은 털린다.",
    actors: [
      { id: "M", label: "멀웨어", sub: "악성 dApp", tone: "danger" },
      { id: "A", label: "지갑 앱" },
      { id: "U", label: "사용자" },
      { id: "S", label: "Secure Enclave", sub: "/ StrongBox", tone: "safe" },
      { id: "C", label: "블록체인" },
    ],
    events: [
      { kind: "msg", from: "M", to: "A", label: "악성 트랜잭션 서명 요청" },
      { kind: "msg", from: "A", to: "U", label: "승인 요청 (위장된 화면)" },
      { kind: "msg", from: "U", to: "A", label: "승인 (속아서)" },
      { kind: "msg", from: "A", to: "S", label: "서명 위임" },
      { kind: "msg", from: "S", to: "A", label: "서명 반환", dashed: true },
      { kind: "msg", from: "A", to: "C", label: "악성 트랜잭션 전파" },
      {
        kind: "note",
        from: "S",
        to: "C",
        label: "키는 유출되지 않았지만 자산은 탈취됨",
        tone: "danger",
      },
    ],
  },
  en: {
    caption:
      "Fig 4. The signing-delegation paradox — malware never extracts the key, yet by tricking the user into approving, it gets the secure element to sign anyway. The key stays confidential, but the funds are gone.",
    actors: [
      { id: "M", label: "Malware", sub: "malicious dApp", tone: "danger" },
      { id: "A", label: "Wallet app" },
      { id: "U", label: "User" },
      { id: "S", label: "Secure Enclave", sub: "/ StrongBox", tone: "safe" },
      { id: "C", label: "Blockchain" },
    ],
    events: [
      { kind: "msg", from: "M", to: "A", label: "sign this malicious tx" },
      { kind: "msg", from: "A", to: "U", label: "approval prompt (spoofed screen)" },
      { kind: "msg", from: "U", to: "A", label: "approve (deceived)" },
      { kind: "msg", from: "A", to: "S", label: "delegate signing" },
      { kind: "msg", from: "S", to: "A", label: "signature returned", dashed: true },
      { kind: "msg", from: "A", to: "C", label: "broadcast malicious tx" },
      {
        kind: "note",
        from: "S",
        to: "C",
        label: "the key never leaked, yet the funds are stolen",
        tone: "danger",
      },
    ],
  },
};

export function SigningDelegationParadox({ locale = "ko" }: { locale?: Locale }) {
  const d = DATA[locale];
  return (
    <SequenceDiagram caption={d.caption} actors={d.actors} events={d.events} />
  );
}
