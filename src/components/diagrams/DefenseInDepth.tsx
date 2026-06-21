"use client";

import { Figure } from "./Figure";
import { useStepReveal, Reveal, ReplayButton } from "./useStepReveal";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 6. 계층 방어(defense in depth) — 한 계층이 뚫려도 다음 계층이 막는다. 하드웨어 키스토어부터 자산 분리까지 다섯 겹이 자산을 감싼다.",
    threat: "위협",
    threatSub: "멀웨어 · 피싱 · 분실 · 0-day",
    layers: [
      { n: "1", label: "하드웨어 키스토어", sub: "SEP / StrongBox" },
      { n: "2", label: "트랜잭션 단위 생체 인증", sub: "서명마다 명시적 승인" },
      { n: "3", label: "키 분산", sub: "MPC · 멀티시그" },
      { n: "4", label: "정책", sub: "한도 · 화이트리스트 · 타임락" },
      { n: "5", label: "자산 분리", sub: "콜드 월렛 · 소셜 리커버리" },
    ],
    asset: "보호 대상 자산",
  },
  en: {
    caption:
      "Fig 6. Defense in depth — if one layer is breached, the next one stops it. Five layers, from the hardware keystore to asset separation, wrap the funds.",
    threat: "Threat",
    threatSub: "malware · phishing · loss · 0-day",
    layers: [
      { n: "1", label: "Hardware keystore", sub: "SEP / StrongBox" },
      { n: "2", label: "Per-transaction biometrics", sub: "explicit approval each signature" },
      { n: "3", label: "Key splitting", sub: "MPC · multisig" },
      { n: "4", label: "Policy", sub: "limits · whitelist · timelock" },
      { n: "5", label: "Asset separation", sub: "cold wallet · social recovery" },
    ],
    asset: "Protected funds",
  },
} as const;

export function DefenseInDepth({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const a = useStepReveal(2 + s.layers.length);
  const assetIdx = 1 + s.layers.length;

  const asset = (
    <Reveal shown={a.shown(assetIdx)} current={a.current(assetIdx)}>
      <div className="rounded-md border border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-4 text-center">
        <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
          🎯 {s.asset}
        </div>
      </div>
    </Reveal>
  );

  // Build the nesting from the asset outward: layer 1 ends up outermost and
  // reveals first, so the shields appear to stack inward around the asset.
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
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {layer.label}
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            · {layer.sub}
          </span>
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
            <span className="text-sm font-bold text-rose-800 dark:text-rose-200">
              {s.threat}
            </span>
            <span className="text-xs text-rose-700/80 dark:text-rose-300/80 ml-2">
              {s.threatSub}
            </span>
          </div>
        </Reveal>
        <div className="text-center text-zinc-400 dark:text-zinc-600 text-lg leading-none my-1">
          ↓
        </div>
        {nested}
        {a.enabled && (
          <ReplayButton onClick={a.replay} playing={a.playing} locale={locale} />
        )}
      </div>
    </Figure>
  );
}
