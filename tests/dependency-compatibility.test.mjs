import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import * as runtime from 'react/jsx-runtime';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwind from '@tailwindcss/postcss';

const require = createRequire(import.meta.url);
const loaderRequire = createRequire(require.resolve('@mdx-js/loader'));
const { evaluate } = await import(pathToFileURL(loaderRequire.resolve('@mdx-js/mdx')));
const tailwindRequire = createRequire(require.resolve('@tailwindcss/postcss'));
const postcss = tailwindRequire('postcss');

async function renderMath(source) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  });
  return renderToStaticMarkup(runtime.jsx(Content, {}));
}

test('patched KaTeX renders inline and display MDX math with matching stylesheet', async () => {
  const html = await renderMath('Inline $x^2$.\n\n$$\n\\frac{a}{b}\n$$');
  assert.equal((html.match(/<math\b/g) ?? []).length, 2);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);
  const css = fs.readFileSync(require.resolve('katex/dist/katex.min.css'), 'utf8');
  for (const className of ['katex-display', 'katex-mathml', 'katex-html', 'katex-base']) {
    assert.match(html, new RegExp(`class="[^"]*\\b${className}\\b`));
    assert.ok(css.includes(`.${className}`), `stylesheet must style ${className}`);
  }
});

test('MDX math keeps KaTeX trust restrictions after the security override', async () => {
  const html = await renderMath('$\\href{javascript:alert(1)}{x}$\n\n$\\includegraphics{https://example.com/image.png}$');
  assert.doesNotMatch(html, /<(?:a|img)\b/);
  assert.doesNotMatch(html, /(?:href|src)="(?:javascript:|https:\/\/example\.com)/);
});

test('remark math HTML extension uses the patched KaTeX renderer', async () => {
  const mathRequire = createRequire(require.resolve('remark-math'));
  const { math, mathHtml } = await import(pathToFileURL(mathRequire.resolve('micromark-extension-math')));
  const { micromark } = await import(pathToFileURL(mathRequire.resolve('micromark')));
  const html = micromark('$x^2$\n\n$$\n\\frac{a}{b}\n$$', {
    extensions: [math()],
    htmlExtensions: [mathHtml()],
  });
  assert.equal((html.match(/<math\b/g) ?? []).length, 2);
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);
});

test('Tailwind typography builds prose styles with patched selector parser', async () => {
  const result = await postcss([tailwind()]).process(
    '@import "tailwindcss"; @plugin "@tailwindcss/typography"; @source inline("prose prose-slate");',
    { from: path.resolve('dependency-compatibility.css') },
  );
  assert.equal(result.warnings().length, 0);
  assert.match(result.css, /\.prose\s*\{/);
  assert.match(result.css, /:where\(p\)/);
  assert.match(result.css, /:where\(a\)/);
  assert.match(result.css, /:where\(pre\)/);
  assert.match(result.css, /:where\(code\)/);
  assert.match(result.css, /--tw-prose-body/);
});
