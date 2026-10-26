import { expect, test } from '@playwright/test';

test.describe('401', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('checks all the elements are visible', async ({ page }) => {
    await page.goto('/401');

    // Mosa renders its login page here instead of the La Suite 401 page
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Log in to access the document.',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Sign in with your account' }),
    ).toBeVisible();
    await expect(page).toHaveTitle(/401 Unauthorized - Docs/);
  });
});
