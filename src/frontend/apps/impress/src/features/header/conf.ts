/**
 * Height of the row holding the Docs logo. Shared by the left panel header and
 * the standalone page header so the logo does not shift between pages.
 */
export const HEADER_ROW_MIN_HEIGHT = '64px';

/** Height of the Mosa top bar, shared by the layouts that render it. */
export const HEADER_HEIGHT = 52;

/**
 * Height left for the app shell below the top bar. The layouts rendering the
 * top bar set `--docs--viewport-height`; everywhere else it falls back to the
 * full viewport.
 */
export const VIEWPORT_HEIGHT = 'var(--docs--viewport-height, 100dvh)';
export const VIEWPORT_HEIGHT_CSS = `--docs--viewport-height: calc(100dvh - ${HEADER_HEIGHT}px);`;
