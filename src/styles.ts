import type { CSSProperties } from 'react';
import type { BannerPosition } from './types';

export const WRAPPER_CLASS = 'wip-hazard-root';
export const BANNER_CLASS = 'wip-hazard-banner';
export const TRACK_CLASS = 'wip-hazard-track';
export const ITEM_CLASS = 'wip-hazard-item';
export const SCRAMBLE_ATTR = 'data-wip-scramble';
export const IGNORE_ATTR = 'data-wip-ignore';

export function wrapperStyle(
  position: Exclude<BannerPosition, 'split'>,
): CSSProperties {
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

function withAlpha(color: string, alpha: number): string {
  const hex = color.trim();
  const m6 = /^#([0-9a-f]{6})$/i.exec(hex);
  const m3 = /^#([0-9a-f]{3})$/i.exec(hex);
  if (m6 && m6[1]) {
    const h = m6[1];
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (m3 && m3[1]) {
    const h = m3[1];
    const r = parseInt(h[0]! + h[0]!, 16);
    const g = parseInt(h[1]! + h[1]!, 16);
    const b = parseInt(h[2]! + h[2]!, 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

export interface BannerStyleOptions {
  borderTop?: boolean;
  borderBottom?: boolean;
}

export function bannerStyle(
  color: string,
  height = 160,
  fontSize?: number | string,
  options: BannerStyleOptions = {},
): CSSProperties {
  const { borderTop = true, borderBottom = true } = options;
  const computedFontSize =
    fontSize ?? `${Math.max(14, Math.round(height * 0.32))}px`;
  const fontSizeCss =
    typeof computedFontSize === 'number' ? `${computedFontSize}px` : computedFontSize;
  return {
    width: '100%',
    height: `${height}px`,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: withAlpha(color, 0.1),
    color,
    borderTop: borderTop ? `1px solid ${withAlpha(color, 0.8)}` : 'none',
    borderBottom: borderBottom ? `1px solid ${withAlpha(color, 0.8)}` : 'none',
    boxSizing: 'border-box',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: fontSizeCss,
    fontWeight: 400,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    overflow: 'hidden',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
}

export function trackStyle(reverse = false): CSSProperties {
  return {
    display: 'flex',
    width: 'max-content',
    willChange: 'transform',
    animation: `${reverse ? 'wip-hazard-marquee-reverse' : 'wip-hazard-marquee'} 112s linear infinite`,
  };
}

export const itemStyle: CSSProperties = {
  paddingRight: '3rem',
  flex: '0 0 auto',
};

export const KEYFRAMES_CSS = `
@keyframes wip-hazard-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@keyframes wip-hazard-marquee-reverse {
  from { transform: translate3d(-50%, 0, 0); }
  to   { transform: translate3d(0, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .${TRACK_CLASS} { animation: none !important; }
}
`;
