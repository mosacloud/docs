import { TreeViewDataType } from '@gouvfr-lasuite/ui-kit';

import { Doc } from '../doc-management';

export const subPageToTree = (children: Doc[]): TreeViewDataType<Doc>[] => {
  children.forEach((child) => {
    child.childrenCount = child.numchild ?? 0;
    subPageToTree(child.children ?? []);
  });
  return children;
};
