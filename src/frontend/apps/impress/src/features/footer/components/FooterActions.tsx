import { UserMenu } from '@gouvfr-lasuite/ui-components';
import { useTranslation } from 'react-i18next';
import { createGlobalStyle } from 'styled-components';

import { Box } from '@/components';
import { Waffle } from '@/components/Waffle';
import { gotoLogout, useAuth } from '@/features/auth';
import { HelpMenu } from '@/features/help';
import { LanguagePicker } from '@/features/language/components/LanguagePicker';

const FooterActionsGlobalStyle = createGlobalStyle`
  .user-menu__actions .c__language-picker{
    width: auto;
  }
`;

type FooterActionsProps = {
  /** The account actions live in the top bar: keep only the help menu. */
  hideAccount?: boolean;
};

export const FooterActions = ({ hideAccount }: FooterActionsProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userMenu = user || {
    full_name: t('Guest', {
      description: 'Name displayed for a user not logged in',
    }),
    email: '',
  };

  return (
    <>
      <FooterActionsGlobalStyle />
      <Box
        $padding={{ horizontal: 'sm' }}
        $direction="row"
        $align="center"
        $gap="3xs"
        $justify={hideAccount ? 'flex-end' : 'space-between'}
        className="--docs--footer-actions"
      >
        {!hideAccount && (
          <Box $direction="row" $align="center" $gap="3xs">
            <UserMenu
              user={userMenu}
              logout={user ? gotoLogout : undefined}
              actions={<LanguagePicker />}
              withMobileView={false}
            />
            <Waffle />
          </Box>
        )}
        <HelpMenu />
      </Box>
    </>
  );
};
