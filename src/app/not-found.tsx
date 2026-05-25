import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <p className="text-sm font-medium text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          페이지를 찾을 수 없어요 / Page not found
        </h1>
        <p className="mt-3 text-zinc-500 max-w-md">
          요청하신 페이지가 이동되었거나 더 이상 존재하지 않습니다.
        </p>
        <div className="mt-8 flex gap-3 text-sm">
          <Link
            href="/ko/"
            className="rounded-md px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
          >
            홈으로 (KO)
          </Link>
          <Link
            href="/en/"
            className="rounded-md px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Home (EN)
          </Link>
        </div>
      </body>
    </html>
  );
}
