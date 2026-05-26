import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 1. Diffie-Hellman 키 교환 — Alice와 Bob은 비밀 a, b로부터 g^(ab)에 도달하지만, Eve는 g, p, A, B만 본다.",
    domainHeader: "공개 도메인 파라미터",
    alice: "Alice",
    bob: "Bob",
    pickSecret: "비밀 무작위 선택",
    sendPublic: "공개값 전송",
    derive: "공유키 계산",
    eveLabel: "Eve가 보는 것 (도청)",
    eveSees: "g, p, A, B — 비밀 a, b, K는 못 봄",
    eveAttack: "K를 얻으려면 결국 DLP를 풀어야 함",
  },
  en: {
    caption: "Fig 1. Diffie-Hellman key exchange — Alice and Bob reach g^(ab) from their secrets a, b while Eve sees only g, p, A, B.",
    domainHeader: "Public domain parameters",
    alice: "Alice",
    bob: "Bob",
    pickSecret: "Pick random secret",
    sendPublic: "Send public value",
    derive: "Derive shared key",
    eveLabel: "What Eve sees (eavesdropper)",
    eveSees: "g, p, A, B — never the secrets a, b, K",
    eveAttack: "Recovering K still requires solving the DLP",
  },
} as const;

export function DHKeyExchange({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 mb-5 text-center">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {s.domainHeader}
        </div>
        <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
          g, p (large prime)
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <Party
          name={s.alice}
          secret="a"
          publicLabel="A"
          publicValue="g^a mod p"
          deriveValue="B^a mod p"
          texts={s}
        />
        <div className="flex sm:flex-col items-center justify-center gap-3 py-2">
          <ExchangeArrow direction="right" label="A" />
          <ExchangeArrow direction="left" label="B" />
        </div>
        <Party
          name={s.bob}
          secret="b"
          publicLabel="B"
          publicValue="g^b mod p"
          deriveValue="A^b mod p"
          texts={s}
        />
      </div>

      <div className="mt-5 rounded-md border border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950 px-4 py-3 text-center">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          ↓ {s.derive} ↓
        </div>
        <div className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          K = g^(ab) mod p
        </div>
      </div>

      <div className="mt-5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {s.eveLabel}
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
          {s.eveSees}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 italic">
          {s.eveAttack}
        </div>
      </div>
    </Figure>
  );
}

function Party({
  name,
  secret,
  publicLabel,
  publicValue,
  deriveValue,
  texts,
}: {
  name: string;
  secret: string;
  publicLabel: string;
  publicValue: string;
  deriveValue: string;
  texts: (typeof STRINGS)["ko"];
}) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
        {name}
      </div>
      <div className="space-y-3 text-xs">
        <div>
          <div className="text-zinc-500 dark:text-zinc-400">
            ① {texts.pickSecret}
          </div>
          <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
            secret {secret}
          </div>
        </div>
        <div>
          <div className="text-zinc-500 dark:text-zinc-400">
            ② {texts.sendPublic}
          </div>
          <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
            {publicLabel} = {publicValue}
          </div>
        </div>
        <div>
          <div className="text-zinc-500 dark:text-zinc-400">
            ③ {texts.derive}
          </div>
          <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
            K = {deriveValue}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExchangeArrow({
  direction,
  label,
}: {
  direction: "left" | "right";
  label: string;
}) {
  const arrow = direction === "right" ? "→" : "←";
  return (
    <div className="flex items-center gap-2 font-mono text-zinc-700 dark:text-zinc-300">
      {direction === "left" && <span className="text-lg">{arrow}</span>}
      <span className="text-xs font-bold">{label}</span>
      {direction === "right" && <span className="text-lg">{arrow}</span>}
    </div>
  );
}
