import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 2. 서명 인프라의 신뢰 경계 — 키는 서명 시스템 안을 벗어나지 않았다. 공격자는 노트북에서 컨테이너로 들어간 뒤, 정책 엔진을 거치지 않는 경로로 서명 시스템에 요청을 넣었다.",
    opsZone: "운영 영역",
    laptop: "DevOps 엔지니어 노트북",
    laptopSub: "최초 침투 지점",
    container: "내부 서비스 컨테이너",
    containerSub: "서명 요청 권한 보유",
    normalPath: "정상 경로",
    policy: "리스크·정책 엔진",
    policySub: "화이트리스트 · 한도 · 이상 탐지",
    attackPath: "공격 경로",
    bypass: "정책 엔진 우회",
    bypassSub: "\"정상 승인 통제를 거치지 않았다\"",
    boundary: "신뢰 경계",
    secureZone: "서명 영역",
    signer: "핫월렛 서명 시스템",
    signerSub: "개인키는 이 안에만 존재 — 유출 증거 없음",
    note: "휴대폰의 Secure Enclave와 같은 구조다. 키는 경계를 넘지 않지만, 경계 안으로 들어온 요청에는 서명한다.",
  },
  en: {
    caption:
      "Fig 2. The trust boundary of the signing infrastructure — the keys never left the signing system. The attacker went from a laptop into a container, then fed requests to the signer along a path that skipped the policy engine.",
    opsZone: "Operations zone",
    laptop: "DevOps engineer laptop",
    laptopSub: "initial entry point",
    container: "Internal service container",
    containerSub: "holds signing-request rights",
    normalPath: "Normal path",
    policy: "Risk / policy engine",
    policySub: "whitelist · limits · anomaly detection",
    attackPath: "Attack path",
    bypass: "Policy engine bypassed",
    bypassSub: "\"did not pass through normal approval controls\"",
    boundary: "Trust boundary",
    secureZone: "Signing zone",
    signer: "Hot-wallet signing system",
    signerSub: "private keys exist only in here — no evidence of leakage",
    note: "The same structure as a phone's Secure Enclave: the key never crosses the boundary, but any request that reaches it gets signed.",
  },
} as const;

export function SigningInfraBoundary({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-4 pt-7 pb-4 relative">
          <ZoneTag tone="neutral">{s.opsZone}</ZoneTag>

          <Node tone="danger" title={s.laptop} sub={s.laptopSub} />
          <Down className="text-rose-400 dark:text-rose-500" />
          <Node title={s.container} sub={s.containerSub} />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex flex-col items-center">
              <PathLabel tone="neutral">{s.normalPath}</PathLabel>
              <Down className="text-zinc-400 dark:text-zinc-600" />
              <Node title={s.policy} sub={s.policySub} />
              <Down className="text-zinc-400 dark:text-zinc-600" />
            </div>
            <div className="flex flex-col items-center">
              <PathLabel tone="danger">{s.attackPath}</PathLabel>
              <Down className="text-rose-400 dark:text-rose-500" />
              <div className="w-full rounded-md border border-dashed border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-center">
                <div className="text-sm font-semibold text-rose-800 dark:text-rose-200">
                  {s.bypass}
                </div>
                <div className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                  {s.bypassSub}
                </div>
              </div>
              <Down className="text-rose-400 dark:text-rose-500" />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-x-0 border-t border-dashed border-rose-400 dark:border-rose-700" />
          <span className="relative bg-zinc-50 dark:bg-zinc-900 px-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {s.boundary}
          </span>
        </div>

        <div className="rounded-lg border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-4 pt-7 pb-4 relative">
          <ZoneTag tone="safe">{s.secureZone}</ZoneTag>
          <div className="text-center text-sm font-bold text-emerald-800 dark:text-emerald-200">
            {s.signer}
          </div>
          <div className="text-center text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
            {s.signerSub}
          </div>
        </div>

        <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
          {s.note}
        </p>
      </div>
    </Figure>
  );
}

function Node({
  title,
  sub,
  tone = "neutral",
}: {
  title: string;
  sub: string;
  tone?: "neutral" | "danger";
}) {
  const cls =
    tone === "danger"
      ? "border-dashed border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200"
      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100";
  return (
    <div className="flex justify-center w-full">
      <div className={`w-full max-w-xs rounded-md border px-4 py-2 text-center ${cls}`}>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[11px] opacity-75 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function Down({ className }: { className: string }) {
  return <div className={`text-center text-lg leading-none my-1 ${className}`}>↓</div>;
}

function PathLabel({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "neutral" | "danger";
}) {
  const cls =
    tone === "danger"
      ? "text-rose-700 dark:text-rose-300"
      : "text-zinc-500 dark:text-zinc-400";
  return (
    <div className={`text-[10px] uppercase tracking-wider font-semibold ${cls}`}>
      {children}
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
