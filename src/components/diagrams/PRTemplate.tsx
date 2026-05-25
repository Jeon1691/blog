import { Figure } from "./Figure";

type Locale = "ko" | "en";

const STRINGS = {
  ko: {
    caption: "Fig 4. 새 PR 설명 템플릿 — Intent에서 Rollback까지 6개 필드를 채워야 머지 가능",
    prTitle: "feat(auth): add wallet.read OAuth scope",
    sections: [
      {
        h: "Intent",
        sub: "무엇을, 왜 바꾸는가",
        body: "결제 페이지 진입 시 신규 사용자에게 403이 발생하는 문제 해결. 신규 OAuth scope `wallet.read`를 추가해 권한 흐름을 통일한다.",
      },
      {
        h: "Acceptance Criteria",
        sub: "통과 기준 (Given/When/Then)",
        body: "- [ ] 신규 가입자가 결제 진입 시 403 미발생\n- [ ] 기존 토큰은 그대로 동작 (역호환)\n- [ ] 권한 누락 시 명시적 에러 코드 `E_SCOPE_MISSING` 반환",
      },
      {
        h: "Constraints / Non-goals",
        sub: "건드리지 않아야 할 영역",
        body: "× OAuth 클라이언트 ID 변경 없음\n× 세션 쿠키 이름 그대로\n× 결제 트랜잭션 로직 미수정",
      },
      {
        h: "Verification Evidence",
        sub: "재현 가능한 증거",
        body: "▸ Unit 8/8 통과 (CI #482)\n▸ Staging E2E 녹화: link\n▸ DB migration dry-run 로그: link",
      },
      {
        h: "AI Co-author / Risk Zone",
        sub: "AI 생성과 사람 검증의 경계",
        body: "AI 80% — 보일러플레이트, 테스트 케이스\n사람 검증: scope 매핑 로직, 만료 처리",
      },
      {
        h: "Rollback Plan",
        sub: "되돌리기 절차",
        body: "Feature flag `auth_v2` off → 30초 내 원복\nDB migration은 backward-compat, drop은 v+2에서",
      },
    ],
  },
  en: {
    caption: "Fig 4. The new PR description template — 6 fields from Intent through Rollback that must be filled before merge",
    prTitle: "feat(auth): add wallet.read OAuth scope",
    sections: [
      {
        h: "Intent",
        sub: "What is changing and why",
        body: "Fix 403 thrown to new users hitting the payments page. Add OAuth scope `wallet.read` so authorization flows match.",
      },
      {
        h: "Acceptance Criteria",
        sub: "Pass criteria (Given/When/Then)",
        body: "- [ ] New signups no longer 403 on payments entry\n- [ ] Existing tokens keep working (backward compatible)\n- [ ] Missing scope returns explicit `E_SCOPE_MISSING`",
      },
      {
        h: "Constraints / Non-goals",
        sub: "What this PR will not touch",
        body: "× OAuth client IDs unchanged\n× Session cookie names unchanged\n× Payment transaction logic unchanged",
      },
      {
        h: "Verification Evidence",
        sub: "Reproducible evidence",
        body: "▸ Unit 8/8 passing (CI #482)\n▸ Staging E2E recording: link\n▸ DB migration dry-run log: link",
      },
      {
        h: "AI Co-author / Risk Zone",
        sub: "Where AI-generated and human-verified code meet",
        body: "AI 80% — boilerplate, test cases\nHuman-verified: scope mapping logic, expiration handling",
      },
      {
        h: "Rollback Plan",
        sub: "How to revert",
        body: "Toggle feature flag `auth_v2` off → reverts within 30s\nDB migration backward-compatible; drop in v+2",
      },
    ],
  },
} as const;

export function PRTemplate({ locale = "ko" }: { locale?: Locale }) {
  const s = STRINGS[locale];
  return (
    <Figure caption={s.caption}>
      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-zinc-500 dark:text-zinc-400">
            PR #1234 ·{" "}
            <span className="text-zinc-700 dark:text-zinc-300 font-mono">
              {s.prTitle}
            </span>
          </span>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {s.sections.map((section, i) => (
            <div key={section.h} className="px-4 sm:px-5 py-4">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="text-[10px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  ## {section.h}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {section.sub}
                </span>
              </div>
              <div className="pl-8 text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed font-mono">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
