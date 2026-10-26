import { expect, test } from '@playwright/test';

import { overrideConfig } from './utils-common';

test.describe('Header', () => {
  test('it displays skip link on first TAB and focuses page heading on click', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for skip link to be mounted (client-side only component)
    const skipLink = page.getByRole('link', { name: 'Go to content' });
    await skipLink.waitFor({ state: 'attached' });

    // First TAB shows the skip link
    await page.keyboard.press('Tab');

    // The skip link should be visible and focused
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    // Clicking moves focus to the page heading
    await skipLink.click();
    const pageHeading = page.getByRole('heading', {
      name: 'Recent',
      level: 2,
    });
    await expect(pageHeading).toBeFocused();
  });

  test('checks the top bar elements on different screen sizes', async ({
    page,
  }) => {
    // Desktop viewport
    await page.goto('/');

    const header = page.locator('.--docs--header');
    const panelToggle = header.locator('.c__header__toggle-menu button');

    await expect(header.getByTestId('header-logo-link')).toBeVisible();
    await expect(header.getByLabel('Switch app')).toBeVisible();
    await expect(header.getByLabel('User menu')).toBeVisible();
    await expect(panelToggle).toBeHidden();

    // Tablet viewport: the left panel can be toggled from the top bar
    await page.setViewportSize({ width: 900, height: 1200 });
    await expect(panelToggle).toBeVisible();
    await expect(header.getByLabel('Switch app')).toBeVisible();
    await expect(header.getByLabel('User menu')).toBeVisible();

    // Mobile viewport
    await page.setViewportSize({ width: 500, height: 1200 });
    await expect(panelToggle).toBeVisible();
    await expect(header.getByTestId('header-logo-link')).toBeVisible();
    await expect(header.getByLabel('Switch app')).toBeVisible();
    await expect(header.getByLabel('User menu')).toBeVisible();
  });

  test('opens the app switcher', async ({ page }) => {
    await overrideConfig(page, {
      APP_URLS: { drive: 'https://drive.example.com' },
    });
    await page.goto('/');

    await page.locator('.--docs--header').getByLabel('Switch app').click();
    await expect(page.getByRole('link', { name: /Drive/ })).toHaveAttribute(
      'href',
      'https://drive.example.com',
    );
  });
});
