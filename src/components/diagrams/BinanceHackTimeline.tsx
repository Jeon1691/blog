import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Phase = "prep" | "drain" | "freeze" | "halt" | "revoke";

type Event = {
  time: string;
  title: string;
  body: string;
  phase: Phase;
};

const STRINGS = {
  ko: {
    caption:
      "Fig 1. 사건 전체 타임라인(UTC) — 36시간의 준비, 20분의 유출, 37분 뒤의 동결, 그리고 위임이 풀리기까지 3시간 49분.",
    note: "왼쪽 띠 색이 국면을 구분한다 — 준비(amber) → 유출(rose) → 동결(sky) → 출금 중단(zinc) → 위임 해제(emerald).",
    events: [
      { time: "10-28 07:39", title: "Tornado Cash로 공격 지갑 충전", body: "0.1 ETH 풀에서 세 차례 출금(마지막은 10-29 08:23).", phase: "prep" },
      { time: "10-29 02:28", title: "시험·리허설", body: "시험 컨트랙트 배포 → 시험 지갑 3개에 위임 리허설 → 15:59 최종 스위퍼 배포.", phase: "prep" },
      { time: "20:05", title: "XRP Ledger 유출 시작", body: "바이낸스 지갑 5개에서 2억 3,346만 XRP. 이어서 Solana·Optimism 등.", phase: "drain" },
      { time: "20:20:59", title: "Binance 14에 EIP-7702 위임", body: "권한 50개를 담은 트랜잭션 하나로 핫월렛을 스위퍼에 위임. 같은 시각 BTC 18,270개 유출.", phase: "drain" },
      { time: "20:24:23", title: "트랜잭션 한 번으로 이더리움 유출", body: "ETH 167,464개와 토큰 63종을 한 번에 쓸어 감.", phase: "drain" },
      { time: "21:01 · 21:04", title: "Tether·Circle 동결", body: "수령 주소를 블랙리스트에 등록. 그 사이 USDT 약 6억 4,400만 개가 빠져나감.", phase: "freeze" },
      { time: "22:15", title: "바이낸스 출금 중단", body: "출금은 멈췄지만 입금 모음 경로는 계속 장악된 지갑으로 자금을 보냄.", phase: "halt" },
      { time: "23:56:47", title: "마지막 스윕", body: "출금 중단 1시간 40분 뒤 들어온 입금 2,962 ETH까지 쓸어 감.", phase: "drain" },
      { time: "10-30 00:10:35", title: "바이낸스가 자기 키로 위임 해제", body: "위임 대상을 0x0으로 되돌림. 위임은 3시간 49분 동안 유지됐다.", phase: "revoke" },
    ] as Event[],
  },
  en: {
    caption:
      "Fig 1. Full incident timeline (UTC) — 36 hours of preparation, a 20-minute drain, freezes 37 minutes later, and 3 hours 49 minutes until the delegation was lifted.",
    note: "Left stripe color marks the phase — preparation (amber) → drain (rose) → freeze (sky) → withdrawal halt (zinc) → delegation revoked (emerald).",
    events: [
      { time: "10-28 07:39", title: "Attacker wallet funded via Tornado Cash", body: "Three withdrawals from the 0.1 ETH pool (the last at 10-29 08:23).", phase: "prep" },
      { time: "10-29 02:28", title: "Testing and rehearsal", body: "Test contract deployed → delegation rehearsed on three test wallets → final sweeper deployed at 15:59.", phase: "prep" },
      { time: "20:05", title: "XRP Ledger drain begins", body: "233.46 million XRP from five Binance wallets, followed by Solana, Optimism, and others.", phase: "drain" },
      { time: "20:20:59", title: "EIP-7702 delegation on Binance 14", body: "One transaction carrying 50 authorizations delegates the hot wallet to the sweeper. 18,270 BTC drained at the same time.", phase: "drain" },
      { time: "20:24:23", title: "Ethereum drained in one transaction", body: "167,464 ETH and 63 tokens swept at once.", phase: "drain" },
      { time: "21:01 · 21:04", title: "Tether and Circle freeze", body: "The receiving address is blacklisted — after about 644 million USDT had already left.", phase: "freeze" },
      { time: "22:15", title: "Binance halts withdrawals", body: "Withdrawals stop, but deposit consolidation keeps routing funds into the compromised wallet.", phase: "halt" },
      { time: "23:56:47", title: "Final sweep", body: "Sweeps even a 2,962 ETH deposit that arrived 1 hour 40 minutes after the halt.", phase: "drain" },
      { time: "10-30 00:10:35", title: "Binance revokes with its own key", body: "Delegation target reset to 0x0. The delegation had lasted 3 hours 49 minutes.", phase: "revoke" },
    ] as Event[],
  },
} as const;

const phaseStripe: Record<Phase, string> = {
  prep: "bg-amber-400 dark:bg-amber-600",
  drain: "bg-rose-500 dark:bg-rose-600",
  freeze: "bg-sky-500 dark:bg-sky-600",
  halt: "bg-zinc-500 dark:bg-zinc-400",
  revoke: "bg-emerald-500 dark:bg-emerald-600",
};

export function BinanceHackTimeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <ol className="relative space-y-3">
        {s.events.map((e) => (
          <li
            key={e.time}
            className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7.5rem_1fr] gap-3 items-stretch"
          >
            <div className="font-mono tabular-nums text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400 pt-2 text-right">
              {e.time}
            </div>
            <div className="flex gap-3">
              <div className={`w-1 shrink-0 rounded-full ${phaseStripe[e.phase]}`} />
              <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 flex-1">
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {e.title}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug mt-0.5">
                  {e.body}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
