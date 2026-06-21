"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Reveals a flow's steps in order once it scrolls into view, highlighting the
// current step. Progressive enhancement: SSR / no-JS / prefers-reduced-motion
// all get the full static diagram (every step shown, nothing highlighted).
export function useStepReveal(count: number, stepMs = 600) {
  const [revealed, setRevealed] = useState(count);
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    setRevealed(0);
    timer.current = window.setInterval(() => {
      setRevealed((r) => {
        const next = r + 1;
        if (next >= count) {
          stop();
          setPlaying(false);
          return count;
        }
        return next;
      });
    }, stepMs);
  }, [count, stepMs, stop]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(count);
      return;
    }
    setEnabled(true);
    setRevealed(0);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      play();
      return () => stop();
    }
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting && !started) {
            started = true;
            play();
            obs.disconnect();
          }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      stop();
    };
  }, [count, play, stop]);

  return {
    ref,
    enabled,
    playing,
    replay: play,
    shown: (i: number) => !enabled || i < revealed,
    current: (i: number) => enabled && playing && i === revealed - 1,
  };
}

export function Reveal({
  shown,
  current,
  children,
}: {
  shown: boolean;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(8px)",
      }}
    >
      <div
        className={`transition-all duration-300 rounded-md ${
          current
            ? "ring-2 ring-amber-400/80 dark:ring-amber-500/70 scale-[1.03]"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function ReplayButton({
  onClick,
  playing,
  locale,
}: {
  onClick: () => void;
  playing: boolean;
  locale: "ko" | "en";
}) {
  const label = locale === "en" ? "Replay" : "다시 재생";
  return (
    <div className="mt-3 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={playing}
        aria-label={label}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-default"
      >
        <span aria-hidden>↻</span> {label}
      </button>
    </div>
  );
}

// A connector that draws top→bottom as the flow reaches it, glowing amber while
// the payload passes through, then settling to a static arrow.
export function Arrow({
  shown,
  current,
  size = "md",
}: {
  shown: boolean;
  current: boolean;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-3" : "h-5";
  const my = size === "sm" ? "my-0.5" : "my-1";
  return (
    <div className={`flex justify-center ${my}`} aria-hidden>
      <div className={`relative ${h} w-px`}>
        <div
          className={`absolute inset-0 origin-top transition-transform duration-300 ease-out ${
            current
              ? "bg-amber-400 dark:bg-amber-500"
              : "bg-zinc-300 dark:bg-zinc-600"
          }`}
          style={{ transform: shown ? "scaleY(1)" : "scaleY(0)" }}
        />
        <svg
          width="9"
          height="7"
          viewBox="0 0 9 7"
          className={`absolute left-1/2 -translate-x-1/2 -bottom-1 transition-opacity duration-200 ${
            current
              ? "fill-amber-500 dark:fill-amber-400"
              : "fill-zinc-400 dark:fill-zinc-600"
          }`}
          style={{ opacity: shown ? 1 : 0 }}
        >
          <path d="M4.5 7L0 0h9z" />
        </svg>
      </div>
    </div>
  );
}
