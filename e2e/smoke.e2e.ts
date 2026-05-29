import { test, expect } from '@playwright/test';

test('home shows hero and poster rows', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /discover/i })).toBeVisible();
  await expect(page.getByText('Top rated')).toBeVisible();
});

test('browse shows a grid and navigates to a detail page', async ({ page }) => {
  await page.goto('/movies');
  await expect(page.getByRole('heading', { name: 'Browse' })).toBeVisible();
  const firstCard = page.locator('a[href^="/movies/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/movies\/\d+/);
  await expect(page.getByText('Watch on source')).toBeVisible();
});

test('search page handles a query', async ({ page }) => {
  await page.goto('/search?q=love');
  await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible();
});

test('unknown movie id renders the error page', async ({ page }) => {
  await page.goto('/movies/99999999');
  await expect(page.getByText('404')).toBeVisible();
});

test('signed-out navbar shows Sign in and catalog still renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByText('Top rated')).toBeVisible();
});
