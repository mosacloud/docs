import { expect, test } from '@playwright/test';

import {
  TestLanguage,
  createDoc,
  overrideConfig,
  waitForLanguageSwitch,
} from './utils-common';
import { openSuggestionMenu } from './utils-editor';

test.describe('Language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('it checks theme_customization.translations config', async ({
    page,
  }) => {
    await overrideConfig(page, {
      theme_customization: {
        translations: {
          en: {
            translation: {
              Docs: 'MyCustomDocs',
            },
          },
        },
        header: {
          logo: {},
          icon: {
            withTitle: true,
          },
        },
      },
    });

    await page.goto('/');

    await expect(page.getByText('MyCustomDocs')).toBeAttached();
  });

  test('checks language switching', async ({ page }) => {
    const languagePicker = page.locator('.c__language-picker');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-us');

    // initial language should be english
    await expect(
      page.getByRole('button', {
        name: 'New doc',
      }),
    ).toBeVisible();

    // switch to french
    await waitForLanguageSwitch(page, TestLanguage.French);

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

    await page.locator('.user-menu__button').click();
    await expect(languagePicker).toContainText('FR');

    await expect(page.locator('.user-menu__item').first()).toBeVisible();

    // Switch to German using the utility function for consistency
    // (waitForLanguageSwitch closes the UserMenu again once done)
    await waitForLanguageSwitch(page, TestLanguage.German);

    await page.locator('.user-menu__button').click();
    await expect(languagePicker).toContainText('DE');

    await expect(page.locator('.user-menu__item').first()).toBeVisible();

    await expect(page.locator('html')).toHaveAttribute('lang', 'de');

    await languagePicker.click();

    await expect(page.locator('[role="menu"]')).toBeVisible();

    const menuItems = page.locator('[role="menuitem"]');
    await expect(menuItems.first()).toBeVisible();

    await menuItems.first().click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(languagePicker).toContainText('EN');
  });

  test('waitForLanguageSwitch is a no-op when the language is already active', async ({
    page,
  }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-us');

    // Calling with the already active language should not open the language
    // menu or click a menu item, it should just close the user menu.
    await waitForLanguageSwitch(page, TestLanguage.English);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-us');
    await expect(page.getByRole('dialog', { name: 'User menu' })).toBeHidden();
  });

  test('can switch language using only keyboard', async ({ page }) => {
    await waitForLanguageSwitch(page, TestLanguage.English);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Opening the UserMenu focuses its own container first; one more Tab
    // reaches the language picker button inside it.
    await page.keyboard.press('Tab');
    const languagePicker = page.locator('.c__language-picker');
    await expect(languagePicker).toBeFocused();

    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Wait for an actual menuitem to be attached before navigating it.
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await page.getByRole('menuitem').first().waitFor({ state: 'attached' });

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page.locator('html')).not.toHaveAttribute('lang', 'en-us');
  });

  test('checks that backend uses the same language as the frontend', async ({
    page,
  }) => {
    // Helper function to intercept and assert 404 response
    const check404Response = async (expectedDetail: string) => {
      const interceptedBackendResponse = await page.request.get(
        `${process.env.BASE_API_URL}/documents/non-existent-doc-uuid/`,
      );

      // Assert that the intercepted error message is in the expected language
      expect(await interceptedBackendResponse.json()).toStrictEqual({
        detail: expectedDetail,
      });
    };

    // Check for English 404 response
    await check404Response('Not found.');

    await waitForLanguageSwitch(page, TestLanguage.French);

    // Check for French 404 response
    await check404Response('Non trouvé.');
  });

  test('it check translations of the slash menu when changing language', async ({
    page,
    browserName,
  }) => {
    await overrideConfig(page, {
      LANGUAGES: [
        ['en-us', 'English'],
        ['fr-fr', 'Français'],
        ['sv-se', 'Svenska'],
      ],
      LANGUAGE_CODE: 'en-us',
    });

    await createDoc(page, 'doc-toolbar', browserName, 1);

    const { editor, suggestionMenu } = await openSuggestionMenu({ page });
    await expect(
      suggestionMenu.getByText('Headings', { exact: true }),
    ).toBeVisible();

    await editor.click(); // close the menu

    await expect(page.getByText('Headings', { exact: true })).toBeHidden();

    // Change language to French
    await waitForLanguageSwitch(page, TestLanguage.French);

    // Trigger slash menu to show french menu
    await openSuggestionMenu({ page });
    await expect(
      suggestionMenu.getByText('Titres', { exact: true }),
    ).toBeVisible();

    /**
     * Swedish is not yet supported in the BlockNote locales, so it should fallback to English
     */
    await waitForLanguageSwitch(page, TestLanguage.Swedish);
    await openSuggestionMenu({ page });
    await expect(
      suggestionMenu.getByText('Headings', { exact: true }),
    ).toBeVisible();
  });
});
