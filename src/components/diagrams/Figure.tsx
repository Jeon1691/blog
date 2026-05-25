export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8 text-zinc-900 dark:text-zinc-100">
        {children}
      </div>
      <figcaption className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-3 italic">
        {caption}
      </figcaption>
    </figure>
  );
}
