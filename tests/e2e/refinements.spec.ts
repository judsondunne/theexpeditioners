import { expect, test } from "@playwright/test";

test("the story preserves five scenes, original book art and a moving airship", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#the-premise");
  await expect(section.locator("[data-panel]")).toHaveCount(5);
  const opening = section.locator('[data-panel="0"]');
  const year = opening.locator("span.display");
  const scrub = async (progress: number) => {
    await section.evaluate((node, phase) => {
      const top = node.getBoundingClientRect().top + window.scrollY;
      const distance = node.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + distance * phase);
    }, progress);
  };
  await scrub(.1 * 1.35 / 5.85);
  await expect(year).toHaveText("1880");
  await scrub(.86 * 1.35 / 5.85);
  await expect(year).toHaveText("1980");
  await expect(opening.locator(".opening-failure")).toHaveCSS("opacity", "1");
  await expect(opening.locator(".h-px.bg-signal")).toHaveCSS("opacity", "0");
  await expect.poll(() => opening.locator("img").evaluateAll(images => images.length === 3 && images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.screenshot({ path: test.info().outputPath("original-scroll-machines.png") });
  const heading = await opening.getByRole("heading").boundingBox();
  expect(heading).not.toBeNull();
  expect(Math.abs(heading!.x + heading!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(4);
  await scrub((1.35 + 1 + .7 * 1.25) / 5.85);
  await expect(section.getByText("The Realm Gazette", { exact: true })).toHaveCount(0);
  const illustration = section.getByRole("img", { name: "Katherine Roy’s illustration of Kit and the man with a clockwork hand" });
  await expect(illustration).toBeVisible();
  const artBounds = await illustration.boundingBox();
  const skipBounds = await section.getByRole("link", { name: "Skip the story" }).boundingBox();
  expect(artBounds!.y).toBeGreaterThan(skipBounds!.y + skipBounds!.height);
  if (page.viewportSize()!.width >= 768) {
    const rail = section.locator(".story-rail-airship");
    const direction = await rail.evaluate(node => { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); return { a: matrix.a, b: matrix.b }; });
    expect(Math.abs(direction.a)).toBeLessThan(.01);
    expect(direction.b).toBeGreaterThan(.99);
    const railY = (await rail.boundingBox())!.y;
    await scrub(.9);
    await expect.poll(async () => (await rail.boundingBox())!.y).toBeGreaterThan(railY + 20);
    await scrub((1.35 + 1 + .7 * 1.25) / 5.85);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await expect(section.getByText(/Kit, the brain|M.K., the tinkerer|Zander, the brave|Via telegraph|Wood engraving|Public domain|Scientific American/)).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("clockwork-hand-scene.png") });
  await scrub((1.35 + 1 + 1.25 + .7) / 5.85);
  await expect(section.locator('[data-panel="3"] svg')).toHaveCount(0);
  await expect(section.locator('[data-panel="3"] img')).toHaveAttribute("src", /canyon-framed/);
  await scrub(.98);
  await expect(section.locator('[data-panel="4"]').getByRole("link", { name: "Find out in Book One" })).toBeVisible();
  await scrub(.1 * 1.35 / 5.85);
  await expect(year).toHaveText("1880");
});

// These guard the two interaction regressions called out in the design review.
test("shelf changes on activation, never on hover", async ({ page }) => {
  await page.goto("/#trilogy");
  const tabs = page.getByRole("tab");
  await tabs.nth(1).hover();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "false");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: /king triton/i })).toBeVisible();
  await tabs.first().hover();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("3D canyon camera, location selection and original map all work", async ({ page }) => {
  const errors: string[]=[];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/explore#map-room");
  const scene = page.locator(".canyon-viewport");
  const zoom = page.getByRole("button", { name: "Zoom in", exact: true });
  await expect(zoom).toBeEnabled();
  await expect(scene.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".canyon-index button")).toHaveCount(10);
  const before = await scene.screenshot();
  await page.getByRole("button", { name: "Ghost Falls", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ghost Falls", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".canyon-caption")).toContainText("Ghost Falls");
  await expect.poll(async () => (await scene.screenshot()).equals(before)).toBe(false);
  await scene.scrollIntoViewIfNeeded();
  const canvas = scene.locator("canvas");
  const beforeWheel = await canvas.screenshot();
  await canvas.hover({ position: { x: 40, y: 40 } });
  await page.mouse.wheel(0, -450);
  await expect.poll(async () => (await canvas.screenshot()).equals(beforeWheel)).toBe(false);
  await zoom.click();
  await page.getByRole("button", { name: "View canyon from above" }).click();
  await page.getByRole("button", { name: "Reset canyon view" }).click();
  await expect(page.getByRole("button", { name: "Ghost Falls", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Original map", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reset", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "3D relief", exact: true }).click();
  await expect(zoom).toBeEnabled();
  await expect(scene.locator("canvas")).toHaveCount(1);
  await page.locator(".canyon-room").screenshot({ path: test.info().outputPath("canyon-preview.png") });
  expect(errors).toEqual([]);
});

test("the canyon falls back to the usable original map without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, context: string, ...args: unknown[]) {
      if(context.includes("webgl")) return null;
      return getContext.apply(this, [context, ...args] as Parameters<typeof getContext>);
    } as typeof getContext;
  });
  await page.goto("/explore#map-room");
  await expect(page.getByRole("status")).toContainText("3D view is unavailable");
  const ghost=page.getByRole("button", { name: "Ghost Falls", exact: true });
  await ghost.click();
  await expect(ghost).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion presents all revised story beats as readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const story = page.locator("#the-premise");
  await expect(story.locator("ol > li")).toHaveCount(4);
  for (const text of ["In 1880, the world built its first computers.", "Strange lands turned up", "A man with a clockwork hand.", "With government agents on their trail"]){
    await expect(story.getByText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeVisible();
  }
  await expect(story.getByRole("link", { name: "Find out in Book One" })).toBeVisible();
});


test("the homepage uses original lettering and award graphics, with clean map chrome", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header .series-wordmark").first()).toBeVisible();
  await expect(page.locator(".hero-praise .award-ribbon")).toHaveCount(3);
  await expect(page.locator(".hero-praise .award-art img")).toHaveCount(0);
  await expect(page.locator(".award-gallery .award-art img").first()).toHaveAttribute("src", /texas-bluebonnet/);
  const quote = await page.locator(".hero-praise .review-plate").boundingBox();
  expect(quote!.height).toBeLessThan(270);
  const logo = await page.locator("header .series-wordmark").first().boundingBox();
  expect(logo!.y).toBeGreaterThanOrEqual(0);
  expect(logo!.y + logo!.height).toBeLessThanOrEqual(68);
  await expect(page.locator(".footer-engraving-lineup > span")).toHaveCount(9);
  await expect(page.locator(".canyon-room--compact .canyon-toolbar")).toHaveCount(0);
  await expect(page.locator(".canyon-room--compact .canyon-caption")).toHaveCount(0);
  await expect(page.getByText("Begin at the beginning", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/All for Book One/)).toHaveCount(0);
  const details = page.getByRole("tabpanel").first();
  const tabs = page.getByRole("tablist");
  const order = await details.evaluate((panel) => {
    const tabs = document.querySelector('[role="tablist"]');
    return Boolean(tabs && panel.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(order).toBe(true);
  await expect(tabs).toHaveCount(1);
});

test("about contains both biographies and book lists, and credits have their own page", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Sarah Stewart Taylor", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Books by Katherine Roy", exact: true })).toBeVisible();
  await expect(page.getByText(/also known as|One writer, two names|is the name Sarah Stewart Taylor writes under/)).toHaveCount(0);
  await expect(page.locator("#credits")).toHaveCount(0);
  await expect(page.getByText(/Portrait from|Biography based on|Biography adapted from|Book lists checked against/)).toHaveCount(0);
  await expect(page.locator(".creator-portrait")).toHaveCount(2);
  await expect(page.locator(".creator-shelf img")).toHaveCount(25);
  await expect(page.locator(".creator-collection")).toHaveCount(8);
  const covers = page.locator(".creator-shelf img");
  for (const cover of await covers.all()) {
    await cover.scrollIntoViewIfNeeded();
    await expect.poll(() => cover.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await page.getByRole("navigation", { name: "Footer", exact: true }).getByRole("link", { name: "Image credits" }).click();
  await expect(page).toHaveURL(/\/credits$/);
  await expect(page.getByRole("heading", { name: "Pictures on this site", exact: true })).toBeVisible();
});


test("creator books lift on focus and stay still with reduced motion", async ({ page }) => {
  await page.goto("/about");
  const book = page.locator(".creator-book-link").first();
  await book.scrollIntoViewIfNeeded();
  const resting = await book.locator(".creator-book").evaluate(node => getComputedStyle(node).transform);
  await book.focus();
  await expect.poll(() => book.locator(".creator-book").evaluate(node => getComputedStyle(node).transform)).not.toBe(resting);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(book.locator(".creator-book")).toHaveCSS("transform", "none");
});


test("all nine footer engravings fit at phone, tablet and desktop widths", async ({ page }) => {
  await page.goto("/");
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const icons = await page.locator(".footer-engraving-lineup > span").evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return {left: r.left, right: r.right, width: r.width}; }));
    expect(icons).toHaveLength(9);
    for (const icon of icons) { expect(icon.left).toBeGreaterThanOrEqual(0); expect(icon.right).toBeLessThanOrEqual(width); expect(icon.width).toBeGreaterThan(20); }
  }
});
