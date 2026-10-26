import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Box, ButtonLink, SeparatedSection } from '@/components';
import { NewDocButton } from '@/docs/doc-management/components/NewDocButton';
import { DocSearchButtonModal } from '@/docs/doc-search/components/DocSearchButtonModal';
import { useAuth } from '@/features/auth';
import HomeSVG from '@/icons/house-rounded.svg';
import { useResponsiveStore } from '@/stores';

import { useLeftPanelStore } from '../stores';

export const LeftPanelHeader = () => {
  return (
    <Box $width="100%" className="--docs--left-panel-header">
      <LeftPanelHeaderActions />
    </Box>
  );
};
export const LeftPanelHeaderActions = () => {
  const router = useRouter();
  const { authenticated } = useAuth();
  const { togglePanel, closePanel } = useLeftPanelStore();
  const { t } = useTranslation();
  const { isMobile } = useResponsiveStore();

  const onHomeClick = () => {
    if (isMobile) {
      togglePanel();
    }
  };

  return (
    <SeparatedSection>
      <Box
        $padding={{ horizontal: 'sm' }}
        $width="100%"
        $direction="row"
        $justify="space-between"
        $align="center"
      >
        {authenticated && (
          <NewDocButton onClose={() => isMobile && closePanel()} />
        )}
        <Box $direction="row" $gap="2px" $margin={{ left: 'auto' }}>
          {router.pathname !== '/' && (
            <ButtonLink
              href="/"
              data-testid="home-button"
              onClick={onHomeClick}
              aria-label={t('Back to homepage', {
                description:
                  'Accessible name of the button going back to the home page',
              })}
              size="medium"
              color="brand"
              variant="tertiary"
              icon={<HomeSVG aria-hidden="true" width={24} height={24} />}
            />
          )}
          <DocSearchButtonModal />
        </Box>
      </Box>
    </SeparatedSection>
  );
};
