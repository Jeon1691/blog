import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 1. ZEC/USD 일주일 등락 (2026-06-03 ~ 06-09) — 윗선은 스냅샷·고가권 출처(블루밍비트·news.bitcoin), 아랫선은 급락 저점 출처(BitMEX·DigitalCoinPrice). 급락 전까지 겹치다가 6/5 저점에서 출처별로 갈린 뒤 반등하며 수렴.",
    yLabel: "가격 (USD)",
    legendHigh: "고가권·스냅샷 출처",
    legendLow: "급락 저점 출처",
    crashTag: "공개 후 급락",
    note: "실측 앵커: 6/4 고점 624, 6/5 저점 309·스냅샷 409, 6/8 ≈ 월간 −30% 437, 6/9 448~478. 6/3·6/6·6/7은 추세 보간값.",
    points: [
      { x: "6/3", tag: "" },
      { x: "6/4", tag: "피크" },
      { x: "6/5", tag: "급락" },
      { x: "6/6", tag: "" },
      { x: "6/7", tag: "" },
      { x: "6/8", tag: "" },
      { x: "6/9", tag: "반등" },
    ],
  },
  en: {
    caption:
      "Fig 1. ZEC/USD over one week (2026-06-03 to 06-09) — the upper line tracks snapshot/high-range sources (Bloomingbit, news.bitcoin), the lower line tracks crash-low sources (BitMEX, DigitalCoinPrice). They overlap until the 6/5 trough splits them by source, then reconverge on the bounce.",
    yLabel: "Price (USD)",
    legendHigh: "High-range / snapshot sources",
    legendLow: "Crash-low sources",
    crashTag: "crash on disclosure",
    note: "Measured anchors: 6/4 high 624, 6/5 low 309 / snapshot 409, 6/8 ≈ month −30% 437, 6/9 448–478. 6/3, 6/6, 6/7 are interpolated trend values.",
    points: [
      { x: "6/3", tag: "" },
      { x: "6/4", tag: "peak" },
      { x: "6/5", tag: "crash" },
      { x: "6/6", tag: "" },
      { x: "6/7", tag: "" },
      { x: "6/8", tag: "" },
      { x: "6/9", tag: "bounce" },
    ],
  },
} as const;

const HIGH = [605, 624, 409, 420, 440, 450, 478];
const LOW = [605, 624, 309, 350, 395, 437, 448];

const Y_MIN = 250;
const Y_MAX = 650;
const Y_TICKS = [300, 400, 500, 600];
const CRASH_IDX = 2; // 6/5

const W = 720;
const H = 320;
const PAD = { top: 18, right: 24, bottom: 42, left: 48 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const xScale = (i: number) => PAD.left + (i / (HIGH.length - 1)) * PLOT_W;
const yScale = (v: number) =>
  PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;

const pathFor = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(v)}`).join(" ");

const areaBetween = () => {
  const top = HIGH.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(v)}`);
  const bottom = [...LOW]
    .map((v, i) => ({ v, i }))
    .reverse()
    .map(({ v, i }) => `L${xScale(i)},${yScale(v)}`);
  return `${top.join(" ")} ${bottom.join(" ")} Z`;
};

export function ZecPriceReaction({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label={s.caption}
        >
          {/* Axes */}
          <line
            x1={PAD.left}
            y1={PAD.top}
            x2={PAD.left}
            y2={H - PAD.bottom}
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth={1}
          />
          <line
            x1={PAD.left}
            y1={H - PAD.bottom}
            x2={W - PAD.right}
            y2={H - PAD.bottom}
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth={1}
          />

          {/* Y gridlines + ticks */}
          {Y_TICKS.map((y) => (
            <g key={y}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yScale(y)}
                y2={yScale(y)}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={yScale(y) + 4}
                textAnchor="end"
                className="fill-zinc-500 dark:fill-zinc-400"
                fontSize={11}
              >
                {y}
              </text>
            </g>
          ))}

          {/* X labels + tags */}
          {s.points.map((p, i) => (
            <g key={p.x}>
              <line
                x1={xScale(i)}
                x2={xScale(i)}
                y1={H - PAD.bottom}
                y2={H - PAD.bottom + 4}
                className="stroke-zinc-400 dark:stroke-zinc-600"
                strokeWidth={1}
              />
              <text
                x={xScale(i)}
                y={H - PAD.bottom + 17}
                textAnchor="middle"
                className="fill-zinc-500 dark:fill-zinc-400"
                fontSize={11}
              >
                {p.x}
              </text>
              {p.tag && (
                <text
                  x={xScale(i)}
                  y={H - PAD.bottom + 30}
                  textAnchor="middle"
                  className="fill-zinc-400 dark:fill-zinc-500"
                  fontSize={9}
                >
                  {p.tag}
                </text>
              )}
            </g>
          ))}

          {/* Crash marker */}
          <line
            x1={xScale(CRASH_IDX)}
            x2={xScale(CRASH_IDX)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            className="stroke-rose-400 dark:stroke-rose-600"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={xScale(CRASH_IDX) + 6}
            y={PAD.top + 12}
            textAnchor="start"
            className="fill-rose-600 dark:fill-rose-400"
            fontSize={10}
            fontWeight="600"
          >
            ↓ {s.crashTag}
          </text>

          {/* Spread band between the two source lines */}
          <path
            d={areaBetween()}
            className="fill-rose-200/40 dark:fill-rose-900/30"
          />

          {/* High line */}
          <path
            d={pathFor(HIGH)}
            fill="none"
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth={2}
          />
          {HIGH.map((v, i) => (
            <circle
              key={`h-${i}`}
              cx={xScale(i)}
              cy={yScale(v)}
              r={3}
              className="fill-zinc-900 dark:fill-zinc-100"
            />
          ))}

          {/* Low line */}
          <path
            d={pathFor(LOW)}
            fill="none"
            className="stroke-rose-500 dark:stroke-rose-400"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
          {LOW.map((v, i) => (
            <circle
              key={`l-${i}`}
              cx={xScale(i)}
              cy={yScale(v)}
              r={3}
              className="fill-rose-500 dark:fill-rose-400"
            />
          ))}

          {/* Y axis label */}
          <text
            x={-PAD.top - PLOT_H / 2}
            y={14}
            textAnchor="middle"
            transform="rotate(-90)"
            className="fill-zinc-700 dark:fill-zinc-300"
            fontSize={11}
            fontWeight="600"
          >
            {s.yLabel}
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
          <span>{s.legendHigh}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-6 h-0.5 bg-rose-500 dark:bg-rose-400"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 6px, transparent 6px 9px)",
            }}
          />
          <span>{s.legendLow}</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
