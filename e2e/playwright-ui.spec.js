const { test, expect } = require('@playwright/test');

test.describe('Playwright UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playwright-ui');
  });

  test('loads playwright-ui page', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright UI/);
    await expect(page.locator('#title')).toContainText('Playwright UI');
    await expect(page.locator('#subtitle')).toContainText('Playwright MCP');
    await expect(page.locator('#link-home')).toBeVisible();
    await expect(page.locator('#link-health')).toBeVisible();
    await expect(page.locator('#link-play')).toBeVisible();
    await expect(page.locator('#btn-greet')).toBeVisible();
    await expect(page.locator('#btn-time')).toBeVisible();
    await expect(page.locator('#btn-clear')).toBeVisible();
    await expect(page.locator('#echo-input')).toBeVisible();
    await expect(page.locator('#btn-submit')).toBeVisible();
  });

  test('Greet button shows hello message', async ({ page }) => {
    await page.locator('#btn-greet').click();
    await expect(page.locator('#result')).toContainText('Hello, Playwright!');
  });

  test('Time button shows time in result', async ({ page }) => {
    await page.locator('#btn-time').click();
    await expect(page.locator('#result')).toContainText('Time:');
  });

  test('Clear button empties result', async ({ page }) => {
    await page.locator('#btn-greet').click();
    await expect(page.locator('#result')).toContainText('Hello, Playwright!');
    await page.locator('#btn-clear').click();
    await expect(page.locator('#result')).toHaveText('');
  });

  test('echo form submits text and shows in result', async ({ page }) => {
    await page.locator('#echo-input').fill('test message');
    await page.locator('#btn-submit').click();
    await expect(page.locator('#result')).toContainText('Echo: test message');
  });

  test('echo form empty submit shows (empty)', async ({ page }) => {
    await page.locator('#btn-submit').click();
    await expect(page.locator('#result')).toContainText('(empty)');
  });

  test('link Home navigates to root', async ({ page }) => {
    await page.locator('#link-home').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toContainText('crane');
  });

  test('link Health navigates to health', async ({ page }) => {
    await page.locator('#link-health').click();
    await expect(page).toHaveURL('/health');
    await expect(page.locator('body')).toContainText('"status":"ok"');
  });

  test('link Play navigates to play', async ({ page }) => {
    await page.locator('#link-play').click();
    await expect(page).toHaveURL('/play');
    await expect(page.locator('body')).toContainText('Playwright Playground');
  });
});
