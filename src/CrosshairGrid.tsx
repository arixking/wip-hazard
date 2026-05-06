import * as React from 'react';
import { IGNORE_ATTR } from './styles';

export interface CrosshairGridProps {
  color: string;
  topInset: number;
  bottomInset: number;
  spacing?: number;
  armLength?: number;
  strokeWidth?: number;
  opacity?: number;
}

let patternIdCounter = 0;

const MONO_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

function pad(n: number, w = 2): string {
  return String(Math.floor(n)).padStart(w, '0');
}

function HeaderReadout({ color }: { color: string }): JSX.Element {
  const date = React.useMemo(() => {
    const d = new Date();
    return `${pad(d.getFullYear() % 100)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  }, []);
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        left: 24,
        color,
        opacity: 0.85,
        fontFamily: MONO_FONT,
        fontSize: 11,
        lineHeight: 1.55,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <div>RECEPTION-BAY-07</div>
      <div>SECTOR 04-α &nbsp;//&nbsp; FRAGMENT 0X7F2A</div>
      <div>SIG {date} &nbsp;//&nbsp; INTEGRITY 47%</div>
    </div>
  );
}

function TimecodeReadout({ color }: { color: string }): JSX.Element {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(
      () => setElapsed(performance.now() - start),
      80,
    );
    return () => window.clearInterval(id);
  }, []);

  const ms = Math.floor(elapsed / 10) % 100;
  const s = Math.floor(elapsed / 1000) % 60;
  const m = Math.floor(elapsed / 60000) % 60;
  const h = Math.floor(elapsed / 3600000);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 18,
        left: 24,
        color,
        opacity: 0.85,
        fontFamily: MONO_FONT,
        fontSize: 13,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      T+{h}:{pad(m)}:{pad(s)}.{pad(ms)}
    </div>
  );
}

export function CrosshairGrid({
  color,
  topInset,
  bottomInset,
  spacing = 200,
  armLength = 80,
  strokeWidth = 1.25,
  opacity = 0.28,
}: CrosshairGridProps): JSX.Element {
  const patternId = React.useMemo(() => `wip-crosshair-${++patternIdCounter}`, []);
  const tileW = spacing * 2;
  const tileH = spacing * 2;
  const a = { x: spacing / 2, y: spacing / 2 };
  const b = { x: spacing * 1.5, y: spacing * 1.5 };

  function cross(cx: number, cy: number, key: string) {
    return (
      <g key={key}>
        <line x1={cx} y1={cy - armLength} x2={cx} y2={cy + armLength} />
        <line x1={cx - armLength} y1={cy} x2={cx + armLength} y2={cy} />
      </g>
    );
  }

  return (
    <div
      {...{ [IGNORE_ATTR]: '' }}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: topInset,
        bottom: bottomInset,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity }}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width={tileW}
              height={tileH}
              patternUnits="userSpaceOnUse"
            >
              <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="square">
                {cross(a.x, a.y, 'a')}
                {cross(b.x, b.y, 'b')}
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
      <HeaderReadout color={color} />
      <TimecodeReadout color={color} />
    </div>
  );
}
