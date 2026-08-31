import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://localhost:3000";
const routes = [
  "/",
  "/about",
  "/initiatives",
  "/events",
  "/team",
  "/studio",
  ...["communications", "technology", "finance", "legal", "operations"].map(
    (slug) => `/departments/${slug}`,
  ),
  ...[
    "technology-for-the-community",
    "big-ideas-built-together",
    "learning-beyond-campus",
  ].map((slug) => `/initiatives/${slug}`),
  ...[
    "a-place-to-start-building",
    "connecting-curious-minds",
    "an-idea-worth-building",
  ].map((slug) => `/events/${slug}`),
];
for (const route of routes) {
  const response = await fetch(new URL(route, origin));
  const html = await response.text();
  assert.equal(response.status, 200, `${route} should render`);
  assert.match(html, /<h1[ >]/, `${route} needs a main heading`);
  assert.doesNotMatch(
    html,
    /href="[^\"]*(?:register|join|gallery)/i,
    `${route} should not introduce excluded flows`,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  console.log(`PASS ${route}`);
}
for (const route of [
  "/gallery",
  "/departments/unknown",
  "/events/not-an-event",
  "/initiatives/not-an-initiative",
]) {
  assert.equal(
    (await fetch(new URL(route, origin))).status,
    404,
    `${route} must be a real 404`,
  );
  console.log(`PASS 404 ${route}`);
}
const preview = await fetch(new URL("/api/draft-mode/enable", origin));
assert.equal(preview.status, 503, "Unconfigured preview must fail closed");
assert.equal(
  preview.headers.get("set-cookie"),
  null,
  "No preview cookie without configuration",
);
const robots = await (await fetch(new URL("/robots.txt", origin))).text();
assert.match(robots, /Disallow: \//, "Demo content must discourage crawling");
console.log("PASS preview guard and demo robots");
