import { Figure } from "./Figure";

const layers = [
  {
    id: "L1",
    title: "Deterministic Guardrails",
    desc: "린트 · 타입 · 단위/통합 테스트 · 보안 스캔",
    block: "자동 차단",
    blockColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "L2",
    title: "AI Code Review",
    desc: "구문 · 스타일 · 단순 버그 · 보안 패턴 1차 필터",
    block: "경고",
    blockColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "L3",
    title: "Spec / Intent Review",
    desc: "사람이 의도와 수용 기준 검토 — 코드 작성 전 권장",
    block: "차단",
    blockColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "L4",
    title: "Human Block Zone",
    desc: "Tribal Knowledge · Regulated · 네이티브 크리티컬 패스",
    block: "차단",
    blockColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "L5",
    title: "Post-merge Observability",
    desc: "모니터링 · Feature Flag · Canary · 자동 롤백",
    block: "사후 복구",
    blockColor: "bg-sky-100 text-sky-800",
  },
];

export function SwissCheeseGate() {
  return (
    <Figure caption="Fig 2. 다층 신뢰 게이트 — 단일 LGTM 대신 L1~L5가 각각 다른 위험을 막는다">
      <div className="space-y-2">
        {layers.map((l) => (
          <div
            key={l.id}
            className="flex items-stretch gap-3 rounded-md border border-zinc-200 bg-zinc-50 overflow-hidden"
          >
            <div className="flex items-center justify-center w-14 sm:w-16 bg-teal-600 text-white font-bold text-sm flex-shrink-0">
              {l.id}
            </div>
            <div className="flex-1 min-w-0 py-2.5 sm:py-3">
              <div className="font-semibold text-sm">{l.title}</div>
              <div className="text-xs text-zinc-600 mt-0.5 leading-snug">
                {l.desc}
              </div>
            </div>
            <div className="flex items-center pr-3 sm:pr-4 flex-shrink-0">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${l.blockColor}`}
              >
                {l.block}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 mt-4 text-center">
        하나의 PR이 머지되려면 L1 → L2 → L3 → L4를 통과해야 하고, L5는 머지 후
        안전망 역할
      </p>
    </Figure>
  );
}
