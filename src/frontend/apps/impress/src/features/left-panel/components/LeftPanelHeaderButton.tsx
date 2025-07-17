import { Button } from '@openfun/cunningham-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components';
import { useCreateDoc } from '@/features/docs/doc-management';

import { useLeftPanelStore } from '../stores';

export const LeftPanelHeaderButton = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { togglePanel } = useLeftPanelStore();
  const { mutate: createDoc, isPending: isDocCreating } = useCreateDoc({
    onSuccess: (doc) => {
      void router.push(`/docs/${doc.id}`);
      togglePanel();
    },
  });
  return (
    <Button
      color="primary"
      onClick={() => createDoc()}
      icon={<Icon $variation="000" iconName="add" />}
      disabled={isDocCreating}
    >
      {t('New doc')}
    </Button>
  );
};
