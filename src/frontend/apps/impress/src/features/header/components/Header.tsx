import { Header as UIKitHeader, UserMenu } from '@gouvfr-lasuite/ui-kit';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Box, SkipToContent, StyledLink } from '@/components/';
import { useConfig } from '@/core/config';
import { gotoLogout, useAuth } from '@/features/auth';
import { LanguagePicker } from '@/features/language';
import { useLeftPanelStore } from '@/features/left-panel';

import { Title } from './Title';
import { Waffle } from './Waffle';

const HeaderLogo = () => {
  const { t } = useTranslation();
  const { data: config } = useConfig();

  const icon = config?.theme_customization?.header?.icon;

  return (
    <StyledLink
      href="/"
      data-testid="header-logo-link"
      aria-label={t('Back to homepage')}
      $css={css`
        outline: none;
        &:focus-visible {
          box-shadow: 0 0 0 2px var(--c--globals--colors--brand-400) !important;
          border-radius: var(--c--globals--spacings--st);
        }
      `}
    >
      <Box
        $align="center"
        $gap="0.25rem"
        $direction="row"
        $position="relative"
        $height="fit-content"
        $margin={{ top: 'auto' }}
      >
        {icon && (
          <Image
            data-testid="header-icon-docs"
            width={0}
            height={0}
            priority
            {...(({ withTitle: _, ...rest }) => rest)(icon)}
          />
        )}
        <Title
          headingLevel="h1"
          className={icon?.withTitle ? undefined : 'sr-only'}
        />
      </Box>
    </StyledLink>
  );
};

const HeaderRight = () => {
  const { user } = useAuth();

  return (
    <Box $direction="row" $align="center" $gap="0.5rem">
      <Waffle />
      <UserMenu
        user={
          user
            ? { full_name: user.full_name ?? undefined, email: user.email }
            : null
        }
        logout={gotoLogout}
        termOfServiceUrl="https://docs.numerique.gouv.fr/docs/8e298e03-c95f-44c7-be4a-ffb618af1854/"
        actions={
          <div className="user-menu__footer-action">
            <LanguagePicker />
          </div>
        }
      />
    </Box>
  );
};

export const Header = () => {
  const { isPanelOpenMobile, togglePanel } = useLeftPanelStore();

  return (
    <>
      <SkipToContent />
      <div className="c__main-layout__header">
        <UIKitHeader
          leftIcon={<HeaderLogo />}
          rightIcon={<HeaderRight />}
          onTogglePanel={() => togglePanel({ type: 'mobile' })}
          isPanelOpen={isPanelOpenMobile}
        />
      </div>
    </>
  );
};
