import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

const publishedSlug = "aws-self-hosting";
const origin = "https://develicit.com";

function fixture({ current = "41", limited = false } = {}) {
  const calls = { get: [], put: [], limit: [] };
  const env = {
    VIEWS: {
      async get(key) { calls.get.push(key); return current; },
      async put(...args) { calls.put.push(args); },
    },
    VIEW_RATE_LIMITER: {
      async limit(input) { calls.limit.push(input); return { success: !limited }; },
    },
  };
  return { env, calls };
}

function request({ method = "POST", slug = publishedSlug, requestOrigin = origin, ip = "192.0.2.10", path = "/" } = {}) {
  const headers = new Headers();
  if (requestOrigin !== null) headers.set("Origin", requestOrigin);
  if (ip !== null) headers.set("CF-Connecting-IP", ip);
  return new Request(`https://counter.example${path}?slug=${encodeURIComponent(slug)}`, { method, headers });
}

for (const requestOrigin of ["https://attacker.example", null, "null", "https://develicit.com.attacker.example"]) {
  test(`POST refuses origin ${requestOrigin} before touching KV`, async () => {
    const { env, calls } = fixture();
    const response = await worker.fetch(request({ requestOrigin }), env);
    assert.equal(response.status, 403);
    assert.deepEqual(calls, { get: [], put: [], limit: [] });
    assert.equal(response.headers.has("Access-Control-Allow-Origin"), false);
  });
}

test("unknown but syntactically valid slug cannot create or read KV entries", async () => {
  for (const method of ["GET", "POST"]) {
    const { env, calls } = fixture();
    const response = await worker.fetch(request({ method, slug: "invented-security-probe" }), env);
    assert.equal(response.status, 404);
    assert.deepEqual(calls, { get: [], put: [], limit: [] });
  }
});

test("limiter refuses writes before any KV access and gives retry hint", async () => {
  const { env, calls } = fixture({ limited: true });
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.deepEqual(calls.get, []);
  assert.deepEqual(calls.put, []);
  assert.equal(calls.limit.length, 1);
});

for (const failure of ["missing", "throwing", "malformed"]) {
  test(`limiter ${failure} fails closed without touching KV`, async () => {
    const { env, calls } = fixture();
    if (failure === "missing") delete env.VIEW_RATE_LIMITER;
    if (failure === "throwing") env.VIEW_RATE_LIMITER.limit = async () => { throw new Error("limiter failure"); };
    if (failure === "malformed") env.VIEW_RATE_LIMITER.limit = async () => ({});
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 503);
    assert.deepEqual(calls.get, []);
    assert.deepEqual(calls.put, []);
  });
}

test("missing trusted client IP fails closed", async () => {
  const { env, calls } = fixture();
  const response = await worker.fetch(request({ ip: null }), env);
  assert.equal(response.status, 503);
  assert.deepEqual(calls, { get: [], put: [], limit: [] });
});

test("valid published POST retains count contract and hides IP from limiter key", async () => {
  const { env, calls } = fixture();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { views: 42 });
  assert.deepEqual(calls.get, [publishedSlug]);
  assert.deepEqual(calls.put, [[publishedSlug, "42"]]);
  assert.match(calls.limit[0].key, /^views:\d{4}-\d{2}-\d{2}:[a-f0-9]{64}$/);
  assert.ok(!calls.limit[0].key.includes("192.0.2.10"));
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("rate bucket covers all posts for the same IP, separates other IPs", async () => {
  const { env, calls } = fixture();
  await worker.fetch(request(), env);
  await worker.fetch(request({ slug: "heap-feng-shui" }), env);
  await worker.fetch(request({ ip: "192.0.2.11" }), env);
  assert.equal(calls.limit[0].key, calls.limit[1].key);
  assert.notEqual(calls.limit[0].key, calls.limit[2].key);
});

test("GET needs no Origin, IP, or limiter and does not write", async () => {
  const { env, calls } = fixture({ current: null });
  delete env.VIEW_RATE_LIMITER;
  const response = await worker.fetch(request({ method: "GET", requestOrigin: null, ip: null }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { views: 0 });
  assert.deepEqual(calls.put, []);
  assert.deepEqual(calls.limit, []);
  assert.equal(response.headers.has("Access-Control-Allow-Origin"), false);
});

test("www origin and approved preflight preserve browser access", async () => {
  const { env, calls } = fixture();
  const response = await worker.fetch(request({ method: "OPTIONS", requestOrigin: "https://www.develicit.com" }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://www.develicit.com");
  assert.equal(response.headers.get("Vary"), "Origin");
  assert.deepEqual(calls, { get: [], put: [], limit: [] });
});

test("foreign preflight and unsupported methods are refused without storage", async () => {
  const { env, calls } = fixture();
  assert.equal((await worker.fetch(request({ method: "OPTIONS", requestOrigin: "https://attacker.example" }), env)).status, 403);
  const response = await worker.fetch(request({ method: "DELETE" }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "GET, POST, OPTIONS");
  assert.deepEqual(calls, { get: [], put: [], limit: [] });
});

test("invalid slug and unknown route are refused without storage", async () => {
  const { env, calls } = fixture();
  for (const slug of ["", "../escape", "x".repeat(129)]) {
    assert.equal((await worker.fetch(request({ slug }), env)).status, 400);
  }
  assert.equal((await worker.fetch(request({ path: "/unrecognized" }), env)).status, 404);
  assert.deepEqual(calls, { get: [], put: [], limit: [] });
});

test("KV failure returns bounded error without exposing backend details", async () => {
  const { env } = fixture();
  env.VIEWS.get = async () => { throw new Error("private backend detail"); };
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "internal" });
});

test("corrupt count is never rewritten or serialized as null", async () => {
  for (const current of ["not-a-number", "2garbage", "-1", "9007199254740991"]) {
    const { env, calls } = fixture({ current });
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 500);
    assert.deepEqual(calls.put, []);
  }
});
