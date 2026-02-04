import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/features/auth';
import { MosaLoginPage } from '@/features/home/components/MosaLoginPage';
import { NextPageWithLayout } from '@/types/next';

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    if (authenticated) {
      void replace(`/`);
    }
  }, [authenticated, replace]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`${t('401 Unauthorized')} - ${t('Docs')}`}</title>
        <meta
          property="og:title"
          content={`${t('401 Unauthorized')} - ${t('Docs')}`}
          key="title"
        />
      </Head>
      <MosaLoginPage
        heading={t('Log in to access the document.')}
        description=""
        withRedirect={false}
      />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default Page;
