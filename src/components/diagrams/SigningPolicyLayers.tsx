"use client";

import { Figure } from "./Figure";
import { useStepReveal, Reveal, ReplayButton } from "./useStepReveal";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 6. 서명 인프라를 위한 계층 방어 — 바깥 단말부터 위임 감시까지 여섯 겹. 각 층 오른쪽은 이번 사건에서 그 층이 막았을 단계다.",
    threat: "공격자",
    threatSub: "DevOps 단말 침해 → 서명 요청 경로",
    layers: [
      { n: "1", label: "운영자 단말 분리", sub: "권한 상승에 별도 승인", stops: "§1 최초 침투" },
      { n: "2", label: "컨테이너 최소 권한", sub: "서비스·체인별 단기 자격증명", stops: "§6.3 H1" },
      { n: "3", label: "정책 엔진 직렬 배치", sub: "7702 기본 거부 · 다중 nonce 탐지", stops: "§5.2 위임" },
      { n: "4", label: "서명기 자체 디코딩", sub: "원시 해시 서명 거부", stops: "§6.5 H2" },
      { n: "5", label: "체인·등급별 서명 분리", sub: "한 경로로 모든 체인에 닿지 않게", stops: "§3 11개 체인" },
      { n: "6", label: "위임 상태 실시간 감시", sub: "감지 즉시 입금 모음 차단·해제", stops: "§5.3 3시간 49분" },
    ],
    asset: "서명 시스템과 핫월렛 자산",
  },
  en: {
    caption:
      "Fig 6. Defense in depth for signing infrastructure — six layers from the outer endpoint to delegation monitoring. The tag on each layer shows which stage of this attack it would have stopped.",
    threat: "Attacker",
    threatSub: "DevOps endpoint compromise → signing-request path",
    layers: [
      { n: "1", label: "Isolated operator endpoints", sub: "separate approval for privilege escalation", stops: "§1 initial access" },
      { n: "2", label: "Least-privilege containers", sub: "short-lived per-service, per-chain credentials", stops: "§6.3 H1" },
      { n: "3", label: "Policy engine in series", sub: "default-deny 7702 · multi-nonce detection", stops: "§5.2 delegation" },
      { n: "4", label: "Signer decodes for itself", sub: "refuses raw-hash signing", stops: "§6.5 H2" },
      { n: "5", label: "Per-chain, per-tier signers", sub: "no single path reaches every chain", stops: "§3 11 chains" },
      { n: "6", label: "Real-time delegation monitoring", sub: "halt consolidation and revoke on detection", stops: "§5.3 3h49m" },
    ],
    asset: "Signing system and hot-wallet funds",
  },
} as const;

export function SigningPolicyLayers({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const a = useStepReveal(2 + s.layers.length);
  const assetIdx = 1 + s.layers.length;

  const asset = (
    <Reveal shown={a.shown(assetIdx)} current={a.current(assetIdx)}>
      <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-4 text-center">
        <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{s.asset}</div>
      </div>
    </Reveal>
  );

  // Nest from the asset outward so layer 1 is outermost and reveals first.
  const nested = s.layers.reduceRight<React.ReactNode>((inner, layer, i) => {
    const idx = 1 + i;
    return (
      <div
        key={layer.n}
        className={`rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100/60 dark:bg-zinc-900/50 pt-8 px-3 pb-3 relative transition-all duration-500 ${
          a.current(idx) ? "ring-2 ring-amber-400/80 dark:ring-amber-500/70" : ""
        }`}
        style={{ opacity: a.shown(idx) ? 1 : 0 }}
      >
        <div className="absolute top-0 left-3 -translate-y-1/2 flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-0.5">
          <span className="font-mono text-[10px] font-bold w-4 h-4 rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center">
            {layer.n}
          </span>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{layer.label}</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden md:inline">· {layer.sub}</span>
        </div>
        <div className="absolute top-0 right-3 -translate-y-1/2 rounded-full bg-rose-600 dark:bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5">
          {layer.stops}
        </div>
        {inner}
      </div>
    );
  }, asset);

  return (
    <Figure caption={s.caption}>
      <div ref={a.ref} className="max-w-2xl mx-auto">
        <Reveal shown={a.shown(0)} current={a.current(0)}>
          <div className="rounded-md border border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-4 py-2.5 text-center">
            <span className="text-sm font-bold text-rose-800 dark:text-rose-200">{s.threat}</span>
            <span className="text-xs text-rose-700/80 dark:text-rose-300/80 ml-2">{s.threatSub}</span>
          </div>
        </Reveal>
        <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">↓</div>
        {nested}
        {a.enabled && <ReplayButton onClick={a.replay} playing={a.playing} locale={locale} />}
      </div>
    </Figure>
  );
}
