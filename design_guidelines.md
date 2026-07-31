# Neo-Sentinel Design Guidelines

## I. Direction

**Scientific instrument, not sci-fi HUD.** Neo-Sentinel is a working planetary-defence
console. It should read like precision measurement equipment: a cool graphite chassis,
hairline rules instead of boxes, dense tabular numerals, and colour reserved almost
entirely for data.

The audience is technical. Credibility comes from restraint and from numbers that hold up,
not from glow effects.

Dials: `DESIGN_VARIANCE 5` / `MOTION_INTENSITY 3` / `VISUAL_DENSITY 7`.

## II. The four locks

Audit these before shipping any change. They are what keep the interface coherent.

**Theme lock.** One dark theme, page-wide. No section inverts to light. Tokens live in
`client/src/index.css` under a combined `:root, .dark` block.

**Colour lock.** Sodium orange `--primary` (`28 96% 55%`) is the only brand and interactive
colour. It marks the active tab, the primary button, and the focus ring. Nothing else.

The four `--status-*` hues are a semantic risk ramp (nominal, elevated, high, critical).
They encode assessed state only and surface through `RiskChip`. They are never a second
accent and never decoration. The five `--chart-*` values are the one categorical series
ramp; charts read them off the document so they cannot drift from the theme.

**Shape lock.** 6px on surfaces (`rounded-lg`), 4px on controls (`rounded-md`), 2px on
chips and micro-labels (`rounded-sm`). Circular is reserved for slider thumbs and switch
knobs, where it is native form-control convention.

**Motion lock.** Transitions acknowledge input; nothing loops for show. The ambient
starfield is the only autonomous animation, and it stops under `prefers-reduced-motion`
and while the tab is hidden. Every animation is gated behind a
`prefers-reduced-motion: no-preference` query.

## III. Typography

- **Geist** for interface text. Headings are `font-semibold tracking-tight`, not oversized.
- **Geist Mono** for every number, identifier, and readout.
- All numeric readouts carry tabular figures (the `.tnum` utility or `[data-numeric]`), so
  digits never reflow as values change.
- `.field-label` is the small-caps label that names a data value. It is **not** an eyebrow:
  it never appears above a section heading.

## IV. Surfaces and layout

`Panel` is the single surface primitive: a flat plate with a hairline border and a tinted
shadow. Depth is never a glow.

Group related values with `border-t` and `divide-*` rather than nesting cards. `Readout`
renders one labelled measurement; a grid of them with hairline dividers is the default way
to present results.

Container is `max-w-[1400px]`. Full-height uses `min-h-[100dvh]`, never `h-screen`.
Every multi-column layout declares its single-column fallback below `md`.

Each section uses a distinct layout family: telemetry strip, chart grid, card grid,
form/results split, chat column, and the asymmetric 5/7 prose split on About. Do not
duplicate a family across sections.

## V. Interaction states

Every asynchronous surface ships four states, all of them present today in the simulator
and the predictor:

- **Loading** - skeletons shaped like the real content, so nothing shifts on arrival.
- **Empty** - names what the user should do next.
- **Error** - states what failed and offers a retry.
- **Success** - the result.

Contrast is verified, not assumed. Every text pair clears WCAG AA (4.5:1); the accent on
its foreground sits at 7.3:1. Focus is one accent outline applied globally via
`:focus-visible`.

## VI. Content honesty

This is the rule most easily lost.

- Numbers on screen derive from the data actually displayed. The catalogue's summary strip
  and both charts are computed from `CATALOGUE`, so they cannot disagree with the rows.
- The simulator evaluates published scaling relations (Collins, Melosh & Marcus 2005), not
  invented formulas. Its output is labelled as an order-of-magnitude estimate, and the
  About panel lists the exact relations used.
- Illustrative data is labelled illustrative. Diameters and designations in the catalogue
  are published values; encounter speed and approach date are not yet live, and the UI
  says so.
- Generated answers carry a caveat. The analyst panel states that responses may be wrong.

## VII. Explicitly out

No emoji in UI copy. No neon or outer glows. No `textShadow` on headings. No custom
cursors. No decorative status dots. No infinite float, wobble, or pulse animations. No
`hover:scale` on content. No em-dashes in visible copy. No pure `#000` or `#fff`. No
`window.addEventListener('scroll')` (use IntersectionObserver, or CSS scroll-driven
animation).

## VIII. Performance

Only the default tab is eager. The simulator, predictor, chat, and About load on demand,
which keeps recharts out of the initial bundle (initial payload ~165 kB gzip against
~314 kB when everything was eager). The starfield scales its star count to viewport area
and caps device pixel ratio at 2.
