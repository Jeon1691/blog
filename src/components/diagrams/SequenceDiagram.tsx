import { Figure } from "./Figure";

type Tone = "neutral" | "danger" | "safe" | "warn";

export type SeqActor = {
  id: string;
  label: string;
  sub?: string;
  tone?: Tone;
};

export type SeqEvent =
  | { kind: "msg"; from: string; to: string; label: string; dashed?: boolean }
  | { kind: "note"; from: string; to: string; label: string; tone?: Tone };

const GAP = 156;
const PAD_X = 82;
const ACTOR_TOP = 6;
const ACTOR_H = 44;
const ACTOR_W = 130;
const LIFE_TOP = ACTOR_TOP + ACTOR_H + 8;
const EVENT_TOP = 98;
const ROW_H = 54;
const LINE_H = 13;

const WIDE = 12.6;
const NARROW = 6.9;

function isWide(ch: string) {
  return ch.charCodeAt(0) > 0x2e80;
}
function lineWidth(str: string) {
  let w = 0;
  for (const ch of str) w += isWide(ch) ? WIDE : NARROW;
  return w;
}
function wrapLabel(label: string, max: number): string[] {
  if (lineWidth(label) <= max) return [label];
  const paren = label.indexOf("(");
  if (paren > 2 && lineWidth(label.slice(0, paren)) <= max) {
    return [label.slice(0, paren).trim(), label.slice(paren).trim()];
  }
  const spaces: number[] = [];
  for (let i = 0; i < label.length; i++) if (label[i] === " ") spaces.push(i);
  if (spaces.length === 0) return [label];
  const mid = label.length / 2;
  let best = spaces[0];
  for (const sp of spaces)
    if (Math.abs(sp - mid) < Math.abs(best - mid)) best = sp;
  return [label.slice(0, best).trim(), label.slice(best + 1).trim()];
}
function maxWidth(lines: string[]) {
  return lines.reduce((m, l) => Math.max(m, lineWidth(l)), 0);
}

function actorClasses(tone: Tone = "neutral") {
  switch (tone) {
    case "danger":
      return {
        box: "fill-rose-600 dark:fill-rose-700",
        text: "fill-rose-50",
        sub: "fill-rose-100",
      };
    case "safe":
      return {
        box: "fill-emerald-600 dark:fill-emerald-700",
        text: "fill-emerald-50",
        sub: "fill-emerald-100",
      };
    case "warn":
      return {
        box: "fill-amber-500 dark:fill-amber-600",
        text: "fill-amber-50",
        sub: "fill-amber-100",
      };
    default:
      return {
        box: "fill-zinc-800 dark:fill-zinc-200",
        text: "fill-zinc-50 dark:fill-zinc-900",
        sub: "fill-zinc-400 dark:fill-zinc-600",
      };
  }
}
function noteClasses(tone: Tone = "neutral") {
  switch (tone) {
    case "danger":
      return {
        box: "fill-rose-50 dark:fill-rose-950 stroke-rose-300 dark:stroke-rose-800",
        text: "fill-rose-800 dark:fill-rose-200",
      };
    case "safe":
      return {
        box: "fill-emerald-50 dark:fill-emerald-950 stroke-emerald-300 dark:stroke-emerald-800",
        text: "fill-emerald-800 dark:fill-emerald-200",
      };
    case "warn":
      return {
        box: "fill-amber-50 dark:fill-amber-950 stroke-amber-300 dark:stroke-amber-800",
        text: "fill-amber-800 dark:fill-amber-200",
      };
    default:
      return {
        box: "fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700",
        text: "fill-zinc-700 dark:fill-zinc-200",
      };
  }
}

export function SequenceDiagram({
  caption,
  actors,
  events,
}: {
  caption: string;
  actors: SeqActor[];
  events: SeqEvent[];
}) {
  const n = actors.length;
  const W = PAD_X * 2 + GAP * (n - 1);
  const idx = (id: string) => actors.findIndex((a) => a.id === id);
  const actorX = (i: number) => PAD_X + i * GAP;
  const eventY = (i: number) => EVENT_TOP + i * ROW_H;
  const lifeBottom = EVENT_TOP + (events.length - 1) * ROW_H + 36;
  const H = lifeBottom + 12;

  return (
    <Figure caption={caption}>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label={caption}
          style={{ minWidth: Math.min(W, 520) }}
        >
          <defs>
            <marker
              id="seq-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                className="fill-zinc-700 dark:fill-zinc-300"
              />
            </marker>
          </defs>

          {/* Lifelines + actor boxes */}
          {actors.map((a, i) => {
            const x = actorX(i);
            const c = actorClasses(a.tone);
            return (
              <g key={a.id}>
                <line
                  x1={x}
                  x2={x}
                  y1={LIFE_TOP}
                  y2={lifeBottom}
                  className="stroke-zinc-300 dark:stroke-zinc-700"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <rect
                  x={x - ACTOR_W / 2}
                  y={ACTOR_TOP}
                  width={ACTOR_W}
                  height={ACTOR_H}
                  rx={6}
                  className={c.box}
                />
                <text
                  x={x}
                  y={a.sub ? ACTOR_TOP + 20 : ACTOR_TOP + 27}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  className={c.text}
                >
                  {a.label}
                </text>
                {a.sub && (
                  <text
                    x={x}
                    y={ACTOR_TOP + 34}
                    textAnchor="middle"
                    fontSize={10}
                    className={c.sub}
                  >
                    {a.sub}
                  </text>
                )}
              </g>
            );
          })}

          {/* Events */}
          {events.map((e, i) => {
            const y = eventY(i);
            if (e.kind === "note") {
              const a = idx(e.from);
              const b = idx(e.to);
              const lo = Math.min(a, b);
              const hi = Math.max(a, b);
              const cx = (actorX(lo) + actorX(hi)) / 2;
              const span = actorX(hi) - actorX(lo);
              const lines = wrapLabel(e.label, Math.max(span + 70, 150));
              const w = Math.max(span + 80, maxWidth(lines) + 24);
              const h = lines.length * LINE_H + 14;
              const c = noteClasses(e.tone);
              return (
                <g key={i}>
                  <rect
                    x={cx - w / 2}
                    y={y - h / 2}
                    width={w}
                    height={h}
                    rx={4}
                    className={c.box}
                    strokeWidth={1}
                  />
                  {lines.map((ln, j) => (
                    <text
                      key={j}
                      x={cx}
                      y={y - h / 2 + 11 + 4 + j * LINE_H}
                      textAnchor="middle"
                      fontSize={11}
                      className={c.text}
                    >
                      {ln}
                    </text>
                  ))}
                </g>
              );
            }

            const a = idx(e.from);
            const b = idx(e.to);
            const dash = e.dashed ? "5 4" : undefined;

            // Self-message: small loop to the right of the lifeline.
            if (a === b) {
              const x = actorX(a);
              const lines = wrapLabel(e.label, 200);
              return (
                <g key={i}>
                  <path
                    d={`M ${x} ${y - 9} h 34 v 18 h -32`}
                    fill="none"
                    className="stroke-zinc-700 dark:stroke-zinc-300"
                    strokeWidth={1.75}
                    strokeDasharray={dash}
                    markerEnd="url(#seq-arrow)"
                  />
                  {lines.map((ln, j) => (
                    <text
                      key={j}
                      x={x + 44}
                      y={y - 2 + j * LINE_H}
                      textAnchor="start"
                      fontSize={12}
                      className="fill-zinc-900 dark:fill-zinc-100"
                    >
                      {ln}
                    </text>
                  ))}
                </g>
              );
            }

            const x1 = actorX(a);
            const x2 = actorX(b);
            const mid = (x1 + x2) / 2;
            const spanMax = Math.abs(x2 - x1) + GAP - 28;
            const lines = wrapLabel(e.label, spanMax);
            const w = maxWidth(lines) + 14;
            const baseY = y - 9;
            const firstY = baseY - (lines.length - 1) * LINE_H;
            return (
              <g key={i}>
                {/* label background masks the lifelines behind it */}
                <rect
                  x={mid - w / 2}
                  y={firstY - 11}
                  width={w}
                  height={lines.length * LINE_H + 4}
                  className="fill-zinc-50 dark:fill-zinc-900"
                />
                {lines.map((ln, j) => (
                  <text
                    key={j}
                    x={mid}
                    y={firstY + j * LINE_H}
                    textAnchor="middle"
                    fontSize={12}
                    className="fill-zinc-900 dark:fill-zinc-100"
                  >
                    {ln}
                  </text>
                ))}
                <line
                  x1={x1}
                  x2={x2}
                  y1={y}
                  y2={y}
                  className="stroke-zinc-700 dark:stroke-zinc-300"
                  strokeWidth={1.75}
                  strokeDasharray={dash}
                  markerEnd="url(#seq-arrow)"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </Figure>
  );
}
