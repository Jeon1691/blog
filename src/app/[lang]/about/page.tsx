import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/locales";

export default async function About({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const body =
    lang === "ko" ? (
      <>
        <p>
          안녕하세요. <strong>{dict.siteName}</strong>은 개인 기술 블로그입니다.
          주로 Next.js, AWS, 한국 핀테크/스테이블코인, AI 인프라에 대한 글을
          씁니다.
        </p>
        <p>
          이 블로그는 Next.js 정적 export + S3 + CloudFront로 자체 호스팅되며,
          Terraform과 GitHub Actions로 관리됩니다. 모든 코드는 공개되어
          있습니다.
        </p>
      </>
    ) : (
      <>
        <p>
          Hi — <strong>{dict.siteName}</strong> is a personal blog covering
          Next.js, AWS, Korean fintech/stablecoins, and AI infrastructure.
        </p>
        <p>
          The site is self-hosted using Next.js static export on S3 + CloudFront,
          managed by Terraform and deployed via GitHub Actions. All code is
          public.
        </p>
      </>
    );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        {dict.nav.about}
      </h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">{body}</div>
    </div>
  );
}
