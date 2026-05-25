import { Figure } from "./Figure";

export function ProductivityParadox() {
  return (
    <Figure caption="Fig 3. AI 도입 패러독스 — 개인 지표는 오르지만 조직 단위 전달 성과는 떨어진다">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md border border-zinc-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              개인 단위
            </div>
            <div className="text-emerald-700 text-xl font-bold">↑</div>
          </div>
          <div className="mt-3 space-y-2.5">
            <Metric label="코드 품질" value="+3.4%" source="DORA 2024" />
            <Metric label="코드 리뷰 속도" value="+3.1%" source="DORA 2024" />
            <Metric label="문서 품질" value="+7.5%" source="DORA 2024" />
            <Metric label="작업 완료" value="+21%" source="Faros 2025" />
            <Metric
              label="Copilot 그룹 코딩 속도"
              value="+55.8%"
              source="Peng 2023"
            />
          </div>
        </div>
        <div className="rounded-md border border-zinc-200 bg-rose-50/40 p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              조직 단위
            </div>
            <div className="text-rose-700 text-xl font-bold">↓</div>
          </div>
          <div className="mt-3 space-y-2.5">
            <Metric
              label="Delivery throughput"
              value="−1.5%"
              source="DORA 2024"
              neg
            />
            <Metric
              label="Delivery stability"
              value="−7.2%"
              source="DORA 2024"
              neg
            />
            <Metric
              label="PR 리뷰 시간"
              value="+91%"
              source="Faros 2025"
              neg
            />
            <Metric
              label="첫 리뷰까지 시간 중앙값"
              value="+156.6%"
              source="Faros 2026"
              neg
            />
            <Metric
              label="리뷰 체류 시간 중앙값"
              value="+441.5%"
              source="Faros 2026"
              neg
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-4 text-center">
        가장 느린 단계(리뷰)가 전체 속도를 결정 — Amdahl의 법칙
      </p>
    </Figure>
  );
}

function Metric({
  label,
  value,
  source,
  neg = false,
}: {
  label: string;
  value: string;
  source: string;
  neg?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <div className="text-zinc-700 truncate pr-2">{label}</div>
      <div className="flex items-baseline gap-2 flex-shrink-0">
        <span
          className={`font-bold tabular-nums ${neg ? "text-rose-700" : "text-emerald-700"}`}
        >
          {value}
        </span>
        <span className="text-[10px] text-zinc-400 font-medium">{source}</span>
      </div>
    </div>
  );
}
