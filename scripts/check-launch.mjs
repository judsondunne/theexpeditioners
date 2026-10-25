/** Read-only production checks. Does not deploy, change DNS or submit URLs. */
const input = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;
if (!input) {
  console.error("Launch check needs a public origin. Run: npm run check:launch -- https://your-domain.example");
  process.exit(1);
}
const origin = new URL(input).origin;
if (!origin.startsWith("https://")) throw new Error("Production origin must use HTTPS.");
const routes = ["/", "/books", "/buy", "/books/the-treasure-of-drowned-mans-canyon", "/books/the-secret-of-king-tritons-lair", "/books/the-lost-city-of-maps", "/educators", "/explore", "/journal", "/journal/how-to-make-a-book-cipher", "/journal/what-is-steampunk-for-young-readers"];
const problems = [];
async function get(path) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) problems.push(`${path}: HTTP ${response.status}`);
  return response;
}
const robots = await (await get("/robots.txt")).text();
if (/Disallow:\s*\/\s*$/m.test(robots)) problems.push("robots.txt blocks the site.");
if (!robots.includes(`${origin}/sitemap.xml`)) problems.push("robots.txt has no sitemap for this origin.");
const sitemap = await (await get("/sitemap.xml")).text();
for (const path of routes) {
  if (!sitemap.includes(`${origin}${path}</loc>`)) problems.push(`${path}: absent from the canonical sitemap.`);
  const response = await get(path);
  const html = await response.text();
  if (/name="robots"[^>]*content="[^"]*noindex/.test(html)) problems.push(`${path}: noindex is still enabled.`);
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  let canonicalUrl;
  try { canonicalUrl = new URL(canonical?.[1] ?? "").href; } catch { /* Missing or invalid canonical. */ }
  if (canonicalUrl !== new URL(`${origin}${path}`).href) problems.push(`${path}: canonical does not match this origin.`);
  if (/http:\/\/(localhost|127\.0\.0\.1)/.test(html)) problems.push(`${path}: local URLs leaked into the page.`);
  const image = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
  if (!image) problems.push(`${path}: social preview image missing.`);
}
if (problems.length) { problems.forEach(problem => console.error(`FAIL ${problem}`));process.exitCode = 1; }
else console.log(`PASS ${routes.length} pages: HTTPS, crawl policy, sitemap, canonical URLs and social metadata. Next: submit the sitemap in the verified search accounts.`);
