import { LanguagePicker as UIKitLanguagePicker } from '@gouvfr-lasuite/ui-kit';
import { announce } from '@react-aria/live-announcer';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '@/core';
import { useAuthQuery } from '@/features/auth';
import { getClosestLocale, useSynchronizedLanguage } from '@/features/language';
import { useResponsiveStore } from '@/stores/useResponsiveStore';

/**
 * LanguagePickerLegacy component for selecting language.
 * We still have some legacy code that uses this component, so we keep it for now.
 * @deprecated Use LanguagePicker instead.
 * @returns JSX.Element
 */
export const LanguagePickerLegacy = () => {
  const { isSmallMobile } = useResponsiveStore();
  const { t, i18n } = useTranslation();
  const { data: conf } = useConfig();
  const { data: user } = useAuthQuery();
  const { changeLanguageSynchronized } = useSynchronizedLanguage();
  const language = i18n.language;

  const toLangTag = (locale: string) => locale.replace('_', '-');

  type LangOption = {
    label: string;
    shortLabel: string;
    value: string;
    isChecked: boolean;
  };

  const languages = useMemo((): LangOption[] => {
    const backendOptions: [string, string][] = conf?.LANGUAGES ?? [
      [language, language],
    ];
    return backendOptions.map(([backendLocale, backendLabel]) => ({
      label: backendLabel,
      shortLabel: toLangTag(backendLocale).toUpperCase().slice(0, 2),
      value: backendLocale,
      isChecked: getMatchingLocales([backendLocale], [language]).length > 0,
    }));
  }, [conf?.LANGUAGES, language]);

  const handleChange = async (value: string) => {
    const option = languages.find((l: LangOption) => l.value === value);
    await changeLanguageSynchronized(value, user);
    if (option) {
      announce(
        t('Language changed to {{language}}', {
          language: option.label,
          defaultValue: `Language changed to ${option.label}`,
        }),
        'polite',
      );
    }
  };

  if (!languages.length) {
    return null;
  }

  return (
    <UIKitLanguagePicker
      languages={languages}
      onChange={handleChange}
      size="small"
      compact
    />
  );
};

export const LanguagePicker = () => {
  const { t, i18n } = useTranslation();
  const { data: conf } = useConfig();
  const { data: user } = useAuthQuery();
  const { changeLanguageSynchronized } = useSynchronizedLanguage();
  const language = i18n.language;

  const languages: LanguagesOption[] = useMemo(() => {
    const backendOptions = conf?.LANGUAGES ?? [[language, language]];
    const currentLocale = getClosestLocale(
      backendOptions.map(([locale]) => locale),
      language,
    );
    return backendOptions.map(([backendLocale, backendLabel]) => ({
      label: backendLabel,
      value: backendLocale,
      isChecked: backendLocale === currentLocale,
    }));
  }, [conf?.LANGUAGES, language]);

  const onChange = (value: string) => {
    const lang = conf?.LANGUAGES?.find(([code]) => code === value);
    const backendLabel = lang?.[1] ?? value;
    void changeLanguageSynchronized(value, user).then(() => {
      announce(
        t('Language changed to {{language}}', {
          description:
            'Screen reader announcement after switching the interface language',
          language: backendLabel,
          defaultValue: `Language changed to ${backendLabel}`,
        }),
        'polite',
      );
    });
  };

  return (
    <LanguagePickerUIKit
      languages={languages}
      size="small"
      onChange={onChange}
      compact
    />
  );
};
