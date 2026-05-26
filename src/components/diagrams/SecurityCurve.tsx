import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 8. 키 크기 vs 보안 강도 — 같은 X(키 비트)에서 ECDH의 Y(보안 비트)는 FFDH보다 훨씬 가파르게 오른다. 가로 점선은 ‘128-bit 보안' 임계.",
    xLabel: "키 크기 (bit, log scale)",
    yLabel: "보안 강도 (bit)",
    legendFFDH: "FFDH (NFS-DLP)",
    legendECDH: "ECDH (Pollard's rho)",
    legendThresh: "128-bit 보안 임계",
    note: "ECDH 256-bit ≈ FFDH 3072-bit (그래프상 같은 가로선 위에 위치). FFDH 곡선이 완만한 이유는 sub-exponential 공격 때문.",
  },
  en: {
    caption:
      "Fig 8. Key size vs security strength — at the same X (key bits), ECDH's Y (security bits) climbs far steeper than FFDH. The horizontal dashed line marks the 128-bit security threshold.",
    xLabel: "Key size (bit, log scale)",
    yLabel: "Security strength (bit)",
    legendFFDH: "FFDH (NFS-DLP)",
    legendECDH: "ECDH (Pollard's rho)",
    legendThresh: "128-bit secure threshold",
    note: "ECDH 256-bit ≈ FFDH 3072-bit (both sit on the same horizontal). FFDH's flatter curve reflects the sub-exponential attack.",
  },
} as const;

// Plot domain — key size on a log scale (bits)
const X_MIN_BITS = 128;
const X_MAX_BITS = 4096;
const Y_MAX = 260;
const THRESHOLD = 128;

const ECDH_POINTS = [
  { key: 192, sec: 96 },
  { key: 224, sec: 112 },
  { key: 256, sec: 128 },
  { key: 384, sec: 192 },
  { key: 521, sec: 256 },
];

const FFDH_POINTS = [
  { key: 1024, sec: 80 },
  { key: 2048, sec: 112 },
  { key: 3072, sec: 128 },
  { key: 4096, sec: 144 },
];

const W = 720;
const H = 320;
const PAD = { top: 16, right: 24, bottom: 40, left: 44 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const xScale = (bits: number) =>
  PAD.left +
  ((Math.log2(bits) - Math.log2(X_MIN_BITS)) /
    (Math.log2(X_MAX_BITS) - Math.log2(X_MIN_BITS))) *
    PLOT_W;

const yScale = (sec: number) => PAD.top + (1 - sec / Y_MAX) * PLOT_H;

function pathFor(points: { key: number; sec: number }[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.key)},${yScale(p.sec)}`)
    .join(" ");
}

const X_TICKS = [128, 256, 512, 1024, 2048, 4096];
const Y_TICKS = [0, 64, 128, 192, 256];

export function SecurityCurve({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const threshY = yScale(THRESHOLD);
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

          {/* X ticks */}
          {X_TICKS.map((x) => (
            <g key={x}>
              <line
                x1={xScale(x)}
                x2={xScale(x)}
                y1={H - PAD.bottom}
                y2={H - PAD.bottom + 4}
                className="stroke-zinc-400 dark:stroke-zinc-600"
                strokeWidth={1}
              />
              <text
                x={xScale(x)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                className="fill-zinc-500 dark:fill-zinc-400"
                fontSize={11}
              >
                {x}
              </text>
            </g>
          ))}

          {/* 128-bit threshold */}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={threshY}
            y2={threshY}
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text
            x={W - PAD.right - 6}
            y={threshY - 6}
            textAnchor="end"
            className="fill-zinc-700 dark:fill-zinc-300"
            fontSize={10}
            fontWeight="600"
          >
            {s.legendThresh}
          </text>

          {/* FFDH curve */}
          <path
            d={pathFor(FFDH_POINTS)}
            fill="none"
            className="stroke-zinc-500 dark:stroke-zinc-400"
            strokeWidth={2}
            strokeDasharray="6 3"
          />
          {FFDH_POINTS.map((p) => (
            <circle
              key={`ffdh-${p.key}`}
              cx={xScale(p.key)}
              cy={yScale(p.sec)}
              r={3}
              className="fill-zinc-500 dark:fill-zinc-400"
            />
          ))}

          {/* ECDH curve */}
          <path
            d={pathFor(ECDH_POINTS)}
            fill="none"
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth={2}
          />
          {ECDH_POINTS.map((p) => (
            <circle
              key={`ecdh-${p.key}`}
              cx={xScale(p.key)}
              cy={yScale(p.sec)}
              r={3.5}
              className="fill-zinc-900 dark:fill-zinc-100"
            />
          ))}

          {/* Axis labels */}
          <text
            x={PAD.left + PLOT_W / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-zinc-700 dark:fill-zinc-300"
            fontSize={11}
            fontWeight="600"
          >
            {s.xLabel}
          </text>
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
          <span>{s.legendECDH}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-6 h-0.5 bg-zinc-500 dark:bg-zinc-400"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px)",
            }}
          />
          <span>{s.legendFFDH}</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}
