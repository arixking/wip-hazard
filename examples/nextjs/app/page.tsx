'use client';

import { useState } from 'react';
import { WIPHazard } from 'wip-hazard';
import type { BannerCopyPreset, BannerPosition } from 'wip-hazard';

const PRESETS: BannerCopyPreset[] = ['INDUSTRIAL', 'TRANSMISSION', 'CLINICAL'];
const POSITIONS: BannerPosition[] = ['top', 'middle', 'bottom'];
const COLORS: { label: string; value: string }[] = [
  { label: 'hazard orange', value: '#FF5A1F' },
  { label: 'amber', value: '#F5C518' },
  { label: 'red', value: '#E63946' },
];

export default function Page() {
  const [preset, setPreset] = useState<BannerCopyPreset>('INDUSTRIAL');
  const [position, setPosition] = useState<BannerPosition>('middle');
  const [color, setColor] = useState<string>('#FF5A1F');
  const [disabled, setDisabled] = useState(false);

  return (
    <main style={{ padding: '64px 8vw 160px', maxWidth: 980, margin: '0 auto' }}>
      <header style={{ marginBottom: 48 }}>
        <p
          style={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            color: '#FF5A1F',
            letterSpacing: '0.18em',
            fontSize: 12,
            margin: 0,
          }}
        >
          ── RECEPTION-BAY-07 ──
        </p>
        <h1 style={{ fontSize: 56, lineHeight: 1.05, margin: '12px 0 8px' }}>
          The Crystallography of Half-Finished Things
        </h1>
        <p style={{ color: '#9b9b9b', maxWidth: 680, lineHeight: 1.6 }}>
          A draft article on the way certain ideas calcify before they are ready,
          and how to keep them molten just long enough to ship without them
          fossilizing into the wrong shape.
        </p>
      </header>

      <section
        data-wip-ignore
        style={{
          border: '1px solid #2a2a2e',
          padding: 16,
          borderRadius: 6,
          marginBottom: 48,
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 12,
          color: '#bcbcbc',
          background: '#141416',
        }}
      >
        <strong style={{ color: '#FF5A1F' }}>CONTROLS</strong> — this panel uses
        <code style={{ background: '#222', padding: '0 4px', margin: '0 4px' }}>data-wip-ignore</code>
        so its text is never scrambled.
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 12,
            marginTop: 12,
          }}
        >
          <label>
            preset:&nbsp;
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as BannerCopyPreset)}
            >
              {PRESETS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            position:&nbsp;
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as BannerPosition)}
            >
              {POSITIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            color:&nbsp;
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            &nbsp;disabled
          </label>
        </div>
      </section>

      <article style={{ lineHeight: 1.7, fontSize: 17 }}>
        <h2>I. Premature solidification</h2>
        <p>
          The first time you describe an idea out loud is also the first time it
          stops being malleable. Words are scaffolding that quickly becomes load
          bearing; once two people agree on a phrase, the underlying concept is
          locked into the shape of that phrase whether or not the shape is right.
          This is the central tax on premature articulation: clarity bought at
          the cost of optionality.
        </p>
        <p>
          The remedy is not to be vague. Vagueness is its own kind of trap, the
          one where everyone nods politely and silently disagrees. The remedy is
          to articulate <em>provisionally</em> — to say the thing while flagging
          loudly that the thing is still in flight. The banner you are reading
          this through is one literal instance of that flag.
        </p>

        <h2>II. The reception bay</h2>
        <p>
          Imagine a warehouse where partly-finished objects are stored in clearly
          labeled bays before they go anywhere near a shipping floor. In
          software, we have nothing like this. A document either exists or it
          does not; a feature either ships or it does not. The bay between draft
          and final is a private space, usually inside one person&apos;s head, and
          the social cost of letting anyone else into it is high. We end up
          shipping things that should still be in the bay, because the bay
          itself has no public address.
        </p>
        <p>
          A draft banner is a low-fidelity reception bay. It says: this thing
          exists at a reachable URL, but its contents are still moving. You may
          read it. You may not yet quote it. The transmission is incomplete and
          the integrity is not 100%.
        </p>

        <h2>III. Handling notes</h2>
        <p>
          Treat draft pages the way an industrial dock treats a crate marked
          FRAGILE: with the assumption that the contents will rearrange themselves
          if you set them down too hard. Do not link to a sentence as if it were
          the final sentence. Do not screenshot a paragraph as if it were the
          final paragraph. Allow the author the dignity of revision.
        </p>

        <p>
          <code style={{ background: '#1a1a1c', padding: '2px 6px', borderRadius: 3 }}>
            code blocks like this one are also excluded from scrambling
          </code>
        </p>

        <p style={{ color: '#888', fontSize: 14, marginTop: 64 }}>
          — end of draft fragment —
        </p>
      </article>

      <WIPHazard
        bannerCopy={preset}
        bannerPosition={position}
        bannerColor={color}
        disabled={disabled}
      />
    </main>
  );
}
