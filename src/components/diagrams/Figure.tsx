export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-12 relative left-1/2 -translate-x-1/2 w-[min(100vw-3rem,64rem)]">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-10 text-zinc-900 dark:text-zinc-100">
        {children}
      </div>
      <figcaption className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-3 italic">
        {caption}
      </figcaption>
    </figure>
  );
}
