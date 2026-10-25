import { expect, test } from "@playwright/test";

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/books");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("mobile menu opens, traps focus and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const button = page.getByRole("button", { name: /menu/i });
  await button.click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /the books/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});

test("the trilogy tabs work from the keyboard", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "desktop keyboard test");
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);
  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: /king triton/i })).toBeVisible();
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
});

test("the Map Room responds to its controls", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "desktop");
  await page.goto("/explore#map-room");
  await page.getByRole("button", { name: "Ghost Falls", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ghost Falls", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset canyon view" }).click();
  await expect(page.getByRole("button", { name: "Ghost Falls", exact: true })).toHaveAttribute("aria-pressed", "false");
});
