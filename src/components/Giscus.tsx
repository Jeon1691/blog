"use client";

import GiscusComponent from "@giscus/react";
import { useEffect, useState } from "react";
import { type Locale } from "@/lib/locales";
import { site } from "@/lib/site";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function Giscus({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
    const observer = new MutationObserver(() => {
      setTheme(readTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  if (!site.giscus.repoId || !site.giscus.categoryId) {
    return (
      <p className="text-sm text-muted-foreground italic">
        {locale === "ko"
          ? "댓글 시스템(Giscus) 설정 대기 중. giscus.app에서 설정 후 src/lib/site.ts의 repoId/categoryId를 채워주세요."
          : "Giscus comments not configured yet. Set up at giscus.app and fill repoId/categoryId in src/lib/site.ts."}
      </p>
    );
  }

  return (
    <GiscusComponent
      id="comments"
      repo={site.giscus.repo}
      repoId={site.giscus.repoId}
      category={site.giscus.category}
      categoryId={site.giscus.categoryId}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      lang={locale === "ko" ? "ko" : "en"}
      loading="lazy"
      theme={theme}
    />
  );
}
