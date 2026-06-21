import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 2. 신뢰 경계 구조 — 개인키는 보안 영역(SEP/StrongBox) 안에서만 존재하고, 앱은 서명을 '요청'만 한다. 멀웨어가 앱을 장악해도 키 자체는 경계를 넘지 못한다.",
    normalZone: "일반 영역",
    user: "사용자 / 생체인증",
    app: "지갑 앱",
    malware: "멀웨어 / OS 취약점",
    malwareEdge: "앱 장악 시도",
    network: "네트워크 / 블록체인",
    reqDown: "서명 요청",
    reqUp: "서명 결과만 반환 (키 아님)",
    boundary: "신뢰 경계 (Trust Boundary)",
    secureZone: "보안 영역",
    enclave: "Secure Enclave / StrongBox",
    enclaveSub: "개인키(raw bits)는 이 경계 안에서만 존재 — 밖으로 나가지 않는다",
    note: "멀웨어가 앱을 완전히 장악해도 키는 못 꺼낸다. 단, 원하는 트랜잭션에 서명을 '요청'할 수는 있다 (Fig 4).",
  },
  en: {
    caption:
      "Fig 2. The trust boundary — the private key exists only inside the secure zone (SEP/StrongBox); the app can merely 'request' a signature. Even if malware owns the app, the key never crosses the boundary.",
    normalZone: "Normal zone",
    user: "User / biometrics",
    app: "Wallet app",
    malware: "Malware / OS exploit",
    malwareEdge: "tries to own the app",
    network: "Network / blockchain",
    reqDown: "signing request",
    reqUp: "only the signature comes back (not the key)",
    boundary: "Trust Boundary",
    secureZone: "Secure zone",
    enclave: "Secure Enclave / StrongBox",
    enclaveSub: "the private key (raw bits) exists only inside this boundary — it never leaves",
    note: "Even if malware fully owns the app it cannot extract the key. But it can still 'request' a signature on a transaction of its choosing (Fig 4).",
  },
} as const;

export function KeyTrustBoundary({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="max-w-2xl mx-auto">
        {/* Normal (untrusted) zone */}
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-4 pt-7 pb-4 relative">
          <ZoneTag tone="neutral">{s.normalZone}</ZoneTag>

          <Node>{s.user}</Node>
          <Arrow />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {s.app}
            </div>
            <span className="text-rose-400 dark:text-rose-500 text-xs">
              ⟵ {s.malwareEdge} ⟵
            </span>
            <div className="rounded-md border border-dashed border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-medium text-rose-800 dark:text-rose-200">
              {s.malware}
            </div>
          </div>
          <Arrow />
          <Node>{s.network}</Node>
        </div>

        {/* Boundary crossing */}
        <div className="grid grid-cols-2 text-[10px] text-zinc-500 dark:text-zinc-400 my-1.5">
          <div className="text-center">↓ {s.reqDown}</div>
          <div className="text-center">↑ {s.reqUp}</div>
        </div>
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute inset-x-0 border-t border-dashed border-rose-400 dark:border-rose-700" />
          <span className="relative bg-zinc-50 dark:bg-zinc-900 px-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            🔒 {s.boundary}
          </span>
        </div>

        {/* Secure (trusted) zone */}
        <div className="rounded-lg border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-4 pt-7 pb-4 relative mt-1">
          <ZoneTag tone="safe">{s.secureZone}</ZoneTag>
          <div className="text-center text-sm font-bold text-emerald-800 dark:text-emerald-200">
            {s.enclave}
          </div>
          <div className="text-center text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
            {s.enclaveSub}
          </div>
        </div>

        <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
          {s.note}
        </p>
      </div>
    </Figure>
  );
}

function Node({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 text-center">
        {children}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
      ↓
    </div>
  );
}

function ZoneTag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "neutral" | "safe";
}) {
  const cls =
    tone === "safe"
      ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
      : "border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400";
  return (
    <div
      className={`absolute top-0 left-3 -translate-y-1/2 rounded-full border bg-zinc-50 dark:bg-zinc-900 px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${cls}`}
    >
      {children}
    </div>
  );
}
