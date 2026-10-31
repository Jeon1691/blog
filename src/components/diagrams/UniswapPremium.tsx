import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 5. Uniswap v3 WETH/USDT 0.05% 풀 가격(UTC) — 공격자가 동결 전에 USDT를 서둘러 ETH로 바꾸면서 풀 가격이 해킹 전보다 최대 43% 높아졌다. 21:09:11 정점(3,328.6)은 HOW TO ONCHAIN이 보고한 '21:09, 시장가 대비 38% 할증'과 시각이 일치한다.",
    yLabel: "WETH 가격 (USDT)",
    baseline: "해킹 전 ≈ 2,320",
    peak: "정점 3,328.6",
    freeze: "Tether 동결",
    delegate: "위임",
    note: "슬롯0(sqrtPriceX96)을 블록별로 조회한 값. 5분 간격 샘플에 블록 단위로 찾은 정점 두 곳(20:49:23, 21:09:11)을 더했다.",
  },
  en: {
    caption:
      "Fig 5. Uniswap v3 WETH/USDT 0.05% pool price (UTC) — as the attacker rushed to swap USDT for ETH before the freezes, the pool price rose up to 43% above its pre-hack level. The 21:09:11 peak (3,328.6) matches, to the minute, HOW TO ONCHAIN's report of 'a 38% premium over market at 21:09.'",
    yLabel: "WETH price (USDT)",
    baseline: "pre-hack ≈ 2,320",
    peak: "peak 3,328.6",
    freeze: "Tether freeze",
    delegate: "delegation",
    note: "Values read from slot0 (sqrtPriceX96) block by block: 5-minute samples plus two peaks located at block resolution (20:49:23, 21:09:11).",
  },
} as const;

// Minutes after 20:00 UTC → pool price in USDT, read on-chain from slot0.
const SERIES: [number, number][] = [
  [21.0, 2318.7], [26.0, 2316.1], [31.0, 2316.8], [36.0, 2325.5],
  [41.0, 2589.0], [46.0, 2782.8], [49.4, 2916.6], [51.2, 2838.2],
  [56.4, 2758.2], [61.4, 2674.4], [66.4, 2826.1], [69.2, 3328.6],
  [71.4, 2977.9], [76.4, 2738.6], [81.4, 2598.9], [86.4, 2487.8],
  [91.4, 2411.1], [96.4, 2320.6], [101.4, 2285.5], [106.4, 2290.3],
  [111.4, 2328.8], [116.4, 2293.6], [121.4, 2304.5], [126.4, 2293.9],
  [131.4, 2296.1], [136.4, 2280.4], [141.4, 2278.9],
];

const BASELINE = 2320;
const PEAK_IDX = 11;
const DELEGATE_MIN = 21.0; // 20:20:59 delegation
const FREEZE_MIN = 61.6; // 21:01:35 Tether blacklist

const X_MIN = 20;
const X_MAX = 145;
const X_TICKS = [30, 60, 90, 120];
const Y_MIN = 2200;
const Y_MAX = 3400;
const Y_TICKS = [2400, 2800, 3200];

const W = 720;
const H = 320;
const PAD = { top: 22, right: 24, bottom: 36, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const xScale = (m: number) => PAD.left + ((m - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const yScale = (v: number) => PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
const clock = (m: number) => `${20 + Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

const linePath = SERIES.map(([m, v], i) => `${i === 0 ? "M" : "L"}${xScale(m)},${yScale(v)}`).join(" ");

export function UniswapPremium({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const [peakM, peakV] = SERIES[PEAK_IDX];
  return (
    <Figure caption={s.caption}>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={s.caption}>
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} className="stroke-zinc-400 dark:stroke-zinc-600" strokeWidth={1} />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} className="stroke-zinc-400 dark:stroke-zinc-600" strokeWidth={1} />

          {Y_TICKS.map((y) => (
            <g key={y}>
              <line x1={PAD.left} x2={W - PAD.right} y1={yScale(y)} y2={yScale(y)} className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth={1} />
              <text x={PAD.left - 8} y={yScale(y) + 4} textAnchor="end" className="fill-zinc-500 dark:fill-zinc-400" fontSize={11}>
                {y.toLocaleString("en-US")}
              </text>
            </g>
          ))}

          {X_TICKS.map((m) => (
            <g key={m}>
              <line x1={xScale(m)} x2={xScale(m)} y1={H - PAD.bottom} y2={H - PAD.bottom + 4} className="stroke-zinc-400 dark:stroke-zinc-600" strokeWidth={1} />
              <text x={xScale(m)} y={H - PAD.bottom + 17} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize={11}>
                {clock(m)}
              </text>
            </g>
          ))}

          {/* Pre-hack baseline */}
          <line x1={PAD.left} x2={W - PAD.right} y1={yScale(BASELINE)} y2={yScale(BASELINE)} className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth={1} strokeDasharray="5 4" />
          <text x={xScale(DELEGATE_MIN) + 6} y={yScale(BASELINE) + 14} textAnchor="start" className="fill-emerald-700 dark:fill-emerald-300" fontSize={10}>
            {s.baseline}
          </text>

          {/* Event markers */}
          {[
            { m: DELEGATE_MIN, label: s.delegate, side: "right" as const },
            { m: FREEZE_MIN, label: s.freeze, side: "left" as const },
          ].map((e) => (
            <g key={e.label}>
              <line x1={xScale(e.m)} x2={xScale(e.m)} y1={PAD.top} y2={H - PAD.bottom} className="stroke-rose-400 dark:stroke-rose-600" strokeWidth={1} strokeDasharray="3 3" />
              <text
                x={xScale(e.m) + (e.side === "right" ? 5 : -5)}
                y={PAD.top + 10}
                textAnchor={e.side === "right" ? "start" : "end"}
                className="fill-rose-600 dark:fill-rose-400"
                fontSize={10}
                fontWeight="600"
              >
                {e.label}
              </text>
            </g>
          ))}

          {/* Premium area above the baseline */}
          <path
            d={`${linePath} L${xScale(SERIES[SERIES.length - 1][0])},${yScale(BASELINE)} L${xScale(SERIES[0][0])},${yScale(BASELINE)} Z`}
            className="fill-rose-200/40 dark:fill-rose-900/30"
          />
          <path d={linePath} fill="none" className="stroke-zinc-900 dark:stroke-zinc-100" strokeWidth={2} />
          {SERIES.map(([m, v]) => (
            <circle key={m} cx={xScale(m)} cy={yScale(v)} r={2.5} className="fill-zinc-900 dark:fill-zinc-100" />
          ))}

          <circle cx={xScale(peakM)} cy={yScale(peakV)} r={5} className="fill-rose-500 dark:fill-rose-400" />
          <text x={xScale(peakM) + 9} y={yScale(peakV) + 4} className="fill-rose-700 dark:fill-rose-300" fontSize={11} fontWeight="700">
            {s.peak} · 21:09:11
          </text>

          <text x={-PAD.top - PLOT_H / 2} y={14} textAnchor="middle" transform="rotate(-90)" className="fill-zinc-700 dark:fill-zinc-300" fontSize={11} fontWeight="600">
            {s.yLabel}
          </text>
        </svg>
      </div>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">{s.note}</p>
    </Figure>
  );
}
