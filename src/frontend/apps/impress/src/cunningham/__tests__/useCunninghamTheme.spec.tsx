import { useCunninghamTheme } from '../useCunninghamTheme';

describe('<useCunninghamTheme />', () => {
  it('default theme has the expected tokens', () => {
    expect(
      useCunninghamTheme.getState().currentTokens.globals?.font.families.base,
    ).toBe('Inter Variable, Roboto Flex Variable, sans-serif');
  });

  // Skip: dsfr is intentionally disabled in cunningham.ts (the
  // `_themesDSFR` spread is commented out, on purpose, to keep future
  // La Suite rebases easy to reconcile) — there's currently no second
  // theme to switch to and verify tokens change.
  it.skip('changing theme update tokens', () => {
    // Change theme
    // @ts-expect-error -- 'dsfr' isn't a valid Theme while it's disabled;
    // this line intentionally stays type-broken as a marker, so a rebase
    // that re-enables dsfr will make TS flag this suppression as stale.
    useCunninghamTheme.getState().setTheme('dsfr');

    expect(
      useCunninghamTheme.getState().currentTokens.globals?.font.families.base,
    ).toBe('Marianne, Inter Variable, Roboto Flex Variable, sans-serif');
  });
});
