import { Figure } from "./Figure";

type Locale = "ko" | "en";
type Hypothesis = "H1" | "H2" | "H3" | "H4";

type Stage = {
  id: string;
  label: string;
  sub: string;
  holdsKey?: boolean;
  marks: Hypothesis[];
};

const STRINGS = {
  ko: {
    caption:
      "Fig 4. 거래소 출금 파이프라인의 일반 구조와 네 가지 가설이 닿는 지점 — 서명기는 키를 지키지만 들어온 요청에는 서명한다. 그래서 공격의 목표는 서명기 앞단의 어느 층이 된다.",
    stages: [
      { id: "svc", label: "출금 서비스", sub: "요청 생성", marks: [] },
      { id: "policy", label: "리스크·정책 엔진", sub: "화이트리스트 · 한도", marks: ["H3"] },
      { id: "orch", label: "서명 오케스트레이터", sub: "체인별 형식 변환", marks: ["H1"] },
      { id: "signer", label: "체인별 서명기", sub: "HSM / MPC", holdsKey: true, marks: ["H2"] },
      { id: "bcast", label: "브로드캐스터", sub: "체인에 전파", marks: [] },
    ] as Stage[],
    ops: "운영 경로 — CI/CD · 클러스터 관리",
    opsSub: "위 모든 층의 코드와 설정을 바꿀 수 있다",
    legend: {
      H1: "서비스 자격증명으로 서명 API 직접 호출",
      H2: "원시 다이제스트 서명 경로 악용",
      H3: "정책 엔진 설정 조작",
      H4: "배포 경로(CI/CD) 오염",
    } as Record<Hypothesis, string>,
    keyTag: "🔑 키",
  },
  en: {
    caption:
      "Fig 4. The typical exchange withdrawal pipeline and where the four hypotheses attach — the signer protects the key but signs whatever request arrives, so the attacker's target becomes some layer in front of it.",
    stages: [
      { id: "svc", label: "Withdrawal service", sub: "creates requests", marks: [] },
      { id: "policy", label: "Risk / policy engine", sub: "whitelist · limits", marks: ["H3"] },
      { id: "orch", label: "Signing orchestrator", sub: "per-chain formats", marks: ["H1"] },
      { id: "signer", label: "Per-chain signers", sub: "HSM / MPC", holdsKey: true, marks: ["H2"] },
      { id: "bcast", label: "Broadcaster", sub: "sends to chain", marks: [] },
    ] as Stage[],
    ops: "Ops path — CI/CD · cluster management",
    opsSub: "can change code and config in every layer above",
    legend: {
      H1: "direct signing-API calls with service credentials",
      H2: "abuse of a raw-digest signing path",
      H3: "tampering with policy-engine settings",
      H4: "poisoned deployment path (CI/CD)",
    } as Record<Hypothesis, string>,
    keyTag: "🔑 key",
  },
} as const;

const HYPOTHESES: Hypothesis[] = ["H1", "H2", "H3", "H4"];

export function WithdrawalPipeline({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="max-w-4xl mx-auto">
        <ol className="flex flex-col sm:flex-row sm:items-stretch gap-1 sm:gap-0">
          {s.stages.map((st, i) => (
            <li key={st.id} className="flex flex-col sm:flex-row items-center sm:flex-1">
              <div
                className={`relative w-full rounded-md border px-2 py-3 text-center ${
                  st.holdsKey
                    ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                }`}
              >
                {st.marks.map((m) => (
                  <Badge key={m} h={m} className="absolute -top-2.5 right-1.5" />
                ))}
                <div className="text-xs sm:text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {st.label}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {st.sub}
                </div>
                {st.holdsKey && (
                  <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                    {s.keyTag}
                  </div>
                )}
              </div>
              {i < s.stages.length - 1 && (
                <span className="text-zinc-400 dark:text-zinc-600 text-lg leading-none px-1 py-0.5">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="relative mt-5 rounded-md border border-dashed border-zinc-400 dark:border-zinc-600 px-3 py-2.5 text-center">
          <Badge h="H4" className="absolute -top-2.5 right-1.5" />
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{s.ops}</div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{s.opsSub}</div>
        </div>

        <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          {HYPOTHESES.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <Badge h={h} />
              <span>{s.legend[h]}</span>
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}

function Badge({ h, className = "" }: { h: Hypothesis; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-rose-600 dark:bg-rose-500 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 leading-none ${className}`}
    >
      {h}
    </span>
  );
}
