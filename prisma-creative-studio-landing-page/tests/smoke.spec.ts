import { test, expect } from "@playwright/test";

test.describe("SkillTree Landing Page", () => {
  test("page loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SkillTree/);
  });

  test("Hero section renders with video background", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("autoplay", "");
    await expect(video).toHaveAttribute("loop", "");
    const muted = await video.evaluate((el: HTMLVideoElement) => el.muted);
    expect(muted).toBe(true);
  });

  test("Hero shows 'SkillTree' heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("section").first().getByText("SkillTree").first();
    await expect(heading).toBeVisible();
  });

  test("Hero shows 'Analyze My GitHub' button", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Analyze My GitHub" });
    await expect(button).toBeVisible();
  });

  test("Hero shows stat pills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("10K+ Repos Analyzed")).toBeVisible();
    await expect(page.getByText("99% Accuracy")).toBeVisible();
    await expect(page.getByText("Real-time Verified")).toBeVisible();
  });

  test("Navbar renders with all navigation items", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SkillTree").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Analyzer" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ledger" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Leaderboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("GitHub Analyzer section is present", async ({ page }) => {
    await page.goto("/");
    const analyzer = page.locator("#analyzer");
    await expect(analyzer).toBeVisible();
    await expect(page.getByText("LIVE ANALYSIS ENGINE")).toBeVisible();
  });

  test("Deployment Verifier section is present", async ({ page }) => {
    await page.goto("/");
    const deployments = page.locator("#deployments");
    await expect(deployments).toBeVisible();
    await expect(page.getByText("DEPLOYMENT VERIFICATION")).toBeVisible();
  });

  test("Proof Ledger section is present", async ({ page }) => {
    await page.goto("/");
    const ledger = page.locator("#ledger");
    await expect(ledger).toBeVisible();
    await expect(page.getByText("PROOF LEDGER")).toBeVisible();
  });

  test("Leaderboard section is present", async ({ page }) => {
    await page.goto("/");
    const leaderboard = page.locator("#leaderboard");
    await expect(leaderboard).toBeVisible();
    await expect(page.getByText("GLOBAL LEADERBOARD")).toBeVisible();
  });

  test("Footer has 'Get Early Access' heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Get Early Access").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Join the Waitlist" })).toBeVisible();
  });

  test("GitHub Analyzer input works", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#analyzer input");
    await expect(input).toBeVisible();
    await input.fill("torvalds");
    await expect(input).toHaveValue("torvalds");
  });

  test("Deployment Verifier input works", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#deployments input");
    await expect(input).toBeVisible();
    await input.fill("https://example.com");
    await expect(input).toHaveValue("https://example.com");
  });

  test("Proof Ledger input works", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#ledger input");
    await expect(input).toBeVisible();
    await input.fill("torvalds");
    await expect(input).toHaveValue("torvalds");
  });

  test("Analyze My GitHub button scrolls to analyzer", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Analyze My GitHub" });
    await button.click();
    await page.waitForTimeout(1000);
    await expect(page.locator("#analyzer")).toBeInViewport();
  });
});
