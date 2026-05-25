import { notFound } from "next/navigation";
import { isLocale, getDictionary } from "@/lib/locales";

export default async function About({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const body =
    lang === "ko" ? (
      <>
        <p>
          안녕하세요. 이곳은 개인 기술 블로그{" "}
          <strong>{dict.siteName}</strong>입니다. 아래는 저와 작업 방식에 대한
          정리입니다.
        </p>

        <h2>Role</h2>
        <ul>
          <li>
            <strong>Role</strong>: Android/iOS Engineer · System Architect
          </li>
          <li>
            <strong>Timezone</strong>: KST (UTC+9)
          </li>
        </ul>

        <h2>Summary</h2>
        <p>
          Mobile(Android/iOS) 개발 + 시스템/앱 아키텍처 설계 + 블록체인 지갑
          개발.
        </p>
        <ul>
          <li>
            커뮤니케이션: <strong>Slack/문서 우선, 구두 최소화</strong>
          </li>
          <li>
            원칙: <strong>가장 효율적인 방법 선택</strong>
          </li>
        </ul>

        <h2>Responsibilities</h2>
        <ul>
          <li>Android/iOS feature delivery</li>
          <li>Architecture: 모듈화, 경계/의존성 관리, 확장성/유지보수성</li>
          <li>Stability & Performance: Crash/ANR, Memory, Networking</li>
          <li>
            블록체인 지갑(Wallet) 설계·구현 — 키 관리, 서명 흐름, dApp 연동
            (WalletConnect 등)
          </li>
          <li>기술부채/레거시 개선</li>
        </ul>

        <h2>Working with me</h2>

        <h3>Contact</h3>
        <ul>
          <li>
            <strong>기본</strong>: Slack DM + 관련 링크
          </li>
          <li>
            <strong>중요한 결정/배경</strong>: Confluence / Design Document
          </li>
        </ul>

        <h3>Fast path</h3>
        <p>요청 시 다음이 함께 오면 처리 속도가 빨라집니다.</p>
        <ol>
          <li>
            <strong>Goal / Deadline</strong>
          </li>
          <li>
            <strong>Context</strong> — 왜 지금인지, 영향 범위
          </li>
          <li>
            <strong>Repro Steps</strong> + Logs / Screenshots
          </li>
          <li>
            <strong>Constraints</strong> — 성능 / 보안 / 호환성
          </li>
          <li>
            <strong>Options</strong> — 있으면
          </li>
        </ol>

        <h3>Communication / Decisions</h3>
        <p>
          선호 포맷: <strong>결론 → 근거 → 옵션 → 추천안</strong>
        </p>
        <p>
          논쟁이 길어지면: 옵션 정리 → 기준 합의 → 담당자 결정 → 문서에 기록.
        </p>

        <h3>PR</h3>
        <ul>
          <li>
            <strong>AI PR 선호</strong>
          </li>
          <li>
            사람이 해야 한다면 <strong>작은 PR</strong> 선호 — Review / Risk /
            Revert 비용이 낮음
          </li>
        </ul>

        <h3>Meetings</h3>
        <p>
          <strong>Agenda + 질문을 먼저 공유.</strong>
        </p>

        <h2>Can help with</h2>
        <ul>
          <li>Mobile App</li>
          <li>System Architecture</li>
          <li>Performance & Stability</li>
          <li>Blockchain Wallet (Key Management · Signing · dApp 연동)</li>
        </ul>

        <h2>Links</h2>
        <ul>
          <li>
            <strong>Telegram</strong>:{" "}
            <a
              href="https://t.me/develicit"
              target="_blank"
              rel="noopener noreferrer"
            >
              @develicit
            </a>
          </li>
        </ul>
      </>
    ) : (
      <>
        <p>
          Hi — this is <strong>{dict.siteName}</strong>, a personal engineering
          blog. Below is a quick summary of how I work.
        </p>

        <h2>Role</h2>
        <ul>
          <li>
            <strong>Role</strong>: Android/iOS Engineer · System Architect
          </li>
          <li>
            <strong>Timezone</strong>: KST (UTC+9)
          </li>
        </ul>

        <h2>Summary</h2>
        <p>
          Mobile (Android/iOS) development + system/app architecture design +
          blockchain wallet development.
        </p>
        <ul>
          <li>
            Communication: <strong>Slack / docs first, voice minimized</strong>
          </li>
          <li>
            Principle: <strong>pick the most efficient approach</strong>
          </li>
        </ul>

        <h2>Responsibilities</h2>
        <ul>
          <li>Android/iOS feature delivery</li>
          <li>
            Architecture: modularity, boundary &amp; dependency management,
            scalability &amp; maintainability
          </li>
          <li>Stability &amp; Performance: Crash/ANR, Memory, Networking</li>
          <li>
            Blockchain wallet design &amp; implementation — key management,
            signing flows, dApp integrations (WalletConnect, etc.)
          </li>
          <li>Tech debt / legacy improvement</li>
        </ul>

        <h2>Working with me</h2>

        <h3>Contact</h3>
        <ul>
          <li>
            <strong>Default</strong>: Slack DM + relevant links
          </li>
          <li>
            <strong>Important decisions / context</strong>: Confluence / Design
            Document
          </li>
        </ul>

        <h3>Fast path</h3>
        <p>Including the following with your request speeds things up.</p>
        <ol>
          <li>
            <strong>Goal / Deadline</strong>
          </li>
          <li>
            <strong>Context</strong> — why now, scope of impact
          </li>
          <li>
            <strong>Repro Steps</strong> + Logs / Screenshots
          </li>
          <li>
            <strong>Constraints</strong> — performance / security / compatibility
          </li>
          <li>
            <strong>Options</strong> — if you have any
          </li>
        </ol>

        <h3>Communication / Decisions</h3>
        <p>
          Preferred format:{" "}
          <strong>conclusion → rationale → options → recommendation</strong>
        </p>
        <p>
          When debates drag on: list options → agree on criteria → owner
          decides → record in docs.
        </p>

        <h3>PR</h3>
        <ul>
          <li>
            <strong>AI PR preferred</strong>
          </li>
          <li>
            If a human must do it, <strong>small PRs</strong> preferred — Review
            / Risk / Revert cost is lower
          </li>
        </ul>

        <h3>Meetings</h3>
        <p>
          <strong>Share agenda + questions first.</strong>
        </p>

        <h2>Can help with</h2>
        <ul>
          <li>Mobile App</li>
          <li>System Architecture</li>
          <li>Performance &amp; Stability</li>
          <li>
            Blockchain Wallet (key management · signing · dApp integrations)
          </li>
        </ul>

        <h2>Links</h2>
        <ul>
          <li>
            <strong>Telegram</strong>:{" "}
            <a
              href="https://t.me/develicit"
              target="_blank"
              rel="noopener noreferrer"
            >
              @develicit
            </a>
          </li>
        </ul>
      </>
    );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        {dict.nav.about}
      </h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">{body}</div>
    </div>
  );
}
