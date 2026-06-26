import { Button } from '@gouvfr-lasuite/cunningham-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

import { useConfig } from '@/core/config';

/* ── Design tokens ──────────────────────────────────────── */
const SURFACE = '#ffffff';
const BG = '#f7f8fa';
const BORDER = '#e6eaf1';
const INK = '#333333';
const GRAPHITE = '#5a6577';
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SHADOW =
  '0 2px 4px rgba(0,0,0,.02), 0 4px 8px rgba(0,0,0,.03), 0 8px 16px rgba(0,0,0,.04), 0 16px 32px rgba(0,0,0,.05), 0 32px 64px rgba(0,0,0,.08)';

/* ── App metadata ───────────────────────────────────────── */
type AppId =
  | 'epicentre'
  | 'drive'
  | 'meet'
  | 'mail'
  | 'calendar'
  | 'chat'
  | 'commander';

const APP_META: Record<
  AppId,
  {
    icon: string;
    label: string;
    subtitle: string;
    color: string;
    gradientEnd: string;
  }
> = {
  epicentre: {
    icon: '/images/icons/epicentre-icon.svg',
    label: 'Epicentre',
    subtitle: 'Home',
    color: '#0284C7',
    gradientEnd: '#0443F2',
  },
  drive: {
    icon: '/images/icons/folder-icon.svg',
    label: 'Drive',
    subtitle: 'Files',
    color: '#F2AF05',
    gradientEnd: '#D97706',
  },
  meet: {
    icon: '/images/icons/camera-icon.svg',
    label: 'Meet',
    subtitle: 'Video calls',
    color: '#00B574',
    gradientEnd: '#059669',
  },
  mail: {
    icon: '/images/icons/mail-icon.svg',
    label: 'Mail',
    subtitle: 'Email',
    color: '#F8497B',
    gradientEnd: '#A0033A',
  },
  calendar: {
    icon: '/images/icons/calendar-icon.svg',
    label: 'Calendar',
    subtitle: 'Schedule',
    color: '#A78BFA',
    gradientEnd: '#6D3FDE',
  },
  chat: {
    icon: '/images/icons/chat-icon.svg',
    label: 'Chat',
    subtitle: 'Messaging',
    color: '#FA7108',
    gradientEnd: '#C2410C',
  },
  commander: {
    icon: '/images/icons/commander-icon.svg',
    label: 'Commander',
    subtitle: 'Admin',
    color: '#0284C7',
    gradientEnd: '#0064C8',
  },
};

const DOCS_ICON = '/images/icons/file-icon.svg';
const DOCS_COLOR = '#06B6D4';
const DOCS_GRADIENT_END = '#0891B2';

const APP_ORDER: AppId[] = [
  'epicentre',
  'drive',
  'meet',
  'mail',
  'calendar',
  'chat',
  'commander',
];

/* ── Styled components ──────────────────────────────────── */
const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 4px;
`;

const TriggerGrid = styled.span`
  display: grid;
  grid-template-columns: repeat(3, 3px);
  grid-template-rows: repeat(3, 3px);
  gap: 2px;
  border: 1px solid ${BORDER};
  border-radius: 6px;
  padding: 6px;
`;

const TriggerDot = styled.span<{ $color: string }>`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${({ $color }: { $color: string }) => $color};
`;

const panelIn = keyframes`
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const Dropdown = styled.div<{ $up: boolean }>`
  position: absolute;
  ${({ $up }: { $up: boolean }) =>
    $up ? 'bottom: calc(100% + 8px);' : 'top: calc(100% + 8px);'}
  right: 0;
  width: 312px;
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 16px;
  box-shadow: ${SHADOW};
  padding: 14px;
  z-index: 2000;
  animation: ${panelIn} 150ms ${EASE} both;
`;

const CurrentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 4px 10px;
`;

const CurrentText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const YouAreIn = styled.span`
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${GRAPHITE};
`;

const AppName = styled.span`
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${INK};
`;

const Divider = styled.div`
  height: 1px;
  background: ${BORDER};
  margin: 2px 0 10px;
`;

const SectionLabel = styled.span`
  display: block;
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${GRAPHITE};
  padding: 0 4px;
  margin-bottom: 8px;
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
`;

const AppTile = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 150ms ${EASE};
  min-width: 0;

  &:hover {
    background: ${BG};
  }
`;

const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

const AppLabel = styled.span`
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${INK};
`;

const AppSubtitle = styled.span`
  font-size: 0.6875rem;
  color: ${GRAPHITE};
  white-space: nowrap;
`;

const IconWrap = styled.span<{
  $size: number;
  $color: string;
  $gradientEnd: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }: { $size: number }) => $size}px;
  height: ${({ $size }: { $size: number }) => $size}px;
  border-radius: ${({ $size }: { $size: number }) => ($size <= 36 ? 9 : 12)}px;
  background: linear-gradient(
    135deg,
    ${({ $color }: { $color: string }) => $color} 0%,
    ${({ $gradientEnd }: { $gradientEnd: string }) => $gradientEnd} 100%
  );

  img {
    filter: brightness(0) invert(1);
    display: block;
  }
`;

/* ── Sub-components ─────────────────────────────────────── */
const AppIcon = ({
  color,
  gradientEnd,
  icon,
  label,
  size = 40,
}: {
  color: string;
  gradientEnd: string;
  icon: string;
  label: string;
  size?: number;
}) => (
  <IconWrap $size={size} $color={color} $gradientEnd={gradientEnd}>
    <img
      src={icon}
      alt={label}
      style={{ width: size * 0.45, height: size * 0.45 }}
    />
  </IconWrap>
);

const Panel = ({
  appUrls,
  onClose,
  opensUpward,
}: {
  appUrls: Record<string, string>;
  onClose: () => void;
  opensUpward: boolean;
}) => {
  const { t } = useTranslation();
  const jumpTo = APP_ORDER.filter((id) => id in appUrls);

  return (
    <Dropdown $up={opensUpward}>
      <CurrentRow>
        <AppIcon
          icon={DOCS_ICON}
          label="Docs"
          color={DOCS_COLOR}
          gradientEnd={DOCS_GRADIENT_END}
          size={44}
        />
        <CurrentText>
          <YouAreIn>{t("YOU'RE IN")}</YouAreIn>
          <AppName>{t('Docs')}</AppName>
        </CurrentText>
      </CurrentRow>

      {jumpTo.length > 0 && (
        <>
          <Divider />
          <SectionLabel>{t('JUMP TO')}</SectionLabel>
          <AppGrid>
            {jumpTo.map((id) => {
              const { label, subtitle, icon, color, gradientEnd } =
                APP_META[id];
              return (
                <AppTile key={id} href={appUrls[id]} onClick={onClose}>
                  <AppIcon
                    icon={icon}
                    label={label}
                    color={color}
                    gradientEnd={gradientEnd}
                    size={36}
                  />
                  <AppInfo>
                    <AppLabel>{t(label)}</AppLabel>
                    <AppSubtitle>{t(subtitle)}</AppSubtitle>
                  </AppInfo>
                </AppTile>
              );
            })}
          </AppGrid>
        </>
      )}
    </Dropdown>
  );
};

/* ── Public export ──────────────────────────────────────── */
export const AppSwitcherButton = () => {
  const { data: config } = useConfig();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const appUrls = config?.APP_URLS ?? {};
  const hasOtherApps = APP_ORDER.some((id) => id in appUrls);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  if (!hasOtherApps) {
    return null;
  }

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOpensUpward(window.innerHeight - rect.bottom < 320);
    }
    setIsOpen((v: boolean) => !v);
  };

  return (
    <StyledWrapper ref={ref}>
      <Button
        color="brand"
        variant="tertiary"
        aria-label={t('Switch app')}
        aria-expanded={isOpen}
        onClick={handleOpen}
        icon={
          <TriggerGrid aria-hidden>
            {[...APP_ORDER, APP_ORDER[0], APP_ORDER[1]].map((id, i) => (
              <TriggerDot key={i} $color={APP_META[id].color} />
            ))}
          </TriggerGrid>
        }
      />
      {isOpen && (
        <Panel
          appUrls={appUrls}
          onClose={() => setIsOpen(false)}
          opensUpward={opensUpward}
        />
      )}
    </StyledWrapper>
  );
};
