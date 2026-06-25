import Head from 'next/head';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { gotoLogin } from '@/features/auth';
import { useSynchronizedLanguage } from '@/features/language';

import {
  ArrowRight,
  ChevronDown,
  EuStars,
  GlobeIcon,
} from './MosaLoginPage.icons';
import {
  AccentDot,
  Actions,
  BrandContent,
  BrandFooter,
  BrandPanel,
  Divider,
  EuFlag,
  FormContainer,
  FormHeader,
  FormPanel,
  GradientBase,
  GridOverlay,
  LangButton,
  LangDropdown,
  LangOption,
  LangSelectorContainer,
  LanguageSelectorWrapper,
  LoginContainer,
  MobileAccents,
  MobileEuFlag,
  MobileFooter,
  MobileHeader,
  PrimaryButton,
  ProductHighlight,
  SignupPrompt,
} from './MosaLoginPage.styles';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { changeFrontendLanguage } = useSynchronizedLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(() => {
    const lang = i18n.language?.split('-')[0] || 'en';
    return LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  }, [i18n.language]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    void changeFrontendLanguage(code);
    setIsOpen(false);
  };

  return (
    <LangSelectorContainer ref={ref}>
      <LangButton onClick={() => setIsOpen(!isOpen)}>
        <GlobeIcon />
        <span>{currentLang.label}</span>
        <ChevronDown rotated={isOpen} />
      </LangButton>
      {isOpen && (
        <LangDropdown>
          {LANGUAGES.map((lang) => (
            <LangOption
              key={lang.code}
              $selected={currentLang.code === lang.code}
              onClick={() => handleSelect(lang.code)}
            >
              {lang.label}
            </LangOption>
          ))}
        </LangDropdown>
      )}
    </LangSelectorContainer>
  );
};

interface MosaLoginPageProps {
  heading?: ReactNode;
  description?: string;
  withRedirect?: boolean;
}

export const MosaLoginPage = ({
  heading,
  description,
  withRedirect = true,
}: MosaLoginPageProps) => {
  const { t } = useTranslation();

  const handleLogin = () => {
    gotoLogin(withRedirect);
  };

  return (
    <>
      <Head>
        <title>{t('Sign in to Docs - mosa.cloud')}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <LoginContainer>
        <BrandPanel>
          <GradientBase />
          <GridOverlay />

          <AccentDot
            $left="64px"
            $top="calc(50% - 160px)"
            $size="4px"
            $bg="rgba(255, 255, 255, 0.5)"
          />
          <AccentDot
            $left="256px"
            $top="calc(50% - 224px)"
            $size="12px"
            $bg="rgba(255, 255, 255, 0.7)"
          />
          <AccentDot
            $left="64px"
            $top="calc(50% + 96px)"
            $size="5px"
            $bg="rgba(255, 255, 255, 0.55)"
          />
          <AccentDot
            $left="192px"
            $top="calc(50% + 224px)"
            $size="6px"
            $bg="rgba(255, 255, 255, 0.55)"
          />
          <AccentDot
            $left="384px"
            $top="calc(50% + 160px)"
            $size="4px"
            $bg="rgba(255, 255, 255, 0.4)"
          />

          <BrandContent>
            <img src="/logos/mosa-cloud-logo-white.svg" alt="mosa.cloud" />
          </BrandContent>

          <BrandFooter>
            <EuFlag>
              <EuStars />
            </EuFlag>
            <span>{t('Built in the EU')}</span>
          </BrandFooter>
        </BrandPanel>

        <FormPanel>
          <LanguageSelectorWrapper>
            <LanguageSelector />
          </LanguageSelectorWrapper>

          <MobileAccents />

          <MobileHeader>
            <img src="/logos/mosa-cloud-logo.svg" alt="mosa.cloud" />
          </MobileHeader>

          <FormContainer>
            <FormHeader>
              <p>{description ?? t('Collaborative documents')}</p>
              <h2>
                {heading ?? (
                  <>
                    {t('Welcome to')} <ProductHighlight>Docs</ProductHighlight>
                  </>
                )}
              </h2>
            </FormHeader>

            <Divider />

            <Actions>
              <PrimaryButton onClick={handleLogin}>
                <span>{t('Sign in with your account')}</span>
                <ArrowRight />
              </PrimaryButton>
            </Actions>

            <SignupPrompt>
              {t("Don't have an account?")}{' '}
              <a href="mailto:hi@mosa.cloud">{t('Contact us')}</a>
            </SignupPrompt>
          </FormContainer>

          <MobileFooter>
            <MobileEuFlag>
              <EuStars />
            </MobileEuFlag>
            <span>{t('Built in the EU')}</span>
          </MobileFooter>
        </FormPanel>
      </LoginContainer>
    </>
  );
};
