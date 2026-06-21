"use client";

import { useEffect, useRef, useState } from "react";
import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Tone = "neutral" | "danger" | "safe" | "warn";

export type SeqActor = {
  id: string;
  label: string;
  sub?: string;
  tone?: Tone;
  holdsKey?: boolean;
};

export type SeqEvent =
  | {
      kind: "msg";
      from: string;
      to: string;
      label: string;
      dashed?: boolean;
      token?: Tone;
    }
  | { kind: "note"; from: string; to: string; label: string; tone?: Tone };

const GAP = 156;
const PAD_X = 82;
const ACTOR_TOP = 6;
const ACTOR_H = 44;
const ACTOR_W = 130;
const LIFE_TOP = ACTOR_TOP + ACTOR_H + 8;
const EVENT_TOP = 104;
const ROW_H = 54;
const LINE_H = 13;
const STEP_MS = 880;
const TRAVEL_MS = 580;

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
function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function smooth(p: number) {
  return p * p * (3 - 2 * p);
}

function actorClasses(tone: Tone = "neutral") {
  switch (tone) {
    case "danger":
      return { box: "fill-rose-600 dark:fill-rose-700", text: "fill-rose-50", sub: "fill-rose-100" };
    case "safe":
      return { box: "fill-emerald-600 dark:fill-emerald-700", text: "fill-emerald-50", sub: "fill-emerald-100" };
    case "warn":
      return { box: "fill-amber-500 dark:fill-amber-600", text: "fill-amber-50", sub: "fill-amber-100" };
    default:
      return { box: "fill-zinc-800 dark:fill-zinc-200", text: "fill-zinc-50 dark:fill-zinc-900", sub: "fill-zinc-400 dark:fill-zinc-600" };
  }
}
function noteClasses(tone: Tone = "neutral") {
  switch (tone) {
    case "danger":
      return { box: "fill-rose-50 dark:fill-rose-950 stroke-rose-300 dark:stroke-rose-800", text: "fill-rose-800 dark:fill-rose-200" };
    case "safe":
      return { box: "fill-emerald-50 dark:fill-emerald-950 stroke-emerald-300 dark:stroke-emerald-800", text: "fill-emerald-800 dark:fill-emerald-200" };
    case "warn":
      return { box: "fill-amber-50 dark:fill-amber-950 stroke-amber-300 dark:stroke-amber-800", text: "fill-amber-800 dark:fill-amber-200" };
    default:
      return { box: "fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700", text: "fill-zinc-700 dark:fill-zinc-200" };
  }
}
function tokenClasses(tone: Tone = "neutral") {
  switch (tone) {
    case "danger":
      return { circle: "fill-rose-500 dark:fill-rose-600 stroke-rose-200 dark:stroke-rose-900", text: "fill-white", glyph: "!" };
    case "warn":
      return { circle: "fill-amber-500 dark:fill-amber-600 stroke-amber-200 dark:stroke-amber-900", text: "fill-white", glyph: "!" };
    case "safe":
      return { circle: "fill-emerald-500 dark:fill-emerald-600 stroke-emerald-200 dark:stroke-emerald-900", text: "fill-white", glyph: "✓" };
    default:
      return { circle: "fill-zinc-700 dark:fill-zinc-300 stroke-zinc-300 dark:stroke-zinc-700", text: "fill-zinc-50 dark:fill-zinc-900", glyph: "" };
  }
}

export function SequenceDiagram({
  caption,
  actors,
  events,
  locale = "ko",
}: {
  caption: string;
  actors: SeqActor[];
  events: SeqEvent[];
  locale?: Locale;
}) {
  const n = actors.length;
  const total = events.length;
  const W = PAD_X * 2 + GAP * (n - 1);
  const idx = (id: string) => actors.findIndex((a) => a.id === id);
  const actorX = (i: number) => PAD_X + i * GAP;
  const eventY = (i: number) => EVENT_TOP + i * ROW_H;
  const lifeBottom = EVENT_TOP + (events.length - 1) * ROW_H + 36;
  const H = lifeBottom + 12;
  const keyY = LIFE_TOP + 16;

  // Default (SSR / no-JS): static full diagram. The effect opts into animation.
  const [anim, setAnim] = useState<{ step: number; p: number }>({ step: total, p: 1 });
  const [animMode, setAnimMode] = useState(false);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const stop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
  const play = () => {
    stop();
    setPlaying(true);
    startRef.current = performance.now();
    const loop = (now: number) => {
      const t = now - startRef.current;
      const step = Math.floor(t / STEP_MS);
      if (step >= total) {
        setAnim({ step: total, p: 1 });
        setPlaying(false);
        rafRef.current = null;
        return;
      }
      const p = clamp01((t - step * STEP_MS) / TRAVEL_MS);
      setAnim({ step, p });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAnim({ step: total, p: 1 });
      return;
    }
    setAnimMode(true);
    setAnim({ step: 0, p: 0 });
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      play();
      return () => stop();
    }
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            play();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const replayLabel = locale === "en" ? "Replay" : "다시 재생";
  const keyStays = locale === "en" ? "key stays" : "키 고정";

  const done = !animMode || anim.step >= total;
  const activeEv = !done ? events[anim.step] : null;
  const activeIds =
    activeEv && activeEv.kind === "msg"
      ? new Set([activeEv.from, activeEv.to])
      : new Set<string>();
  const pe = smooth(anim.p);

  return (
    <Figure caption={caption}>
      <div ref={containerRef}>
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
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-zinc-700 dark:fill-zinc-300" />
              </marker>
            </defs>

            {/* Lifelines + actors (the stage; always visible) */}
            {actors.map((a, i) => {
              const x = actorX(i);
              const c = actorClasses(a.tone);
              const active = activeIds.has(a.id);
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
                  {active && (
                    <rect
                      x={x - ACTOR_W / 2 - 3}
                      y={ACTOR_TOP - 3}
                      width={ACTOR_W + 6}
                      height={ACTOR_H + 6}
                      rx={9}
                      className="fill-none stroke-amber-400 dark:stroke-amber-500"
                      strokeWidth={2}
                    />
                  )}
                  <rect x={x - ACTOR_W / 2} y={ACTOR_TOP} width={ACTOR_W} height={ACTOR_H} rx={6} className={c.box} />
                  <text x={x} y={a.sub ? ACTOR_TOP + 20 : ACTOR_TOP + 27} textAnchor="middle" fontSize={13} fontWeight={700} className={c.text}>
                    {a.label}
                  </text>
                  {a.sub && (
                    <text x={x} y={ACTOR_TOP + 34} textAnchor="middle" fontSize={10} className={c.sub}>
                      {a.sub}
                    </text>
                  )}
                </g>
              );
            })}

            {/* "Key stays here" anchor on the secure element's lifeline */}
            {actors.map((a, i) => {
              if (!a.holdsKey) return null;
              const x = actorX(i);
              const involved = !done && activeEv?.kind === "msg" && activeIds.has(a.id);
              const pulse = involved ? Math.sin(anim.p * Math.PI) : 0;
              const scale = 1 + 0.3 * pulse;
              return (
                <g key={a.id + "-key"}>
                  <circle cx={x} cy={keyY} r={16} className="fill-emerald-400 dark:fill-emerald-500" opacity={0.45 * pulse} />
                  <g transform={`translate(${x} ${keyY}) scale(${scale})`}>
                    <circle r={11} className="fill-emerald-50 dark:fill-emerald-950 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth={1.25} />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={12}>🔑</text>
                  </g>
                  <text x={x} y={keyY + 25} textAnchor="middle" fontSize={9} className="fill-emerald-700 dark:fill-emerald-300">
                    {keyStays}
                  </text>
                </g>
              );
            })}

            {/* Events */}
            {events.map((e, i) => {
              const y = eventY(i);
              const state = done || i < anim.step ? "full" : i === anim.step ? "active" : "hidden";
              if (state === "hidden") return null;

              // NOTE
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
                  <g key={i} opacity={state === "active" ? anim.p : 1}>
                    <rect x={cx - w / 2} y={y - h / 2} width={w} height={h} rx={4} className={c.box} strokeWidth={1} />
                    {lines.map((ln, j) => (
                      <text key={j} x={cx} y={y - h / 2 + 15 + j * LINE_H} textAnchor="middle" fontSize={11} className={c.text}>
                        {ln}
                      </text>
                    ))}
                  </g>
                );
              }

              const a = idx(e.from);
              const b = idx(e.to);
              const dash = e.dashed ? "5 4" : undefined;

              // SELF message (loop)
              if (a === b) {
                const x = actorX(a);
                const lines = wrapLabel(e.label, 200);
                const tk = tokenClasses(e.token);
                return (
                  <g key={i} opacity={state === "active" ? clamp01(anim.p * 1.4) : 1}>
                    <path d={`M ${x} ${y - 9} h 34 v 18 h -32`} fill="none" className="stroke-zinc-800 dark:stroke-zinc-200" strokeWidth={2} strokeDasharray={dash} markerEnd="url(#seq-arrow)" />
                    {state === "active" && e.token && (
                      <g>
                        <circle cx={x + 34} cy={y} r={10} className={tk.circle} strokeWidth={1} />
                        {tk.glyph && (
                          <text x={x + 34} y={y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700} className={tk.text}>
                            {tk.glyph}
                          </text>
                        )}
                      </g>
                    )}
                    {lines.map((ln, j) => (
                      <text key={j} x={x + 50} y={y - 2 + j * LINE_H} textAnchor="start" fontSize={12} className="fill-zinc-900 dark:fill-zinc-100">
                        {ln}
                      </text>
                    ))}
                  </g>
                );
              }

              // DIRECTED message
              const x1 = actorX(a);
              const x2 = actorX(b);
              const mid = (x1 + x2) / 2;
              const spanMax = Math.abs(x2 - x1) + GAP - 28;
              const lines = wrapLabel(e.label, spanMax);
              const w = maxWidth(lines) + 14;
              const baseY = y - 9;
              const firstY = baseY - (lines.length - 1) * LINE_H;

              if (state === "full") {
                return (
                  <g key={i}>
                    <rect x={mid - w / 2} y={firstY - 11} width={w} height={lines.length * LINE_H + 4} className="fill-zinc-50 dark:fill-zinc-900" />
                    {lines.map((ln, j) => (
                      <text key={j} x={mid} y={firstY + j * LINE_H} textAnchor="middle" fontSize={12} className="fill-zinc-900 dark:fill-zinc-100">
                        {ln}
                      </text>
                    ))}
                    <line x1={x1} x2={x2} y1={y} y2={y} className="stroke-zinc-700 dark:stroke-zinc-300" strokeWidth={1.75} strokeDasharray={dash} markerEnd="url(#seq-arrow)" />
                  </g>
                );
              }

              // ACTIVE: token travels, line grows behind it, label fades in.
              const xTip = x1 + (x2 - x1) * pe;
              const labelOpacity = clamp01((anim.p - 0.3) / 0.6);
              const tk = tokenClasses(e.token);
              return (
                <g key={i}>
                  <line x1={x1} x2={xTip} y1={y} y2={y} className="stroke-zinc-900 dark:stroke-zinc-100" strokeWidth={2.25} strokeDasharray={dash} markerEnd="url(#seq-arrow)" />
                  <g opacity={labelOpacity}>
                    <rect x={mid - w / 2} y={firstY - 11} width={w} height={lines.length * LINE_H + 4} className="fill-zinc-50 dark:fill-zinc-900" />
                    {lines.map((ln, j) => (
                      <text key={j} x={mid} y={firstY + j * LINE_H} textAnchor="middle" fontSize={12} className="fill-zinc-900 dark:fill-zinc-100">
                        {ln}
                      </text>
                    ))}
                  </g>
                  <g>
                    <circle cx={xTip} cy={y} r={11} className={tk.circle} strokeWidth={1.25} />
                    {tk.glyph && (
                      <text x={xTip} y={y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} className={tk.text}>
                        {tk.glyph}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {animMode && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={play}
              disabled={playing}
              aria-label={replayLabel}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-default"
            >
              <span aria-hidden>↻</span> {replayLabel}
            </button>
          </div>
        )}
      </div>
    </Figure>
  );
}
