import { test, expect } from '@playwright/test';

// iPhone 13-ish viewport with touch — exercises the mobile navbar/drawer.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test('mobile navbar collapses: hamburger shows, desktop nav hidden', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  // The desktop nav "Browse" link is hidden below sm (exact avoids the hero's "Browse the catalog").
  await expect(page.getByRole('link', { name: 'Browse', exact: true })).toBeHidden();
});

test('drawer opens from the hamburger and closes on Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();

  const drawer = page.getByRole('dialog', { name: 'Menu' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('link', { name: 'Browse' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('drawer closes when the backdrop is tapped', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();

  // The backdrop is the first "Close menu" button; click a top-left corner the panel doesn't cover.
  await page.getByRole('button', { name: 'Close menu' }).first().click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
});

test('tap-to-reveal search submits a query', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open search' }).click();

  // Scope to the visible (mobile) input — the hidden desktop input shares the placeholder.
  const input = page.locator('input[name="q"]:visible');
  await expect(input).toBeVisible();
  await input.fill('love');
  await input.press('Enter');

  await expect(page).toHaveURL(/\/search\?q=love/);
});
