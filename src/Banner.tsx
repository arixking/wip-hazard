import * as React from 'react';
import {
  BANNER_CLASS,
  IGNORE_ATTR,
  ITEM_CLASS,
  KEYFRAMES_CSS,
  TRACK_CLASS,
  WRAPPER_CLASS,
  bannerStyle,
  itemStyle,
  trackStyle,
  wrapperStyle,
} from './styles';
import type { BannerPosition } from './types';

export interface BannerProps {
  copy: string;
  color: string;
  position: Exclude<BannerPosition, 'split'>;
  height?: number;
  fontSize?: number | string;
  reverse?: boolean;
  injectKeyframes?: boolean;
}

export function Banner({
  copy,
  color,
  position,
  height,
  fontSize,
  reverse = false,
  injectKeyframes = true,
}: BannerProps): JSX.Element {
  const repeated = React.useMemo(() => {
    const items: string[] = [];
    for (let i = 0; i < 8; i++) items.push(copy);
    return items;
  }, [copy]);

  return (
    <div
      className={WRAPPER_CLASS}
      style={wrapperStyle(position)}
      {...{ [IGNORE_ATTR]: '' }}
      aria-hidden="true"
    >
      {injectKeyframes ? <style>{KEYFRAMES_CSS}</style> : null}
      <div
        className={BANNER_CLASS}
        style={bannerStyle(color, height, fontSize, {
          borderTop: position !== 'top',
          borderBottom: position !== 'bottom',
        })}
      >
        <div className={TRACK_CLASS} style={trackStyle(reverse)}>
          {repeated.map((text, i) => (
            <span key={i} className={ITEM_CLASS} style={itemStyle}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
