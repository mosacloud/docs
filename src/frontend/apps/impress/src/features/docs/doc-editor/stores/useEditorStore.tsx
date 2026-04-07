import { create } from 'zustand';

import type { DocsThreadStore } from '../components/comments/DocsThreadStore';
import { DocsBlockNoteEditor } from '../types';

export interface UseEditorstore {
  editor?: DocsBlockNoteEditor;
  threadStore?: DocsThreadStore;
  setEditor: (editor: DocsBlockNoteEditor | undefined) => void;
  setThreadStore: (threadStore: DocsThreadStore | undefined) => void;
}

export const useEditorStore = create<UseEditorstore>((set) => ({
  editor: undefined,
  threadStore: undefined,
  setEditor: (editor) => {
    set({ editor });
  },
  setThreadStore: (threadStore) => {
    set({ threadStore });
  },
}));
