import type { BannerCopyPreset } from './types';

function todayStamp(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  return `${dd}.${mm}.${yy}`;
}

export function resolvePreset(
  copy: BannerCopyPreset | string,
  date: string = todayStamp(),
): string {
  switch (copy) {
    case 'INDUSTRIAL':
      return `◆ WORK IN PROGRESS ◆ DRAFT ${date} ◆ BUILD 0x7F2A ◆ UNSTABLE FRAGMENT ◆ DO NOT DISTRIBUTE ◆`;
    case 'TRANSMISSION':
      return `▌ TRANSMISSION INCOMPLETE ▌ SIG ${date}-WIP ▌ AUTHOR: ARIX ▌ INTEGRITY 47% ▌ CONTENT MAY DRIFT ▌`;
    case 'CLINICAL':
      return `[ DRAFT ] [ ITER ${date} ] [ STATUS: IN-FLIGHT ] [ RECEPTION-BAY-07 ] [ HANDLE WITH CARE ]`;
    default:
      return copy;
  }
}

export const PRESET_NAMES: BannerCopyPreset[] = [
  'INDUSTRIAL',
  'TRANSMISSION',
  'CLINICAL',
];
