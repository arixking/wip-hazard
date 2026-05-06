import { animate, scrambleText } from 'animejs';
import {
  IGNORE_ATTR,
  SCRAMBLE_ATTR,
  WRAPPER_CLASS,
} from './styles';
import type { ResolvedCycleTiming, ScrambleStyle } from './types';

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'OPTION',
  'BUTTON',
  'CANVAS',
  'SVG',
  'IFRAME',
]);

const MIN_LEN = 4;
const MAX_LEN = 12;
const DENSITY_MIN = 1;
const DENSITY_MAX = 2;
const DENSITY_DIVISOR = 2000;
const NUM_LOOPS = 1;
const IDLE_MIN_MS = 700;
const IDLE_MAX_MS = 1500;
const OBSERVER_DEBOUNCE_MS = 500;
const REFRESH_THROTTLE_MS = 500;

export interface ScrambleEngineOptions {
  density?: number;
  cycleTiming: ResolvedCycleTiming;
  scrambleStyle: ScrambleStyle;
  bannerEl: HTMLElement | null;
}

interface ActiveAnimation {
  cancel: () => void;
}

export class ScrambleEngine {
  private root: HTMLElement;
  private bannerEl: HTMLElement | null;
  private cycleTiming: ResolvedCycleTiming;
  private scrambleStyle: ScrambleStyle;
  private overrideDensity?: number;

  private nodes: Text[] = [];
  private totalLen = 0;
  private density = DENSITY_MIN;

  private active = new Set<ActiveAnimation>();
  private wrappedSpans = new Set<HTMLElement>();

  private observer: MutationObserver | null = null;
  private observerDebounce: number | null = null;
  private lastRefresh = 0;

  private stopped = false;
  private slotTimeouts = new Set<number>();

  constructor(root: HTMLElement, options: ScrambleEngineOptions) {
    this.root = root;
    this.bannerEl = options.bannerEl;
    this.cycleTiming = options.cycleTiming;
    this.scrambleStyle = options.scrambleStyle;
    this.overrideDensity = options.density;
  }

  start(): void {
    if (this.stopped) return;
    this.refresh();
    this.observer = new MutationObserver((mutations) => this.onMutations(mutations));
    this.observer.observe(this.root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const perLoop = Math.max(1, Math.ceil(this.density / NUM_LOOPS));
    const totalCycle =
      this.cycleTiming.scrambleDuration +
      this.cycleTiming.holdDuration +
      this.cycleTiming.unscrambleDuration;
    const offset = Math.max(50, Math.floor(totalCycle / NUM_LOOPS));

    for (let loopIdx = 0; loopIdx < NUM_LOOPS; loopIdx++) {
      for (let slot = 0; slot < perLoop; slot++) {
        const initialDelay = loopIdx * offset + slot * Math.floor(offset / Math.max(1, perLoop));
        const t = window.setTimeout(() => {
          this.slotTimeouts.delete(t);
          this.runSlot();
        }, initialDelay);
        this.slotTimeouts.add(t);
      }
    }
  }

  stop(): void {
    this.stopped = true;
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.observerDebounce !== null) {
      window.clearTimeout(this.observerDebounce);
      this.observerDebounce = null;
    }
    for (const t of this.slotTimeouts) window.clearTimeout(t);
    this.slotTimeouts.clear();
    for (const a of this.active) {
      try {
        a.cancel();
      } catch {
        /* noop */
      }
    }
    this.active.clear();
    for (const span of Array.from(this.wrappedSpans)) this.unwrap(span, true);
    this.wrappedSpans.clear();
  }

  private onMutations(mutations: MutationRecord[]): void {
    let relevant = false;
    for (const m of mutations) {
      const target = m.target as Node;
      if (this.isOurDom(target)) continue;
      relevant = true;
      break;
    }
    if (!relevant) return;
    if (this.observerDebounce !== null) window.clearTimeout(this.observerDebounce);
    this.observerDebounce = window.setTimeout(() => {
      this.observerDebounce = null;
      const now = Date.now();
      if (now - this.lastRefresh < REFRESH_THROTTLE_MS) return;
      this.refresh();
    }, OBSERVER_DEBOUNCE_MS);
  }

  private isOurDom(node: Node): boolean {
    let cur: Node | null = node;
    while (cur) {
      if (cur instanceof Element) {
        if (this.bannerEl && (cur === this.bannerEl || this.bannerEl.contains(cur))) return true;
        if (cur.hasAttribute(SCRAMBLE_ATTR)) return true;
        if (cur.classList && cur.classList.contains(WRAPPER_CLASS)) return true;
      }
      cur = cur.parentNode;
    }
    return false;
  }

  private isExcluded(parent: Element | null): boolean {
    let cur: Element | null = parent;
    while (cur) {
      if (SKIP_TAGS.has(cur.tagName)) return true;
      if (cur.hasAttribute(IGNORE_ATTR)) return true;
      if (cur.hasAttribute(SCRAMBLE_ATTR)) return true;
      if (cur.getAttribute('contenteditable') === 'true') return true;
      if (this.bannerEl && (cur === this.bannerEl || this.bannerEl.contains(cur))) return true;
      if (cur.classList && cur.classList.contains(WRAPPER_CLASS)) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  private refresh(): void {
    this.lastRefresh = Date.now();
    const nodes: Text[] = [];
    let total = 0;
    const walker = document.createTreeWalker(this.root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const tn = node as Text;
        const text = tn.nodeValue;
        if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
        if (text.length < MIN_LEN) return NodeFilter.FILTER_REJECT;
        if (this.isExcluded(tn.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const tn = n as Text;
      nodes.push(tn);
      total += tn.nodeValue?.length ?? 0;
    }
    this.nodes = nodes;
    this.totalLen = total;

    if (this.overrideDensity !== undefined) {
      this.density = clamp(this.overrideDensity, 1, 20);
    } else if (total < 100) {
      this.density = Math.min(3, nodes.length || 1);
    } else {
      this.density = clamp(Math.floor(total / DENSITY_DIVISOR), DENSITY_MIN, DENSITY_MAX);
    }
  }

  private pickRange(): { node: Text; start: number; len: number } | null {
    if (this.nodes.length === 0) return null;
    for (let attempt = 0; attempt < 8; attempt++) {
      const idx = Math.floor(Math.random() * this.nodes.length);
      const node = this.nodes[idx];
      if (!node || !node.isConnected) continue;
      const text = node.nodeValue ?? '';
      if (text.length < MIN_LEN) continue;
      if (this.isExcluded(node.parentElement)) continue;
      const maxLen = Math.min(MAX_LEN, text.length);
      if (maxLen < MIN_LEN) continue;
      const len = MIN_LEN + Math.floor(Math.random() * (maxLen - MIN_LEN + 1));
      const start = Math.floor(Math.random() * (text.length - len + 1));
      if (rangeIntersectsSelection(node, start, len)) continue;
      return { node, start, len };
    }
    return null;
  }

  private wrap(node: Text, start: number, len: number): HTMLSpanElement | null {
    try {
      const after = node.splitText(start);
      after.splitText(len);
      const parent = after.parentNode;
      if (!parent) return null;
      const span = document.createElement('span');
      span.setAttribute(SCRAMBLE_ATTR, '');
      span.setAttribute('data-wip-original', after.nodeValue ?? '');
      span.style.color = 'inherit';
      span.style.font = 'inherit';
      span.style.background = 'transparent';
      parent.insertBefore(span, after);
      span.appendChild(after);
      this.wrappedSpans.add(span);
      return span;
    } catch {
      return null;
    }
  }

  private unwrap(span: HTMLElement, restoreOriginal = false): void {
    const parent = span.parentNode;
    this.wrappedSpans.delete(span);
    if (!parent) return;
    if (restoreOriginal) {
      const original = span.getAttribute('data-wip-original') ?? '';
      span.textContent = original;
    }
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
    if (parent instanceof Element || parent instanceof Document) {
      try {
        (parent as Element).normalize();
      } catch {
        /* noop */
      }
    }
  }

  private runSlot(): void {
    if (this.stopped) return;
    const pick = this.pickRange();
    if (!pick) {
      const t = window.setTimeout(() => {
        this.slotTimeouts.delete(t);
        this.runSlot();
      }, 250);
      this.slotTimeouts.add(t);
      return;
    }
    const { node, start, len } = pick;
    const original = (node.nodeValue ?? '').slice(start, start + len);
    const span = this.wrap(node, start, len);
    if (!span) {
      const t = window.setTimeout(() => {
        this.slotTimeouts.delete(t);
        this.runSlot();
      }, 50);
      this.slotTimeouts.add(t);
      return;
    }
    span.innerHTML = escapeHtml(original);

    const total =
      this.cycleTiming.scrambleDuration +
      this.cycleTiming.holdDuration +
      this.cycleTiming.unscrambleDuration;

    const finish = () => {
      this.active.delete(handle);
      try {
        span.textContent = original;
      } catch {
        /* noop */
      }
      this.unwrap(span);
      if (this.stopped) return;
      const idle = IDLE_MIN_MS + Math.floor(Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS));
      const t = window.setTimeout(() => {
        this.slotTimeouts.delete(t);
        this.runSlot();
      }, idle);
      this.slotTimeouts.add(t);
    };

    let cancelled = false;
    let anim: unknown;
    const handle: ActiveAnimation = {
      cancel: () => {
        cancelled = true;
        const a = anim as { pause?: () => void; cancel?: () => void } | undefined;
        try {
          a?.pause?.();
        } catch {
          /* noop */
        }
        try {
          a?.cancel?.();
        } catch {
          /* noop */
        }
      },
    };
    this.active.add(handle);

    try {
      const { ease: scrambleEase, ...restStyle } = this.scrambleStyle;
      anim = animate(span, {
        innerHTML: scrambleText({
          chars: 'A-Z',
          ease: scrambleEase ?? 'inOutQuad',
          ...restStyle,
        }) as unknown as string,
        duration: Math.min(1000, total),
        ease: 'linear',
        onComplete: () => {
          if (cancelled) return;
          finish();
        },
      });
    } catch {
      finish();
    }
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function rangeIntersectsSelection(node: Text, start: number, len: number): boolean {
  const sel = typeof window !== 'undefined' ? window.getSelection() : null;
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
  for (let i = 0; i < sel.rangeCount; i++) {
    const r = sel.getRangeAt(i);
    try {
      if (r.intersectsNode(node)) {
        if (r.startContainer === node && r.endContainer === node) {
          const a = Math.max(r.startOffset, start);
          const b = Math.min(r.endOffset, start + len);
          if (a < b) return true;
        } else {
          return true;
        }
      }
    } catch {
      /* noop */
    }
  }
  return false;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
