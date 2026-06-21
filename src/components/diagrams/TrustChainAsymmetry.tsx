"use client";

import { Figure } from "./Figure";
import { useStepReveal, Reveal, ReplayButton, Arrow } from "./useStepReveal";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 5. 겹겹이 쌓인 신뢰 전제 — '완벽한 안전'은 칩 제조사부터 사용자까지 모든 단계가 안전하다는 가정 위에 있다. 방어자는 모든 단계를 지켜야 하지만, 공격자는 하나만 뚫으면 된다.",
    claim: "완벽한 안전 주장",
    claimSub: "= 아래 모든 단계가 안전하다는 가정",
    attacker: "공격자",
    attackerSub: "어느 한 단계만 깨도 충분",
    layers: [
      { label: "칩 제조사", sub: "하드웨어 설계" },
      { label: "펌웨어", sub: "Secure Enclave / TEE" },
      { label: "OS", sub: "커널 · 권한 모델" },
      { label: "지갑 앱", sub: "구현 · UX" },
      { label: "사용자", sub: "승인 · 판단", attack: "피싱 · 사회공학" },
    ],
    outcome: "자산 이동 승인",
    note: "방어와 공격의 비대칭 — 방어자는 모든 구멍을 막아야 하지만, 공격자는 단 하나만 찾으면 된다.",
  },
  en: {
    caption:
      "Fig 5. Layered trust assumptions — 'perfect security' rests on every stage being safe, from the chip vendor to the user. The defender must hold every stage; the attacker only needs one.",
    claim: "Claim of perfect security",
    claimSub: "= the assumption that every stage below is safe",
    attacker: "Attacker",
    attackerSub: "breaking any single stage is enough",
    layers: [
      { label: "Chip vendor", sub: "hardware design" },
      { label: "Firmware", sub: "Secure Enclave / TEE" },
      { label: "OS", sub: "kernel · permission model" },
      { label: "Wallet app", sub: "implementation · UX" },
      { label: "User", sub: "approval · judgment", attack: "phishing · social engineering" },
    ],
    outcome: "Approves the asset transfer",
    note: "Asymmetry of defense and attack — the defender must close every hole, while the attacker only needs to find one.",
  },
} as const;

export function TrustChainAsymmetry({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const a = useStepReveal(2 + s.layers.length);
  const outcomeIdx = 1 + s.layers.length;
  return (
    <Figure caption={s.caption}>
      <div ref={a.ref}>
        {/* Claim header */}
        <div className="max-w-md mx-auto">
          <Reveal shown={a.shown(0)} current={a.current(0)}>
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 text-center">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {s.claim}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {s.claimSub}
              </div>
            </div>
          </Reveal>
        </div>
        <Arrow shown={a.shown(1)} current={a.current(1)} />

        {/* Attacker rail + trust chain */}
        <div className="grid grid-cols-[auto_1fr] gap-3 items-stretch max-w-2xl mx-auto">
          <div className="rounded-md border border-dashed border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 px-3 py-3 flex flex-col items-center justify-center text-center w-24 sm:w-28">
            <div className="text-sm font-bold text-rose-800 dark:text-rose-200">
              {s.attacker}
            </div>
            <div className="text-[10px] text-rose-700/80 dark:text-rose-300/80 mt-1 leading-tight">
              {s.attackerSub}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {s.layers.map((layer, i) => (
              <div key={layer.label}>
                <Reveal shown={a.shown(1 + i)} current={a.current(1 + i)}>
                  <div className="rounded-md border border-l-2 border-zinc-200 dark:border-zinc-800 border-l-rose-300 dark:border-l-rose-800 bg-white dark:bg-zinc-950 px-3 py-2 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {layer.label}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 text-right">
                      {layer.sub}
                    </span>
                  </div>
                  {"attack" in layer && layer.attack && (
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 text-center mt-0.5">
                      ✗ {layer.attack}
                    </div>
                  )}
                </Reveal>
                {i < s.layers.length - 1 && (
                  <Arrow
                    shown={a.shown(i + 2)}
                    current={a.current(i + 2)}
                    size="sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <Arrow shown={a.shown(outcomeIdx)} current={a.current(outcomeIdx)} />
        <div className="max-w-md mx-auto">
          <Reveal shown={a.shown(outcomeIdx)} current={a.current(outcomeIdx)}>
            <div className="rounded-md border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-center text-sm font-semibold text-amber-800 dark:text-amber-200">
              {s.outcome}
            </div>
          </Reveal>
        </div>

        <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
          {s.note}
        </p>
        {a.enabled && (
          <ReplayButton onClick={a.replay} playing={a.playing} locale={locale} />
        )}
      </div>
    </Figure>
  );
}
