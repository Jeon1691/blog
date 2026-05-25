import { Figure } from "./Figure";

const phases = [
  {
    id: "0",
    duration: "2주",
    title: "측정",
    body: "DORA 4 keys + 리뷰 메트릭 + Churn 기준선 수집",
    done: "Baseline 대시보드 확보",
  },
  {
    id: "1",
    duration: "1개월",
    title: "PR 템플릿 + AI 리뷰",
    body: "Intent/AC/Evidence 템플릿 강제, L2 AI Code Review 도입",
    done: "구문·스타일 코멘트 80% ↓",
  },
  {
    id: "2",
    duration: "2개월",
    title: "Spec/Intent 파일럿",
    body: "코딩 전 수용 기준 리뷰 (1~2개 팀 한정)",
    done: "Spec-to-Code Drift 측정 가능",
  },
  {
    id: "3",
    duration: "지속",
    title: "Human Block Zone",
    body: "크리티컬 패스만 인간 차단, 그 외는 자동 승인",
    done: "리뷰 대기 시간 50% ↓",
  },
];

export function PhaseRoadmap() {
  return (
    <Figure caption="Fig 1. 4단계 전환 로드맵 — 측정 → AI 1차 리뷰 → Spec 파일럿 → Human Block Zone 분리">
      <div className="relative">
        <div className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-zinc-200" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-3 relative">
          {phases.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {p.id}
              </div>
              <div className="mt-3 inline-flex rounded-full bg-teal-50 text-teal-700 px-2.5 py-0.5 text-xs font-semibold tracking-tight">
                {p.duration}
              </div>
              <div className="mt-2 font-bold text-sm">{p.title}</div>
              <p className="mt-2 text-xs text-zinc-600 leading-snug">
                {p.body}
              </p>
              <div className="mt-3 text-xs text-zinc-500 leading-snug">
                <span className="font-medium text-zinc-700">Done.</span>{" "}
                {p.done}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
