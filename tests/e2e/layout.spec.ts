import { expect, test } from "@playwright/test";
import { routes } from "../routes";

for (const path of routes) {
  test(`${path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("content images have alt text; decorative ones are hidden", async ({ page }) => {
  for (const path of routes) {
    await page.goto(path);
    const bad = await page.locator("img").evaluateAll((imgs) =>
      imgs
        .filter((i) => !i.hasAttribute("alt") && !i.closest("[aria-hidden=true]"))
        .map((i) => (i as HTMLImageElement).src),
    );
    expect(bad, path).toEqual([]);
  }
});

test("the homepage leads with the series and a Book One call to action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Expeditioners");
  const cta = page.getByRole("link", { name: /start with book one/i }).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/books/the-treasure-of-drowned-mans-canyon#buy");
});
