import { expect, test } from "@playwright/test";

test("the opening story scrubs its map, year and machine failure in both directions", async ({ page }) => {
  await page.goto("/");
  const opening = page.locator(".hook-machines");
  const scrub = async (local: number) => {
    await page.locator("#the-premise").evaluate((section, phase) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const distance = section.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + distance * phase / 4);
    }, local);
  };
  await scrub(.1);
  await expect(page.locator(".story-counting-machine img")).toBeVisible();
  await expect(page.locator(".story-year")).toHaveText("1880");
  await expect.poll(() => opening.evaluate(node => Number(getComputedStyle(node).getPropertyValue("--fail")))).toBe(0);
  await scrub(.45);
  await expect.poll(() => page.locator(".story-year").textContent()).not.toBe("1880");
  await expect.poll(() => opening.evaluate(node => Number(getComputedStyle(node).getPropertyValue("--scan")))).toBeGreaterThan(.9);
  await scrub(.86);
  await expect(page.locator(".story-year")).toHaveText("1980");
  await expect.poll(() => page.locator(".story-failure").evaluate(node => Number(getComputedStyle(node).opacity))).toBe(1);
  await expect(page.locator(".story-machine-scan")).toHaveCSS("opacity", "0");
  await expect(opening.getByRole("heading")).toHaveText("In 1880, the worldbuilt its first computers.");
  await expect(page.locator(".story-failure em")).toHaveText("they failed.");
  await expect.poll(() => opening.locator(".story-machine-map img").evaluateAll(images => images.length === 2 && images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.screenshot({ path: test.info().outputPath("restored-opening-scroll.png") });
  await scrub(.1);
  await expect(page.locator(".story-year")).toHaveText("1880");
  await expect.poll(() => page.locator(".story-failure").evaluate(node => Number(getComputedStyle(node).opacity))).toBe(0);
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

test("reduced motion presents every story beat as readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for(const heading of ["In 1880", "Their father left", "Three siblings follow", "But what is waiting"]){
    await expect(page.getByRole("heading", { name: new RegExp(heading) })).toBeVisible();
  }
  await expect(page.getByText("Meet the Expeditioners", {exact: true})).toHaveCount(0);
});
