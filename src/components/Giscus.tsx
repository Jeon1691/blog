"use client";

import GiscusComponent from "@giscus/react";
import { type Locale } from "@/lib/locales";
import { site } from "@/lib/site";

export function Giscus({ locale }: { locale: Locale }) {
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
      theme="preferred_color_scheme"
    />
  );
}
