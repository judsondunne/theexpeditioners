import { expect, test } from "@playwright/test";

declare global {
  interface Window { motionAudit: { frames: number; contexts: number; losses: number } }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.motionAudit = { frames: 0, contexts: 0, losses: 0 };
    const request = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => request(time => {
      window.motionAudit.frames++;
      callback(time);
    });
    const seen = new WeakSet();
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, ...args: Parameters<typeof get>) {
      const context = get.apply(this, args);
      if (context && String(args[0]).includes("webgl") && !seen.has(context)) {
        seen.add(context);
        window.motionAudit.contexts++;
        this.addEventListener("webglcontextlost", () => window.motionAudit.losses++);
      }
      return context;
    } as typeof get;
  });
});

test("book motion suspends offscreen and resumes with one graphics context", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#the-premise [data-panel]")).toHaveCount(5);
  await page.locator("#trilogy").scrollIntoViewIfNeeded();
  const canvas = page.locator("#trilogy canvas");
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => window.motionAudit.contexts)).toBe(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  // Wait for any queued scroll/resize work to settle, then require a quiet window.
  // A renderer that keeps scheduling offscreen can never satisfy this assertion.
  await expect.poll(async () => {
    await page.evaluate(() => window.motionAudit.frames = 0);
    await page.waitForTimeout(250);
    return page.evaluate(() => window.motionAudit.frames);
  }).toBe(0);
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.motionAudit.frames)).toBeGreaterThan(3);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    window.motionAudit.frames = 0;
  });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.motionAudit.frames)).toBe(0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => page.evaluate(() => window.motionAudit.frames)).toBeGreaterThan(3);
  await expect(page.getByText("Critical acclaim", { exact: true })).toHaveCount(0);
});

test("book graphics release their context on navigation and retain the cover after context loss", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/books/the-treasure-of-drowned-mans-canyon");
  const canvas = page.locator("main canvas");
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => window.motionAudit.contexts)).toBe(1);
  await page.locator("header a[href='/']").first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.motionAudit.losses)).toBe(1);
  await page.goBack();
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  await canvas.evaluate(node => (node as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext());
  await expect(canvas).toHaveCount(0);
  await expect(page.getByText("Drag to turn the book over", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("img", { name: /^Cover of The Expeditioners/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("browser toolbar height changes do not jump the pinned story progress", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#the-premise");
  await expect(section.locator(".sticky")).toBeAttached();
  await section.evaluate(node => {
    const stage = node.querySelector<HTMLElement>(".sticky")!;
    const vh = stage.clientHeight + parseFloat(getComputedStyle(stage).top);
    window.scrollTo(0, scrollY + node.getBoundingClientRect().top + (node.getBoundingClientRect().height - vh) * .15);
  });
  const rail = page.locator(".story-progress-rail");
  await expect.poll(() => rail.evaluate(node => Number((node as HTMLElement).style.getPropertyValue("--p")))).toBeCloseTo(.15, 3);
  const before = await rail.getAttribute("style");
  await page.evaluate(() => {
    Object.defineProperty(window, "innerHeight", { configurable: true, value: innerHeight + 72 });
    window.dispatchEvent(new Event("resize"));
  });
  await page.waitForTimeout(100);
  expect(await rail.getAttribute("style")).toBe(before);
});
