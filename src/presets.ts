import type { BannerCopyPreset } from './types';

function todayStamp(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear() % 100).padStart(2, '0');
  return `${dd}.${mm}.${yy}`;
}

export function randomDraftId(): string {
  const major = Math.floor(Math.random() * 10);
  const minor = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const patch = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${major}.${minor}.${patch}`;
}

export interface ResolveOptions {
  date?: string;
  draftId?: string;
}

export function resolvePreset(
  copy: BannerCopyPreset | string,
  options: ResolveOptions = {},
): string {
  const date = options.date ?? todayStamp();
  const draftId = options.draftId ?? '0.00.0000';
  switch (copy) {
    case 'INDUSTRIAL':
      return `◆ WORK IN PROGRESS ◆ DRAFT ${date} ◆ BUILD 0x7F2A ◆ UNSTABLE FRAGMENT ◆ DO NOT DISTRIBUTE ◆`;
    case 'TRANSMISSION':
      return `▌ TRANSMISSION INCOMPLETE ▌ SIG ${date}-WIP ▌ AUTHOR: ARIX ▌ INTEGRITY 47% ▌ CONTENT MAY DRIFT ▌`;
    case 'CLINICAL':
      return `WIP_HAZARD [ DRAFT: ${draftId} ] [ AUTHOR: ARIX ] [ SECTOR 04-α ] [ INTEGRITY 47% ] [ HANDLE WITH CARE ] [ CONTENT MAY DRIFT ]`;
    default:
      return copy;
  }
}

export const PRESET_NAMES: BannerCopyPreset[] = [
  'INDUSTRIAL',
  'TRANSMISSION',
  'CLINICAL',
];
