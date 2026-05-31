import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption:
      "Fig 2. 힙 펭수이 파이프라인 — corruption primitive를 신뢰성 있는 코드 실행으로 끌어올리는 7단계.",
    note: "1~4 단계가 ‘배치 제어' (deterministic 만들기), 5~7 단계가 ‘primitive 활용' (실제 익스플로잇).",
    phaseSetup: "배치 제어",
    phaseExploit: "primitive 활용",
    steps: [
      { id: "1", title: "Defragmentation", body: "빈 hole을 채워 힙 단편화 해소" },
      { id: "2", title: "Hole 생성", body: "타겟 크기의 free slot 확보" },
      { id: "3", title: "Victim 할당", body: "취약 객체를 정확한 위치에 배치" },
      { id: "4", title: "Adjacent placement", body: "공격자 제어 객체를 인접 슬롯에" },
      { id: "5", title: "Trigger", body: "UAF / overflow / double-free 트리거" },
      { id: "6", title: "Corruption", body: "메타데이터 · vtable · fn ptr 덮어쓰기" },
      { id: "7", title: "Pwned", body: "임의 R/W 또는 RIP 제어" },
    ],
  },
  en: {
    caption:
      "Fig 2. The heap-feng-shui pipeline — seven stages from corruption primitive to reliable code execution.",
    note: "Steps 1–4 control placement (turning the heap deterministic); steps 5–7 use the primitive (the actual exploit).",
    phaseSetup: "Placement control",
    phaseExploit: "Primitive use",
    steps: [
      { id: "1", title: "Defragmentation", body: "Fill holes to compact the heap" },
      { id: "2", title: "Hole creation", body: "Free a target-sized slot deliberately" },
      { id: "3", title: "Victim alloc", body: "Place vulnerable object in the slot" },
      { id: "4", title: "Adjacent placement", body: "Attacker-controlled object next to it" },
      { id: "5", title: "Trigger", body: "Fire UAF / overflow / double-free" },
      { id: "6", title: "Corruption", body: "Overwrite metadata · vtable · fn ptr" },
      { id: "7", title: "Pwned", body: "Arbitrary R/W or RIP control" },
    ],
  },
} as const;

export function HeapFengShuiPipeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  const setupSteps = s.steps.slice(0, 4);
  const exploitSteps = s.steps.slice(4);
  return (
    <Figure caption={s.caption}>
      <div className="space-y-6">
        <Row label={s.phaseSetup} tone="setup" steps={setupSteps} />
        <Row label={s.phaseExploit} tone="exploit" steps={exploitSteps} />
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.note}
      </p>
    </Figure>
  );
}

function Row({
  label,
  tone,
  steps,
}: {
  label: string;
  tone: "setup" | "exploit";
  steps: ReadonlyArray<{ id: string; title: string; body: string }>;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
        {label}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`rounded-md border p-3 ${tone === "setup" ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950" : "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900"}`}
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`font-mono text-[10px] font-bold ${tone === "setup" ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-300 dark:text-zinc-600"}`}
              >
                {step.id}
              </span>
              <span className="font-bold text-sm">{step.title}</span>
            </div>
            <p
              className={`text-xs leading-snug mt-1 ${tone === "setup" ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-300 dark:text-zinc-600"}`}
            >
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
