const { test, expect } = require('@playwright/test');

test.describe('Login', () => {
  test('loads login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('login with dummy credentials succeeds and shows welcome', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/username/i).fill('dummy');
    await page.getByLabel(/password/i).fill('dummy');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/welcome/);
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
    await expect(page.getByText(/you are logged in/i)).toBeVisible();
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/username/i).fill('wrong');
    await page.getByLabel(/password/i).fill('wrong');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login\?error=invalid/);
    await expect(page.getByRole('alert')).toContainText(/invalid/i);
  });

  test('empty submit stays on login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
