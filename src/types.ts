export type BannerPosition = 'top' | 'middle' | 'bottom' | 'split';

export type BannerCopyPreset = 'INDUSTRIAL' | 'TRANSMISSION' | 'CLINICAL';

export interface CycleTiming {
  scrambleDuration?: number;
  holdDuration?: number;
  unscrambleDuration?: number;
}

export interface ResolvedCycleTiming {
  scrambleDuration: number;
  holdDuration: number;
  unscrambleDuration: number;
}

export interface ScrambleStyle {
  chars?: string;
  ease?: string;
  from?: 'left' | 'center' | 'right' | 'random' | 'auto' | number;
  reversed?: boolean;
  cursor?: boolean | number | string;
  perturbation?: number;
  seed?: number;
  override?: boolean | string;
  revealRate?: number;
  settleDuration?: number;
  settleRate?: number;
  revealDelay?: number;
  delay?: number;
}

export interface WIPHazardProps {
  bannerColor?: string;
  bannerPosition?: BannerPosition;
  bannerCopy?: BannerCopyPreset | string;
  density?: number;
  cycleTiming?: CycleTiming;
  scrambleStyle?: ScrambleStyle;
  disabled?: boolean;
}
