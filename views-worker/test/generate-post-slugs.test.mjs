import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { generatePostSlugs, outputFile } from "../scripts/generate-post-slugs.mjs";

test("allowlist matches current content and remains checked in", () => {
  assert.equal(fs.readFileSync(outputFile, "utf8"), generatePostSlugs());
});

test("unchanged generation does not touch output or trigger Wrangler watch loops", () => {
  const before = fs.statSync(outputFile, { bigint: true }).mtimeNs;
  execFileSync(process.execPath, [fileURLToPath(new URL("../scripts/generate-post-slugs.mjs", import.meta.url))]);
  assert.equal(fs.statSync(outputFile, { bigint: true }).mtimeNs, before);
});

test("generation unions translated published files, excludes drafts, and sorts deterministically", (t) => {
  const content = fs.mkdtempSync(path.join(os.tmpdir(), "blog-slugs-"));
  t.after(() => fs.rmSync(content, { recursive: true, force: true }));
  function post(locale, slug, frontmatter = "") {
    const directory = path.join(content, locale, "posts");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, `${slug}.mdx`), `---\ntitle: Example\n${frontmatter}---\nPost`);
  }
  post("ko", "z-post");
  post("en", "z-post");
  post("en", "a-post", "draft: false\n");
  post("ko", "private-draft", "draft: true\n");
  post("en", "string-draft", "draft: 'false'\n");
  post("ko", "published-translation", "draft: true\n");
  post("en", "published-translation");
  post("fr", "unpublished-language-only");
  const source = generatePostSlugs(content);
  assert.ok(source.indexOf('"a-post"') < source.indexOf('"z-post"'));
  assert.equal(source.match(/"z-post"/g).length, 1);
  assert.ok(source.includes('"published-translation"'));
  assert.ok(!source.includes("private-draft"));
  assert.ok(!source.includes("string-draft"));
  assert.ok(!source.includes("unpublished-language-only"), "unsupported locales have no published site route");
  assert.equal(generatePostSlugs(content), source);
});

test("generation fails on missing or empty content instead of publishing a permissive fallback", (t) => {
  const content = fs.mkdtempSync(path.join(os.tmpdir(), "blog-slugs-empty-"));
  t.after(() => fs.rmSync(content, { recursive: true, force: true }));
  assert.throws(() => generatePostSlugs(content), /No published posts/);
  assert.throws(() => generatePostSlugs(path.join(content, "missing")), /ENOENT/);
});
