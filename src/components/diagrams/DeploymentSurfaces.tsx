import { Figure } from "./Figure";

const surfaces = [
  {
    name: "서버 / 웹",
    time: "< 1분",
    width: 4,
    gates: "L1 · L2 · L5",
    note: "관찰 기반 사후 복구 가능",
    critical: false,
  },
  {
    name: "OTA / CodePush",
    time: "수 시간",
    width: 28,
    gates: "L1 · L2 · L3",
    note: "L5 부분 의존",
    critical: false,
  },
  {
    name: "네이티브 바이너리",
    time: "수 일 (스토어 심사)",
    width: 95,
    gates: "L1 ~ L4",
    note: "결제 · 서명 · 키 관리 = L4 인간 블록 필수",
    critical: true,
  },
];

export function DeploymentSurfaces() {
  return (
    <Figure caption="Fig 6. 배포 면별 롤백 시간 — 되돌리기 비용이 클수록 배포 전 게이트(L1~L4)가 두꺼워야 한다">
      <div className="space-y-5">
        {surfaces.map((s) => (
          <div
            key={s.name}
            className={`rounded-md border p-4 ${
              s.critical
                ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            }`}
          >
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {s.name}
              </div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                필요 게이트{" "}
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                  {s.gates}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 sm:w-20 text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                롤백
              </div>
              <div className="flex-1 h-4 rounded-sm bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <div
                  className={`h-full ${
                    s.critical
                      ? "bg-zinc-900 dark:bg-zinc-100"
                      : "bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  style={{ width: `${s.width}%` }}
                />
              </div>
              <div className="w-24 sm:w-32 text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100 text-right">
                {s.time}
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 pl-19 sm:pl-23">
              {s.note}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        같은 PR이라도 어느 면(surface)에 배포되느냐에 따라 머지 게이트가 달라야
        한다
      </p>
    </Figure>
  );
}
