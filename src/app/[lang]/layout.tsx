import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeSync } from "@/components/ThemeSync";
import { AdsenseScript } from "@/components/AdsenseScript";

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title = site.name;
  const description =
    lang === "ko"
      ? "기술과 생각의 기록 — develicit"
      : "Notes on engineering & thought — develicit";
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    applicationName: site.name,
    authors: [{ name: site.author, url: site.authorUrl }],
    creator: site.author,
    publisher: site.author,
    keywords:
      lang === "ko"
        ? ["블로그", "Next.js", "AWS", "Terraform", "한국 핀테크", "AI 인프라"]
        : ["blog", "Next.js", "AWS", "Terraform", "Korean fintech", "AI infra"],
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: `/${lang}/`,
      languages: {
        ko: "/ko/",
        en: "/en/",
        "x-default": "/ko/",
      },
      types: {
        "application/rss+xml": [
          { url: `/ko/feed.xml`, title: `${site.name} (한국어)` },
          { url: `/en/feed.xml`, title: `${site.name} (English)` },
        ],
      },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${lang}/`,
      title,
      description,
      siteName: site.name,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? ["en_US"] : ["ko_KR"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LangRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <AdsenseScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeSync />
        <Header locale={locale} />
        <main className="flex-1 w-full">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
