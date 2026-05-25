"use client";

import { useEffect, useRef, useState } from "react";
import { type Locale, getDictionary } from "@/lib/locales";

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string };
  }>;
};
type Pagefind = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

async function ensurePagefind(): Promise<Pagefind | null> {
  if (typeof window === "undefined") return null;
  if (window.pagefind) return window.pagefind;
  try {
    const url = "/pagefind/pagefind.js";
    const mod = (await import(/* webpackIgnore: true */ /* @vite-ignore */ url)) as Pagefind;
    window.pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

type Hit = { url: string; title: string; excerpt: string };

export function SearchTrigger({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!q) {
        setHits([]);
        return;
      }
      const pf = await ensurePagefind();
      if (!pf || cancelled) return;
      const r = await pf.search(q);
      const top = await Promise.all(
        r.results.slice(0, 8).map(async (h) => {
          const d = await h.data();
          return {
            url: d.url,
            title: d.meta.title ?? d.url,
            excerpt: d.excerpt,
          };
        })
      );
      if (!cancelled) setHits(top);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label={dict.search.open}
      >
        {dict.search.open}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={dict.search.placeholder}
              className="w-full px-4 py-3 bg-transparent border-b border-zinc-200 dark:border-zinc-800 outline-none"
            />
            <ul className="max-h-80 overflow-y-auto">
              {q && hits.length === 0 && (
                <li className="px-4 py-3 text-sm text-muted-foreground">
                  {dict.search.noResults}
                </li>
              )}
              {hits.map((h) => (
                <li key={h.url}>
                  <a
                    href={h.url}
                    className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div className="font-medium">{h.title}</div>
                    <div
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: h.excerpt }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
