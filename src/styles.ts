import type { CSSProperties } from 'react';
import type { BannerPosition } from './types';

export const WRAPPER_CLASS = 'wip-hazard-root';
export const BANNER_CLASS = 'wip-hazard-banner';
export const TRACK_CLASS = 'wip-hazard-track';
export const ITEM_CLASS = 'wip-hazard-item';
export const SCRAMBLE_ATTR = 'data-wip-scramble';
export const IGNORE_ATTR = 'data-wip-ignore';

export function wrapperStyle(position: BannerPosition): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    pointerEvents: 'none',
    zIndex: 9999,
  };
  if (position === 'top') return { ...base, top: 0 };
  if (position === 'bottom') return { ...base, bottom: 0 };
  return { ...base, top: '50%', transform: 'translateY(-50%)' };
}

export function bannerStyle(color: string): CSSProperties {
  return {
    width: '100%',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color,
    opacity: 0.85,
    color: '#0a0a0a',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '28px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    overflow: 'hidden',
    boxShadow:
      '0 1px 0 rgba(0,0,0,0.35) inset, 0 -1px 0 rgba(0,0,0,0.35) inset',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
}

export const trackStyle: CSSProperties = {
  display: 'flex',
  width: 'max-content',
  willChange: 'transform',
  animation: 'wip-hazard-marquee 56s linear infinite',
};

export const itemStyle: CSSProperties = {
  paddingRight: '3rem',
  flex: '0 0 auto',
};

export const KEYFRAMES_CSS = `
@keyframes wip-hazard-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .${TRACK_CLASS} { animation: none !important; }
}
`;
