import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/features/auth';
import { MosaLoginPage } from '@/features/home/components/MosaLoginPage';
import { NextPageWithLayout } from '@/types/next';

const HeaderAuthActions = () => {
  const { t } = useTranslation();

  return (
    <Box $direction="row" $align="center" $gap="sm">
      <ButtonLogin variant="tertiary">
        {t('Try it now', {
          description: 'Button on the sign-in page to log in',
        })}
      </ButtonLogin>
      <ButtonLogin />
    </Box>
  );
};

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();
  const { replace } = useRouter();
  const pageTitle = `${t('401 Unauthorized', { description: 'Page title when authentication is required' })} - ${t('Docs', { description: 'Product name, shown in page titles and the logo' })}`;

  useEffect(() => {
    if (authenticated) {
      void replace(`/`);
    }
  }, [authenticated, replace]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
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
