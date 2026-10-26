import { Header as UIHeader, UserMenu } from '@gouvfr-lasuite/ui-components';
import { useTranslation } from 'react-i18next';

import { Box } from '@/components';
import { ButtonLogin, gotoLogout, useAuth } from '@/features/auth';
import { LanguagePicker } from '@/features/language/components/LanguagePicker';
import { useLeftPanelStore } from '@/features/left-panel/stores';

import { AppSwitcherButton } from './AppSwitcherPanel';
import { HeaderLogoLink } from './HeaderLogoLink';

const HeaderRight = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userMenu = user || {
    full_name: t('Guest', {
      description: 'Name displayed for a user not logged in',
    }),
    email: '',
  };

  return (
    <Box $direction="row" $align="center" $gap="xs">
      <AppSwitcherButton />
      <UserMenu
        user={userMenu}
        logout={user ? gotoLogout : undefined}
        actions={<LanguagePicker />}
      />
      {!user && <ButtonLogin />}
    </Box>
  );
};

export const Header = ({
  withLeftPanel = true,
}: {
  withLeftPanel?: boolean;
}) => {
  const { isPanelOpen, togglePanel } = useLeftPanelStore();

  return (
    <Box
      className="--docs--header"
      $width="100%"
      $shrink={0}
      $css={`
        position: relative;
        z-index: 1001;

        .--docs--header-logo-link img {
          width: 32px !important;
          height: auto !important;
        }

        .--docs--header-logo-link :is(h1, h2, h3, span) {
          font-size: 1.375rem !important;
        }

        ${withLeftPanel ? '' : '.c__header__toggle-menu { display: none !important; }'}
      `}
    >
      <UIHeader
        leftIcon={<HeaderLogoLink headingLevel="h1" />}
        rightIcon={<HeaderRight />}
        onTogglePanel={togglePanel}
        isPanelOpen={isPanelOpen}
      />
    </Box>
  );
};
