import { Figure } from "./Figure";

type Locale = "ko" | "en";

const SCALE_MAX = 20; // USD axis

const STRINGS = {
  ko: {
    caption:
      "Fig 3. 월 비용 비교 (월 1만 PV 기준) — AWS 자체 호스팅 ~$1.1 vs Vercel Pro $20.",
    awsLabel: "AWS 자체 호스팅",
    vercelLabel: "Vercel Pro",
    total: "합계",
    note: "트래픽이 적은 개인 블로그에서는 약 18배 차이. 단, 트래픽이 폭증하면 CloudFront 전송 비용이 선형 증가하므로 손익분기는 달라진다.",
    segments: [
      { label: "CloudFront", value: 0.5, cls: "bg-zinc-900 dark:bg-zinc-100" },
      { label: "Route 53", value: 0.5, cls: "bg-zinc-500 dark:bg-zinc-400" },
      { label: "S3", value: 0.1, cls: "bg-zinc-300 dark:bg-zinc-600" },
    ],
    vercel: 20,
  },
  en: {
    caption:
      "Fig 3. Monthly cost comparison (at ~10k pageviews) — AWS self-hosting ~$1.1 vs Vercel Pro $20.",
    awsLabel: "AWS self-hosting",
    vercelLabel: "Vercel Pro",
    total: "total",
    note: "About an 18× gap for a low-traffic personal blog. If traffic spikes, CloudFront transfer cost grows linearly, so the break-even shifts.",
    segments: [
      { label: "CloudFront", value: 0.5, cls: "bg-zinc-900 dark:bg-zinc-100" },
      { label: "Route 53", value: 0.5, cls: "bg-zinc-500 dark:bg-zinc-400" },
      { label: "S3", value: 0.1, cls: "bg-zinc-300 dark:bg-zinc-600" },
    ],
    vercel: 20,
  },
} as const;

export function CostBreakdown({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const awsTotal = s.segments.reduce((a, b) => a + b.value, 0);
  return (
    <Figure caption={s.caption}>
      <div className="space-y-6">
        {/* AWS stacked bar */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {s.awsLabel}
            </span>
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              ~${awsTotal.toFixed(1)}/mo
            </span>
          </div>
          <div className="h-9 w-full rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex">
            {s.segments.map((seg) => (
              <div
                key={seg.label}
                className={`h-full ${seg.cls}`}
                style={{ width: `${(seg.value / SCALE_MAX) * 100}%` }}
                aria-label={`${seg.label}: $${seg.value}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            {s.segments.map((seg) => (
              <span key={seg.label} className="flex items-center gap-1.5">
                <span className={`inline-block w-3 h-3 rounded-sm ${seg.cls}`} />
                {seg.label} ${seg.value.toFixed(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Vercel bar */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {s.vercelLabel}
            </span>
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              ${s.vercel}/mo
            </span>
          </div>
          <div className="h-9 w-full rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-rose-300 dark:bg-rose-800"
              style={{ width: `${(s.vercel / SCALE_MAX) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center italic">
        {s.note}
      </p>
    </Figure>
  );
}
