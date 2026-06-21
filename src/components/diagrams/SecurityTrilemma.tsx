import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 1. 보안 트릴레마 — 기밀성·가용성·사용성은 서로 맞물려 있어 셋을 동시에 최대화할 수 없다. 휴대폰은 가용성·사용성을 택하는 대신 공격 표면(기밀성 리스크)을 넓힌 지점에 있다.",
    confLabel: "기밀성",
    confMeaning: "키가 절대 유출되지 않음",
    availLabel: "가용성",
    availMeaning: "필요할 때 항상 접근",
    usabLabel: "사용성",
    usabMeaning: "실수 없이 다룸",
    phone: "📱 휴대폰",
    phoneMeaning: "가용성·사용성 ↑ · 기밀성 ↓",
  },
  en: {
    caption:
      "Fig 1. The security trilemma — confidentiality, availability, and usability pull against one another, so you cannot maximize all three at once. A phone sits where availability and usability win, at the cost of a wider attack surface (a confidentiality risk).",
    confLabel: "Confidentiality",
    confMeaning: "keys never leak",
    availLabel: "Availability",
    availMeaning: "always accessible",
    usabLabel: "Usability",
    usabMeaning: "usable without slips",
    phone: "📱 Phone",
    phoneMeaning: "availability & usability ↑ · confidentiality ↓",
  },
} as const;

const W = 640;
const H = 450;
const C = { x: 320, y: 66 };
const A = { x: 112, y: 366 };
const U = { x: 528, y: 366 };

export function SecurityTrilemma({ locale = "ko" }: { locale?: Locale }) {
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
          <defs>
            <marker
              id="tri-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                className="fill-zinc-400 dark:fill-zinc-500"
              />
            </marker>
          </defs>

          {/* Triangle body */}
          <polygon
            points={`${C.x},${C.y} ${A.x},${A.y} ${U.x},${U.y}`}
            className="fill-zinc-100/70 dark:fill-zinc-800/40 stroke-none"
          />

          {/* Edges (double-headed trade-off arrows), drawn behind the vertex boxes */}
          <Edge from={C} to={A} />
          <Edge from={C} to={U} />
          <Edge from={A} to={U} />

          {/* Phone position marker (the trade-off a phone makes) */}
          <g>
            <rect
              x={320 - 108}
              y={300}
              width={216}
              height={46}
              rx={8}
              className="fill-amber-50 dark:fill-amber-950/60 stroke-amber-400 dark:stroke-amber-700"
              strokeWidth={1}
            />
            <text
              x={320}
              y={318}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              className="fill-amber-800 dark:fill-amber-200"
            >
              {s.phone}
            </text>
            <text
              x={320}
              y={334}
              textAnchor="middle"
              fontSize={10}
              className="fill-amber-700 dark:fill-amber-300"
            >
              {s.phoneMeaning}
            </text>
          </g>

          {/* Vertices */}
          <Vertex cx={C.x} cy={C.y} label={s.confLabel} meaning={s.confMeaning} />
          <Vertex cx={A.x} cy={A.y} label={s.availLabel} meaning={s.availMeaning} />
          <Vertex cx={U.x} cy={U.y} label={s.usabLabel} meaning={s.usabMeaning} />
        </svg>
      </div>
    </Figure>
  );
}

function Edge({
  from,
  to,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  return (
    <line
      x1={from.x}
      x2={to.x}
      y1={from.y}
      y2={to.y}
      className="stroke-zinc-400 dark:stroke-zinc-500"
      strokeWidth={1.5}
      markerStart="url(#tri-arrow)"
      markerEnd="url(#tri-arrow)"
    />
  );
}

function Vertex({
  cx,
  cy,
  label,
  meaning,
}: {
  cx: number;
  cy: number;
  label: string;
  meaning: string;
}) {
  const w = 188;
  const h = 58;
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={8}
        className="fill-white dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-700"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        className="fill-zinc-900 dark:fill-zinc-100"
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        fontSize={11}
        className="fill-zinc-500 dark:fill-zinc-400"
      >
        {meaning}
      </text>
    </g>
  );
}
