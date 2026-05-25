import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    },
    twitter: { card: "summary", title, description },
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
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header locale={locale} />
        <main className="flex-1 w-full">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
