import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 1. Diffie-Hellman 키 교환 — Alice와 Bob 두 액터 사이의 메시지 시퀀스. Eve는 와이어를 도청해도 g, p, A, B만 본다.",
    actorAlice: "Alice",
    actorBob: "Bob",
    publicParams: "공개 파라미터  g, p",
    pick: "비밀 선택",
    compute: "공개값 계산",
    derive: "공유키 도출",
    shared: "공유키",
    eveTitle: "Eve가 도청해서 보는 것",
    eveBody:
      "g, p, A, B  ✓     a, b, K  ✗   —  K를 얻으려면 결국 DLP를 풀어야 함",
  },
  en: {
    caption:
      "Fig 1. Diffie-Hellman key exchange — message sequence between Alice and Bob. Even if Eve taps the wire she only sees g, p, A, B.",
    actorAlice: "Alice",
    actorBob: "Bob",
    publicParams: "Public parameters  g, p",
    pick: "Pick secret",
    compute: "Compute public value",
    derive: "Derive shared key",
    shared: "Shared key",
    eveTitle: "What Eve sees on the wire",
    eveBody:
      "g, p, A, B  ✓     a, b, K  ✗   —  Recovering K still means solving the DLP",
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
  pickBottom: 165,
  arrowA: 215,
  arrowB: 265,
  deriveTop: 305,
  deriveBottom: 360,
  shared: 425,
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
            x={(W - 320) / 2}
            y={Y.params - 22}
            width={320}
            height={36}
            rx={6}
            className="fill-white dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-700"
          />
          <text
            x={W / 2}
            y={Y.params + 2}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            className="fill-zinc-900 dark:fill-zinc-100"
          >
            {s.publicParams}
          </text>

          {/* Actor boxes */}
          <Actor x={ALICE_X} label={s.actorAlice} />
          <Actor x={BOB_X} label={s.actorBob} />

          {/* Lifelines */}
          <Lifeline x={ALICE_X} />
          <Lifeline x={BOB_X} />

          {/* Activation boxes for "pick + compute" */}
          <Activation
            x={ALICE_X}
            top={Y.pickTop}
            bottom={Y.pickBottom}
            lines={[`a ← random`, `A = g^a mod p`]}
            sideLabel={s.pick + " · " + s.compute}
            side="right"
          />
          <Activation
            x={BOB_X}
            top={Y.pickTop}
            bottom={Y.pickBottom}
            lines={[`b ← random`, `B = g^b mod p`]}
            sideLabel={s.pick + " · " + s.compute}
            side="left"
          />

          {/* Message: A → */}
          <Message
            from={ALICE_X}
            to={BOB_X}
            y={Y.arrowA}
            label="A = g^a mod p"
          />
          {/* Message: ← B */}
          <Message
            from={BOB_X}
            to={ALICE_X}
            y={Y.arrowB}
            label="B = g^b mod p"
          />

          {/* Activation: derive K */}
          <Activation
            x={ALICE_X}
            top={Y.deriveTop}
            bottom={Y.deriveBottom}
            lines={["K = B^a mod p"]}
            sideLabel={s.derive}
            side="right"
          />
          <Activation
            x={BOB_X}
            top={Y.deriveTop}
            bottom={Y.deriveBottom}
            lines={["K = A^b mod p"]}
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
            x={(W - 280) / 2}
            y={Y.shared - 18}
            width={280}
            height={36}
            rx={6}
            className="fill-zinc-900 dark:fill-zinc-100"
          />
          <text
            x={W / 2}
            y={Y.shared + 6}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            className="fill-zinc-50 dark:fill-zinc-900"
          >
            {s.shared}  K = g^(ab) mod p
          </text>
        </svg>
      </div>

      {/* Eve callout (HTML, outside SVG so it's readable) */}
      <div className="mt-5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {s.eveTitle}
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 font-mono">
          {s.eveBody}
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
  lines: string[];
  sideLabel: string;
  side: "left" | "right";
}) {
  const textX = side === "right" ? x + ACT_W / 2 + 10 : x - ACT_W / 2 - 10;
  const anchor = side === "right" ? "start" : "end";
  const lineHeight = 16;
  const textStartY = top + 16;
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
      {lines.map((ln, i) => (
        <text
          key={i}
          x={textX}
          y={textStartY + i * lineHeight}
          textAnchor={anchor}
          fontSize={12}
          fontFamily="ui-monospace, SF Mono, Menlo, monospace"
          className="fill-zinc-900 dark:fill-zinc-100"
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

function Message({
  from,
  to,
  y,
  label,
}: {
  from: number;
  to: number;
  y: number;
  label: string;
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
        x={midX - 80}
        y={y - 14}
        width={160}
        height={20}
        rx={4}
        className="fill-zinc-50 dark:fill-zinc-900"
      />
      <text
        x={midX}
        y={y}
        textAnchor="middle"
        fontSize={12}
        fontFamily="ui-monospace, SF Mono, Menlo, monospace"
        fontWeight={600}
        className="fill-zinc-900 dark:fill-zinc-100"
      >
        {label}
      </text>
    </g>
  );
}
