import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 1. Diffie-Hellman 키 교환 — Alice와 Bob 두 액터 사이의 메시지 시퀀스. Eve는 와이어를 도청해도 g, p, A, B만 본다.",
    actorAlice: "Alice",
    actorBob: "Bob",
    publicParamsPrefix: "공개 파라미터",
    pick: "비밀 선택",
    compute: "공개값 계산",
    derive: "공유키 도출",
    sharedPrefix: "공유키",
    eveTitle: "Eve가 도청해서 보는 것",
    eveSee: "본다",
    eveMissing: "못 봄",
    eveTail: "K를 얻으려면 결국 DLP를 풀어야 함",
  },
  en: {
    caption:
      "Fig 1. Diffie-Hellman key exchange — message sequence between Alice and Bob. Even if Eve taps the wire she only sees g, p, A, B.",
    actorAlice: "Alice",
    actorBob: "Bob",
    publicParamsPrefix: "Public parameters",
    pick: "Pick secret",
    compute: "Compute public value",
    derive: "Derive shared key",
    sharedPrefix: "Shared key",
    eveTitle: "What Eve sees on the wire",
    eveSee: "sees",
    eveMissing: "never sees",
    eveTail: "Recovering K still requires solving the DLP",
  },
} as const;

const W = 760;
const H = 560;
const ALICE_X = 200;
const BOB_X = 560;
const LIFE_TOP = 90;
const LIFE_BOTTOM = 480;
const ACT_W = 14;

const Y = {
  params: 50,
  pickTop: 110,
  pickBottom: 170,
  arrowA: 220,
  arrowB: 275,
  deriveTop: 315,
  deriveBottom: 370,
  shared: 435,
};

const MATH_FONT = "'Times New Roman', 'Computer Modern', serif";

type MathBit =
  | { v: string; italic?: boolean }
  | { sup: string };

// One stylized math expression rendered with SVG tspans.
// Variables use italic serif; "mod" and operators stay upright.
function MathTSpans({ bits }: { bits: MathBit[] }) {
  return (
    <>
      {bits.map((b, i) => {
        if ("sup" in b) {
          return (
            <tspan
              key={i}
              dy="-6"
              fontSize="0.7em"
              fontStyle="italic"
              fontFamily={MATH_FONT}
            >
              {b.sup}
              <tspan dy="6" />
            </tspan>
          );
        }
        return (
          <tspan
            key={i}
            fontStyle={b.italic ? "italic" : "normal"}
            fontFamily={MATH_FONT}
          >
            {b.v}
          </tspan>
        );
      })}
    </>
  );
}

// Common DH expressions, pre-built so we don't repeat the bit array.
const M = {
  publicParams: (): MathBit[] => [
    { v: "g", italic: true },
    { v: ", " },
    { v: "p", italic: true },
  ],
  aRand: (): MathBit[] => [
    { v: "a", italic: true },
    { v: " ← random" },
  ],
  bRand: (): MathBit[] => [
    { v: "b", italic: true },
    { v: " ← random" },
  ],
  A_eq: (): MathBit[] => [
    { v: "A", italic: true },
    { v: " = " },
    { v: "g", italic: true },
    { sup: "a" },
    { v: "  mod " },
    { v: "p", italic: true },
  ],
  B_eq: (): MathBit[] => [
    { v: "B", italic: true },
    { v: " = " },
    { v: "g", italic: true },
    { sup: "b" },
    { v: "  mod " },
    { v: "p", italic: true },
  ],
  K_fromB: (): MathBit[] => [
    { v: "K", italic: true },
    { v: " = " },
    { v: "B", italic: true },
    { sup: "a" },
    { v: "  mod " },
    { v: "p", italic: true },
  ],
  K_fromA: (): MathBit[] => [
    { v: "K", italic: true },
    { v: " = " },
    { v: "A", italic: true },
    { sup: "b" },
    { v: "  mod " },
    { v: "p", italic: true },
  ],
  K_shared: (): MathBit[] => [
    { v: "K", italic: true },
    { v: " = " },
    { v: "g", italic: true },
    { sup: "ab" },
    { v: "  mod " },
    { v: "p", italic: true },
  ],
};

export function DHKeyExchange({ locale = "ko" }: { locale?: Locale }) {
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
              id="dh-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                className="fill-zinc-900 dark:fill-zinc-100"
              />
            </marker>
          </defs>

          {/* Public parameters bar */}
          <rect
            x={(W - 360) / 2}
            y={Y.params - 22}
            width={360}
            height={36}
            rx={6}
            className="fill-white dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-700"
          />
          <text
            x={W / 2}
            y={Y.params + 4}
            textAnchor="middle"
            fontSize={14}
            className="fill-zinc-900 dark:fill-zinc-100"
          >
            <tspan fontWeight={600}>{s.publicParamsPrefix}  </tspan>
            <MathTSpans bits={M.publicParams()} />
          </text>

          {/* Actor boxes + lifelines */}
          <Actor x={ALICE_X} label={s.actorAlice} />
          <Actor x={BOB_X} label={s.actorBob} />
          <Lifeline x={ALICE_X} />
          <Lifeline x={BOB_X} />

          {/* Activation 1: pick + compute */}
          <Activation
            x={ALICE_X}
            top={Y.pickTop}
            bottom={Y.pickBottom}
            lines={[M.aRand(), M.A_eq()]}
            sideLabel={`${s.pick} · ${s.compute}`}
            side="right"
          />
          <Activation
            x={BOB_X}
            top={Y.pickTop}
            bottom={Y.pickBottom}
            lines={[M.bRand(), M.B_eq()]}
            sideLabel={`${s.pick} · ${s.compute}`}
            side="left"
          />

          {/* Messages */}
          <Message from={ALICE_X} to={BOB_X} y={Y.arrowA} bits={M.A_eq()} />
          <Message from={BOB_X} to={ALICE_X} y={Y.arrowB} bits={M.B_eq()} />

          {/* Activation 2: derive K */}
          <Activation
            x={ALICE_X}
            top={Y.deriveTop}
            bottom={Y.deriveBottom}
            lines={[M.K_fromB()]}
            sideLabel={s.derive}
            side="right"
          />
          <Activation
            x={BOB_X}
            top={Y.deriveTop}
            bottom={Y.deriveBottom}
            lines={[M.K_fromA()]}
            sideLabel={s.derive}
            side="left"
          />

          {/* Shared key bar */}
          <line
            x1={ALICE_X}
            x2={BOB_X}
            y1={Y.shared}
            y2={Y.shared}
            className="stroke-zinc-900 dark:stroke-zinc-100"
            strokeWidth={2}
          />
          <rect
            x={(W - 340) / 2}
            y={Y.shared - 20}
            width={340}
            height={40}
            rx={6}
            className="fill-zinc-900 dark:fill-zinc-100"
          />
          <text
            x={W / 2}
            y={Y.shared + 6}
            textAnchor="middle"
            fontSize={15}
            className="fill-zinc-50 dark:fill-zinc-900"
          >
            <tspan fontWeight={700}>{s.sharedPrefix}  </tspan>
            <MathTSpans bits={M.K_shared()} />
          </text>
        </svg>
      </div>

      {/* Eve callout — outside SVG so it stays readable */}
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {s.eveTitle}
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              ✓
            </span>{" "}
            <span className="italic" style={{ fontFamily: MATH_FONT }}>
              g, p, A, B
            </span>{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              ({s.eveSee})
            </span>
          </span>
          <span>
            <span className="font-bold text-rose-700 dark:text-rose-400">✗</span>{" "}
            <span className="italic" style={{ fontFamily: MATH_FONT }}>
              a, b, K
            </span>{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              ({s.eveMissing})
            </span>
          </span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 italic">
          {s.eveTail}
        </div>
      </div>
    </Figure>
  );
}

function Actor({ x, label }: { x: number; label: string }) {
  const w = 120;
  const h = 38;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={8}
        width={w}
        height={h}
        rx={6}
        className="fill-zinc-900 dark:fill-zinc-100"
      />
      <text
        x={x}
        y={32}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        className="fill-zinc-50 dark:fill-zinc-900"
      >
        {label}
      </text>
    </g>
  );
}

function Lifeline({ x }: { x: number }) {
  return (
    <line
      x1={x}
      x2={x}
      y1={LIFE_TOP}
      y2={LIFE_BOTTOM}
      className="stroke-zinc-400 dark:stroke-zinc-600"
      strokeWidth={1}
      strokeDasharray="4 4"
    />
  );
}

function Activation({
  x,
  top,
  bottom,
  lines,
  sideLabel,
  side,
}: {
  x: number;
  top: number;
  bottom: number;
  lines: MathBit[][];
  sideLabel: string;
  side: "left" | "right";
}) {
  const textX = side === "right" ? x + ACT_W / 2 + 10 : x - ACT_W / 2 - 10;
  const anchor = side === "right" ? "start" : "end";
  const lineHeight = 18;
  const textStartY = top + 18;
  return (
    <g>
      <rect
        x={x - ACT_W / 2}
        y={top}
        width={ACT_W}
        height={bottom - top}
        rx={2}
        className="fill-white dark:fill-zinc-950 stroke-zinc-700 dark:stroke-zinc-300"
        strokeWidth={1.5}
      />
      <text
        x={textX}
        y={top - 4}
        textAnchor={anchor}
        fontSize={10}
        className="fill-zinc-500 dark:fill-zinc-400"
      >
        {sideLabel}
      </text>
      {lines.map((bits, i) => (
        <text
          key={i}
          x={textX}
          y={textStartY + i * lineHeight}
          textAnchor={anchor}
          fontSize={13}
          className="fill-zinc-900 dark:fill-zinc-100"
        >
          <MathTSpans bits={bits} />
        </text>
      ))}
    </g>
  );
}

function Message({
  from,
  to,
  y,
  bits,
}: {
  from: number;
  to: number;
  y: number;
  bits: MathBit[];
}) {
  const midX = (from + to) / 2;
  return (
    <g>
      <line
        x1={from}
        x2={to}
        y1={y}
        y2={y}
        className="stroke-zinc-900 dark:stroke-zinc-100"
        strokeWidth={2}
        markerEnd="url(#dh-arrow)"
      />
      <rect
        x={midX - 90}
        y={y - 14}
        width={180}
        height={22}
        rx={4}
        className="fill-zinc-50 dark:fill-zinc-900"
      />
      <text
        x={midX}
        y={y + 1}
        textAnchor="middle"
        fontSize={13}
        className="fill-zinc-900 dark:fill-zinc-100"
      >
        <MathTSpans bits={bits} />
      </text>
    </g>
  );
}
