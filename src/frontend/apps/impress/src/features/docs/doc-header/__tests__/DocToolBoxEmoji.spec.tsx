import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { DropdownMenuOption } from '@/components';
import { AppWrapper } from '@/tests/utils';

const mockUpdateDocEmoji = vi.fn();
let capturedOptions: DropdownMenuOption[] = [];

vi.mock('@/components', async () => {
  const actual = await vi.importActual<any>('@/components');
  return {
    ...actual,
    DropdownMenu: ({ options }: { options: DropdownMenuOption[] }) => {
      capturedOptions = options;
      return null;
    },
  };
});

vi.mock('next/router', async () => ({
  ...(await vi.importActual('next/router')),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/docs/doc-management', async () => {
  const actual = await vi.importActual<any>('@/docs/doc-management');
  return {
    ...actual,
    useDocTitleUpdate: () => ({ updateDocEmoji: mockUpdateDocEmoji }),
    useDocUtils: () => ({ isChild: true, isTopRoot: false }),
    useCopyDocLink: () => vi.fn(),
    useCreateFavoriteDoc: () => ({ mutate: vi.fn() }),
    useDeleteFavoriteDoc: () => ({ mutate: vi.fn() }),
    useDuplicateDoc: () => ({ mutate: vi.fn() }),
  };
});

vi.mock('@/stores', () => ({
  useFocusStore: (selector?: (state: any) => any) => {
    const state = { addLastFocus: vi.fn(), restoreFocus: vi.fn() };
    return selector ? selector(state) : state;
  },
  useResponsiveStore: () => ({
    isSmallMobile: false,
    isMobile: false,
    isDesktop: true,
  }),
}));

vi.mock('../hooks/useCopyCurrentEditorToClipboard', () => ({
  useCopyCurrentEditorToClipboard: () => vi.fn(),
}));

import { DocToolBox } from '../components/DocToolBox';

const doc = {
  id: 'doc-1',
  title: 'My document',
  is_favorite: false,
  nb_accesses_direct: 1,
  abilities: {
    versions_list: true,
    destroy: true,
    partial_update: true,
    duplicate: true,
    accesses_view: true,
  },
} as any;

describe('DocToolBox - Add emoji (April Fools easter egg)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUpdateDocEmoji.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  [
    { emoji: '🐟', date: '2026-04-01' },
    { emoji: '📄', date: '2026-03-30' },
    { emoji: '📄', date: '2026-04-02' },
  ].forEach(({ emoji, date }) => {
    test(`uses ${emoji} emoji on ${date}`, () => {
      vi.setSystemTime(new Date(date));

      render(<DocToolBox doc={doc} />, { wrapper: AppWrapper });

      const addEmojiOption = capturedOptions.find(
        (o) => o.label === 'Add emoji',
      );
      void addEmojiOption?.callback?.();

      expect(mockUpdateDocEmoji).toHaveBeenCalledWith(
        'doc-1',
        'My document',
        emoji,
      );
    });
  });
});
