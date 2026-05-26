import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 7. ECC에서 ‘고정 vs 매번 새로'와 ‘공개 vs 비밀'의 안전성 매트릭스 — 사고는 거의 모두 우측 하단의 반대편(비밀 + 고정)에서 터진다.",
    headerFixed: "고정 (Fixed)",
    headerFresh: "매 세션 새로 (Fresh)",
    rowPublic: "공개 (Public)",
    rowSecret: "비밀 (Secret)",
    cells: {
      pubFixed: {
        verdict: "✓",
        title: "도메인 파라미터",
        examples: "곡선 E, base point G, 위수 n",
        note: "공개를 전제로 설계됨",
      },
      pubFresh: {
        verdict: "✓",
        title: "공개키",
        examples: "Q = dG (매 세션 새 d)",
        note: "공개 브로드캐스트 안전",
      },
      secretFixed: {
        verdict: "✗",
        title: "재사용된 비밀",
        examples: "PS3 ECDSA nonce, Static ECDH 키",
        note: "한 번의 노출로 즉사",
      },
      secretFresh: {
        verdict: "✓",
        title: "ECDHE 임시키",
        examples: "검증된 CSPRNG에서 매번 새 d",
        note: "권장 표준",
      },
    },
    bottom: "ECDH의 ‘고정' 부분은 모두에게 공개된 운동장이고, 위험은 항상 비밀이 고정되는 순간 발생한다.",
  },
  en: {
    caption: "Fig 7. ECC safety matrix — ‘fixed vs fresh' × ‘public vs secret'. Real-world ECC failures live in the bottom-left (secret + fixed).",
    headerFixed: "Fixed",
    headerFresh: "Fresh each session",
    rowPublic: "Public",
    rowSecret: "Secret",
    cells: {
      pubFixed: {
        verdict: "✓",
        title: "Domain parameters",
        examples: "Curve E, base point G, order n",
        note: "Designed to be public",
      },
      pubFresh: {
        verdict: "✓",
        title: "Public key",
        examples: "Q = dG with fresh d each session",
        note: "Safe to broadcast",
      },
      secretFixed: {
        verdict: "✗",
        title: "Reused secret",
        examples: "PS3 ECDSA nonce reuse, static ECDH key",
        note: "One leak ends the system",
      },
      secretFresh: {
        verdict: "✓",
        title: "ECDHE ephemeral key",
        examples: "Fresh d from a vetted CSPRNG",
        note: "The recommended default",
      },
    },
    bottom: "The ‘fixed' parts of ECDH are a public playground; the danger only appears the moment a secret stops being fresh.",
  },
} as const;

export function ECCSafetyMatrix({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[7rem_1fr_1fr] sm:grid-cols-[8rem_1fr_1fr] gap-px bg-zinc-200 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-3" />
          <div className="bg-zinc-50 dark:bg-zinc-900 p-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
            {s.headerFixed}
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900 p-3 text-center font-semibold text-zinc-700 dark:text-zinc-300">
            {s.headerFresh}
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-3 flex items-center font-semibold text-zinc-700 dark:text-zinc-300">
            {s.rowPublic}
          </div>
          <Cell cell={s.cells.pubFixed} />
          <Cell cell={s.cells.pubFresh} />

          <div className="bg-zinc-50 dark:bg-zinc-900 p-3 flex items-center font-semibold text-zinc-700 dark:text-zinc-300">
            {s.rowSecret}
          </div>
          <Cell cell={s.cells.secretFixed} danger />
          <Cell cell={s.cells.secretFresh} />
        </div>
      </div>
      <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {s.bottom}
      </p>
    </Figure>
  );
}

type CellData = {
  verdict: string;
  title: string;
  examples: string;
  note: string;
};

function Cell({ cell, danger = false }: { cell: CellData; danger?: boolean }) {
  return (
    <div
      className={`p-3 ${danger ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900" : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"}`}
    >
      <div className="flex items-baseline gap-2">
        <span
          className={`text-base font-bold ${danger ? "text-zinc-50 dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100"}`}
        >
          {cell.verdict}
        </span>
        <span className="font-semibold">{cell.title}</span>
      </div>
      <div
        className={`text-[11px] mt-1 leading-snug ${danger ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}
      >
        {cell.examples}
      </div>
      <div
        className={`text-[11px] mt-1 italic ${danger ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-500"}`}
      >
        {cell.note}
      </div>
    </div>
  );
}
