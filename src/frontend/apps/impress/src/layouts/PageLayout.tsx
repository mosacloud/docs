import { PropsWithChildren } from 'react';

import { Box } from '@/components';
import { Footer } from '@/features/footer';
import { Header } from '@/features/header';
import { VIEWPORT_HEIGHT_CSS } from '@/features/header/conf';
import { LeftPanel } from '@/features/left-panel';

import { MainContent } from './MainLayout';

interface PageLayoutProps {
  withFooter?: boolean;
  withLeftPanel?: boolean;
}

export function PageLayout({
  children,
  withFooter = true,
  withLeftPanel = true,
}: PropsWithChildren<PageLayoutProps>) {
  return (
    <Box
      className="--docs--page-layout"
      $minHeight="100vh"
      $css={VIEWPORT_HEIGHT_CSS}
    >
      <Header withLeftPanel={withLeftPanel} />
      <Box $direction="row" $flex={1}>
        {withLeftPanel && <LeftPanel />}
        <MainContent>{children}</MainContent>
        {withFooter && <Footer />}
      </Box>
    </Box>
  );
}
