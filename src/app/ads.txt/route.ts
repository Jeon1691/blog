import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  if (!site.adsense.clientId) {
    return new Response("# AdSense not configured\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const publisher = site.adsense.clientId.replace(/^ca-/, "");
  const body = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
