import { expect, test } from "@playwright/test";

test("the refined story preserves scroll choreography with five scenes and a typeset newspaper", async ({ page }) => {
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
  const newspaper = section.getByRole("article", { name: "An imagined newspaper from the world of the story" });
  await expect(newspaper.getByRole("heading", { name: /Alexander West.*Presumed Dead/ })).toBeVisible();
  await expect(newspaper.getByText("The Realm Gazette", { exact: true })).toBeVisible();
  const paperBounds = await newspaper.boundingBox();
  const skipBounds = await section.getByRole("link", { name: "Skip the story" }).boundingBox();
  expect(paperBounds!.y).toBeGreaterThan(skipBounds!.y + skipBounds!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  await expect(section.getByText(/Kit, the brain|M.K., the tinkerer|Zander, the brave|Via telegraph|Wood engraving|Public domain|Scientific American/)).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("newspaper-scene.png") });
  await scrub((1.35 + 1 + 1.25 + .7) / 5.85);
  await expect(section.locator('[data-panel="3"] svg path')).toBeVisible();
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
