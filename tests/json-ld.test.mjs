import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../src/lib/json-ld.ts";

test("JSON-LD cannot close its script element or introduce HTML", () => {
  const data = {
    "@type": "Article",
    headline: '</ScRiPt><script src="https://attacker.invalid/x.js"></script>',
    description: '<!--<img src=x onerror="alert(1)">',
    nested: [{ text: "한국어 < 3 & > 1" }],
  };
  const serialized = serializeJsonLd(data);

  // HTML raw-text parsing recognizes closing tags before parsing JSON.
  assert.ok(!serialized.includes("<"), "no literal HTML tag opener may survive");
  assert.deepEqual(JSON.parse(serialized), data, "structured data is unchanged");
});

test("JSON-LD arrays retain valid JSON and literal escape sequences", () => {
  const data = [
    { "@type": "BreadcrumbList", name: 'quotes: " \\ and literal \\u003c' },
    { name: "normal title", value: 42, enabled: true, optional: null },
  ];
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});
