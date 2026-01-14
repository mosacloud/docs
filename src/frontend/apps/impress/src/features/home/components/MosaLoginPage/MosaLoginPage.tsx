import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  Actions,
  AppIcon,
  BrandBg,
  BrandContent,
  BrandFooter,
  BrandPanel,
  BrandTagline,
  BrandTitle,
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
  MobileBrand,
  MobileEuFlag,
  MobileFooter,
  MobileHeader,
  MobileLogo,
  Orb,
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

export const MosaLoginPage = () => {
  const { t } = useTranslation();

  const handleLogin = () => {
    gotoLogin();
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
          <BrandBg>
            <GradientBase />
            <GridOverlay />
            <Orb $size="300px" $top="-10%" $right="-10%" />
            <Orb $size="200px" $bottom="20%" $left="-5%" $delay="-7s" />
            <Orb $size="150px" $bottom="-5%" $right="20%" $delay="-14s" />
          </BrandBg>

          <BrandContent>
            <AppIcon>
              <img src="/assets/mosa.svg" alt="mosa.cloud" />
            </AppIcon>
            <BrandTitle>mosa.cloud</BrandTitle>
            <BrandTagline>{t('Your open source workspace')}</BrandTagline>
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
            <MobileLogo aria-label="mosa.cloud logo" />
            <MobileBrand>mosa.cloud</MobileBrand>
          </MobileHeader>

          <FormContainer>
            <FormHeader>
              <h2>
                {t('Welcome to')} <ProductHighlight>Docs</ProductHighlight>
              </h2>
              <p>{t('Collaborative documents')}</p>
            </FormHeader>

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
