import Script from "next/script";
import { site } from "@/lib/site";

export function AdsenseScript() {
  if (!site.adsense.clientId) return null;
  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsense.clientId}`}
      crossOrigin="anonymous"
    />
  );
}
