import { useTranslation } from 'react-i18next';

export const useHttpErrorMessages = (status?: number) => {
  const { t } = useTranslation();

  const messages: Record<number, { title: string; detail: string }> = {
    500: {
      title: t('500 - Internal Server Error'),
      detail: t('The server met an unexpected condition.'),
    },
    502: {
      title: t('502 - Bad Gateway'),
      detail: t(
        'The server received an invalid response. Please check your connection and try again.',
      ),
    },
    503: {
      title: t('503 - Service Unavailable'),
      detail: t(
        'The service is temporarily unavailable. Please try again later.',
      ),
    },
  };

  return status ? messages[status] : undefined;
};
