import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Wide tables scroll sideways on small screens instead of crushing their columns.
    table: (props) => (
      <div className="table-scroll" tabIndex={0} role="region" aria-label="table">
        <table {...props} />
      </div>
    ),
    ...components,
  };
}
