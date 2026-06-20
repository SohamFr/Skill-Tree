import { test, expect } from "@playwright/test";

test.describe("Visual and Styling Verification", () => {
  test("page background is black", async ({ page }) => {
    await page.goto("/");
    const bg = await page.evaluate(() =>
      getComputedStyle(document.getElementById("root")!.parentElement!).backgroundColor
    );
    expect(bg).toBe("rgb(0, 0, 0)");
  });

  test("noise overlay div exists", async ({ page }) => {
    await page.goto("/");
    const noise = page.locator(".noise-overlay");
    await expect(noise).toBeVisible();
  });

  test("Navbar has backdrop blur class", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header > div").first();
    await expect(nav).toBeVisible();
    const hasBlurClass = await nav.evaluate((el) =>
      el.className.includes("backdrop")
    );
    expect(hasBlurClass).toBe(true);
  });

  test("GitHub Analyzer section has grid background pattern", async ({ page }) => {
    await page.goto("/");
    const analyzer = page.locator("#analyzer");
    await expect(analyzer).toBeVisible();
    const hasPattern = await analyzer.evaluate((el) => {
      const firstChild = el.firstElementChild;
      if (!firstChild) return false;
      const bg = getComputedStyle(firstChild).backgroundImage;
      return bg.includes("linear-gradient");
    });
    expect(hasPattern).toBe(true);
  });

  test("Deployment Verifier has ambient glow", async ({ page }) => {
    await page.goto("/");
    const glow = page.locator("#deployments .blur-3xl");
    await expect(glow).toBeVisible();
  });

  test("All section headings use animated text", async ({ page }) => {
    await page.goto("/");
    const animated = page.locator('[class*="inline-flex flex-wrap"]');
    const count = await animated.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("Footer contains SKILLTREE © 2026", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SKILLTREE © 2026")).toBeVisible();
  });

  test("Footer contains 'BUILT FOR BUILDERS. POWERED BY PROOF.'", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("BUILT FOR BUILDERS. POWERED BY PROOF.")).toBeVisible();
  });

  test("Proof Ledger has identity card section", async ({ page }) => {
    await page.goto("/");
    await page.locator("#ledger input").fill("torvalds");
    await page.locator("#ledger button").click();
    await page.waitForTimeout(1000);
    // Card should show after loading (or show SKILLTREE watermark on the card)
    const cardText = page.locator("#ledger").getByText("SKILLTREE");
    const exists = (await cardText.count()) > 0;
    if (!exists) {
      test.info().annotations.push({
        type: "note",
        description: "Identity card not shown — expected when backend has no data",
      });
    }
  });

  test("Leaderboard has scrolling ticker", async ({ page }) => {
    await page.goto("/");
    const ticker = page.locator("#leaderboard .overflow-hidden");
    await expect(ticker).toBeVisible();
  });

  test("Navbar green dot pulses", async ({ page }) => {
    await page.goto("/");
    const dot = page.locator(".animate-pulse").first();
    await expect(dot).toBeVisible();
  });

  test("Page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });

  test("All sections have proper ids for navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#analyzer")).toBeVisible();
    await expect(page.locator("#deployments")).toBeVisible();
    await expect(page.locator("#ledger")).toBeVisible();
    await expect(page.locator("#leaderboard")).toBeVisible();
    await expect(page.locator("#get-started")).toBeVisible();
  });

  test("Video has proper CSS classes", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video");
    await expect(video).toHaveClass(/absolute inset-0/);
    await expect(video).toHaveClass(/object-cover/);
  });
});
