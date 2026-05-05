import * as React from 'react';
import { Banner } from './Banner';
import { ScrambleEngine } from './ScrambleEngine';
import { resolvePreset } from './presets';
import { WRAPPER_CLASS } from './styles';
import type { ResolvedCycleTiming, WIPHazardProps } from './types';

const DEFAULT_TIMING: ResolvedCycleTiming = {
  scrambleDuration: 400,
  holdDuration: 100,
  unscrambleDuration: 400,
};

function resolveTiming(input: WIPHazardProps['cycleTiming']): ResolvedCycleTiming {
  const t: ResolvedCycleTiming = {
    scrambleDuration: input?.scrambleDuration ?? DEFAULT_TIMING.scrambleDuration,
    holdDuration: input?.holdDuration ?? DEFAULT_TIMING.holdDuration,
    unscrambleDuration: input?.unscrambleDuration ?? DEFAULT_TIMING.unscrambleDuration,
  };
  const total = t.scrambleDuration + t.holdDuration + t.unscrambleDuration;
  if (total > 1000) {
    const scale = 1000 / total;
    return {
      scrambleDuration: Math.floor(t.scrambleDuration * scale),
      holdDuration: Math.floor(t.holdDuration * scale),
      unscrambleDuration: Math.floor(t.unscrambleDuration * scale),
    };
  }
  return t;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function WIPHazard(props: WIPHazardProps): JSX.Element | null {
  const {
    bannerColor = '#FF5A1F',
    bannerPosition = 'middle',
    bannerCopy = 'INDUSTRIAL',
    density,
    cycleTiming,
    scrambleStyle = {},
    disabled = false,
  } = props;

  const copy = React.useMemo(() => resolvePreset(bannerCopy), [bannerCopy]);
  const timing = React.useMemo(() => resolveTiming(cycleTiming), [cycleTiming]);
  const styleKey = React.useMemo(() => JSON.stringify(scrambleStyle), [scrambleStyle]);

  React.useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (prefersReducedMotion()) return;

    const bannerEl = document.querySelector(`.${WRAPPER_CLASS}`) as HTMLElement | null;
    const engine = new ScrambleEngine(document.body, {
      density,
      cycleTiming: timing,
      scrambleStyle,
      bannerEl,
    });
    engine.start();
    return () => engine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, density, timing.scrambleDuration, timing.holdDuration, timing.unscrambleDuration, styleKey]);

  if (disabled) return null;

  return <Banner copy={copy} color={bannerColor} position={bannerPosition} />;
}
