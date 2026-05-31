import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 4. 트래픽에 따른 비용 — 두 플랫폼 모두 월 ~1TB 전송이 무료라 손익분기는 ‘달러'가 아니라 ‘운영 노력'에서 갈린다.",
    regime1: "무료 티어 구간 — 월 ~200만 PV 이하",
    regime1Sub: "CloudFront·Vercel 모두 월 1TB 전송 포함. 이 구간에선 트래픽이 늘어도 AWS는 사실상 고정.",
    regime2: "무료 티어 초과 구간 — 전송 단가 비교",
    regime2Sub: "초과분 단가가 AWS가 더 낮다 ($0.085/GB < $0.15/GB) → 고트래픽에서도 역전되지 않음.",
    aws: "AWS 자체 호스팅",
    vercel: "Vercel Pro",
    rows1: [
      { pv: "1만 PV", xfer: "~5 GB", aws: 0.65, vercel: 20 },
      { pv: "100만 PV", xfer: "~0.5 TB", aws: 0.65, vercel: 20 },
      { pv: "200만 PV", xfer: "~1 TB (한도)", aws: 0.65, vercel: 20 },
    ],
    rows2: [
      { pv: "500만 PV", xfer: "~2.5 TB", aws: 130, vercel: 250 },
      { pv: "1000만 PV", xfer: "~5 TB", aws: 350, vercel: 630 },
    ],
    verdict:
      "정적 사이트에서는 모든 구간에서 AWS가 더 싸다. 월 $20은 ‘더 낮은 청구서'가 아니라 미리보기 배포·빌드·이미지 최적화 같은 DX를 사는 값이다.",
    caveat:
      "단 두 경우엔 AWS도 빠르게 비싸진다 — (1) 인도·남미·일부 APAC 등 고가 엣지 리전(US/EU $0.085 대비 약 $0.11~0.12/GB), (2) 페이지 payload가 수 MB로 무거워 PV당 전송량이 급증할 때. 캐시·이미지 최적화로 PV당 전송을 낮추는 게 곧 비용 관리다.",
    assumptions:
      "가정: PV당 평균 egress 0.5MB, CloudFront US/EU $0.085/GB (월 1TB 무료), Vercel Pro 1TB 포함 후 $0.15/GB, Route 53 $0.5 고정. 전송 비용만 모델링했으며, 매우 높은 PV에서는 요청 수 과금(CloudFront 1천만 요청 초과분, Vercel Edge Requests $0.002/1K)도 더해진다. 실제 비용은 페이지 무게·리전·캐시 적중률에 따라 달라진다.",
    unit: "/월",
  },
  en: {
    caption:
      "Fig 4. Cost vs traffic — both platforms include ~1 TB/mo egress free, so the break-even is about operational effort, not dollars.",
    regime1: "Free-tier regime — up to ~2M PV/month",
    regime1Sub: "Both CloudFront and Vercel include 1 TB egress. Here AWS is essentially flat no matter the traffic.",
    regime2: "Beyond the free tier — egress rate comparison",
    regime2Sub: "AWS's overage rate is lower ($0.085/GB < $0.15/GB) → it doesn't flip even at high traffic.",
    aws: "AWS self-hosting",
    vercel: "Vercel Pro",
    rows1: [
      { pv: "10k PV", xfer: "~5 GB", aws: 0.65, vercel: 20 },
      { pv: "1M PV", xfer: "~0.5 TB", aws: 0.65, vercel: 20 },
      { pv: "2M PV", xfer: "~1 TB (cap)", aws: 0.65, vercel: 20 },
    ],
    rows2: [
      { pv: "5M PV", xfer: "~2.5 TB", aws: 130, vercel: 250 },
      { pv: "10M PV", xfer: "~5 TB", aws: 350, vercel: 630 },
    ],
    verdict:
      "For a static site, AWS is cheaper across the board. The $20/mo doesn't buy a lower bill — it buys DX: preview deploys, build minutes, image optimization.",
    caveat:
      "AWS does get expensive fast in two cases — (1) costly edge regions like India/South America/some of APAC (~$0.11–0.12/GB vs $0.085 for US/EU), (2) multi-MB page payloads that spike per-PV transfer. Lowering per-PV egress via caching and image optimization IS cost control.",
    assumptions:
      "Assumptions: 0.5 MB average egress per PV, CloudFront US/EU $0.085/GB (1 TB/mo free), Vercel Pro 1 TB included then $0.15/GB, Route 53 $0.5 fixed. Only transfer is modeled; at very high PV, request charges add up (CloudFront beyond 10M requests, Vercel Edge Requests $0.002/1K). Real cost varies with page weight, region, and cache hit ratio.",
    unit: "/mo",
  },
} as const;

function Bar({
  label,
  value,
  max,
  unit,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  tone: "aws" | "vercel";
}) {
  const pct = Math.max((value / max) * 100, 1.5);
  const display = value < 10 ? `$${value.toFixed(1)}` : `$${Math.round(value)}`;
  return (
    <div className="grid grid-cols-[7rem_1fr_4rem] sm:grid-cols-[9rem_1fr_4.5rem] items-center gap-2 text-xs">
      <span className="text-zinc-600 dark:text-zinc-400 truncate">{label}</span>
      <div className="h-5 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <div
          className={`h-full ${tone === "aws" ? "bg-zinc-900 dark:bg-zinc-100" : "bg-rose-300 dark:bg-rose-800"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono tabular-nums text-right font-semibold text-zinc-900 dark:text-zinc-100">
        {display}
        <span className="text-zinc-400 dark:text-zinc-500 font-normal">{unit}</span>
      </span>
    </div>
  );
}

export function CostScaling({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const max2 = 650;
  return (
    <Figure caption={s.caption}>
      <div className="space-y-7">
        {/* Regime 1: free tier */}
        <section>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {s.regime1}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-3 leading-snug">
            {s.regime1Sub}
          </p>
          <div className="space-y-2.5">
            {s.rows1.map((r) => (
              <div key={r.pv} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {r.pv}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                    {r.xfer}
                  </span>
                </div>
                <Bar label={s.aws} value={r.aws} max={20} unit={s.unit} tone="aws" />
                <Bar label={s.vercel} value={r.vercel} max={20} unit={s.unit} tone="vercel" />
              </div>
            ))}
          </div>
        </section>

        {/* Regime 2: overage */}
        <section className="rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 p-4">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {s.regime2}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-3 leading-snug">
            {s.regime2Sub}
          </p>
          <div className="space-y-2.5">
            {s.rows2.map((r) => (
              <div key={r.pv} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {r.pv}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                    {r.xfer}
                  </span>
                </div>
                <Bar label={s.aws} value={r.aws} max={max2} unit={s.unit} tone="aws" />
                <Bar label={s.vercel} value={r.vercel} max={max2} unit={s.unit} tone="vercel" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Verdict */}
      <div className="mt-6 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 p-4">
        <p className="text-sm font-medium leading-relaxed">{s.verdict}</p>
      </div>
      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {s.caveat}
      </p>
      <p className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed italic">
        {s.assumptions}
      </p>
    </Figure>
  );
}
