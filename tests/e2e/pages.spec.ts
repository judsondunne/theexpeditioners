import { expect, test } from "@playwright/test";
import { routes } from "../routes";

for (const path of routes) {
  test(`${path} renders with sound metadata`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(90);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description && description.length).toBeGreaterThan(50);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`${path === "/" ? "/?" : path}$`));
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    // every JSON-LD block is valid JSON with a schema.org context
    for (const block of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      const data = JSON.parse(block);
      for (const item of Array.isArray(data) ? data : [data]) expect(item["@context"]).toBe("https://schema.org");
    }
  });
}

test("titles and descriptions are unique across pages", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
});

test("unknown routes return a real 404 with a way home", async ({ page }) => {
  const res = await page.goto("/books/book-four");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn’t on any map");
  await expect(page.getByRole("link", { name: /back to the homepage/i })).toBeVisible();
});

test("book pages carry Book structured data with an ISBN and series position", async ({ page }) => {
  await page.goto("/books/the-treasure-of-drowned-mans-canyon");
  const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
  const book = blocks.flat().find((b) => b["@type"] === "Book");
  expect(book.isbn).toBe("9780960083503");
  expect(book.position).toBe(1);
  expect(book).not.toHaveProperty("aggregateRating");
  expect(book).not.toHaveProperty("offers");
});

test("sitemap lists every route; robots blocks non-production builds", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of routes) expect(sitemap).toContain(path === "/" ? "<loc>" : `${path}</loc>`);
  expect(sitemap).not.toContain("field-sheet");
  const robots = await (await request.get("/robots.txt")).text();
  if (!process.env.SITE_INDEXABLE) expect(robots).toMatch(/Disallow: \//);
});

test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of routes) {
    await page.goto(path);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
    for (const h of hrefs) seen.add(h.split("#")[0] || "/");
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});

test("retailer links are labelled and open safely", async ({ page }) => {
  await page.goto("/books/the-treasure-of-drowned-mans-canyon#buy");
  const links = page.locator("#buy a[target=_blank]");
  expect(await links.count()).toBeGreaterThanOrEqual(3);
  for (const l of await links.all()) {
    expect(await l.getAttribute("rel")).toContain("noopener");
    expect(await l.getAttribute("href")).toMatch(/^https:\/\//);
  }
});
