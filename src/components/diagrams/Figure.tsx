export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 text-zinc-900">
        {children}
      </div>
      <figcaption className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-3 italic">
        {caption}
      </figcaption>
    </figure>
  );
}
