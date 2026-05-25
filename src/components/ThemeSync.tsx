"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function readAndApply() {
  try {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored === "dark" || (stored !== "light" && prefersDark);
    if (dark) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  } catch {
    /* localStorage / matchMedia unavailable — no-op */
  }
}

export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    readAndApply();
  }, [pathname]);

  return null;
}
