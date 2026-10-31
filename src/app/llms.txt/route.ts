import { llmsIndex } from "@/lib/llm";

export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsIndex(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
