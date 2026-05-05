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
  position: BannerPosition;
}

export function Banner({ copy, color, position }: BannerProps): JSX.Element {
  // Repeat enough times to fill at least 2x viewport width worth of marquee.
  // The animation translates -50% so we need duplicated content for seamless loop.
  const repeated = React.useMemo(() => {
    const items: string[] = [];
    for (let i = 0; i < 8; i++) items.push(copy);
    return items;
  }, [copy]);

  return (
    <div
      className={WRAPPER_CLASS}
      style={wrapperStyle(position)}
      // Belt-and-suspenders: the engine also excludes by class.
      {...{ [IGNORE_ATTR]: '' }}
      aria-hidden="true"
    >
      <style>{KEYFRAMES_CSS}</style>
      <div className={BANNER_CLASS} style={bannerStyle(color)}>
        <div className={TRACK_CLASS} style={trackStyle}>
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
