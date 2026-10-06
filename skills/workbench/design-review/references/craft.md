# Craft floor (all UI and motion work)

Merged from the Video&Motion studio rules, formbrain-public reviews, Sorted's design brief and Impeccable.
A project's `DESIGN.md` may lift one rule on purpose; it never happens by accident.

## Banned defaults
- Centred title on a gradient hero; everything fading in; generic particle bursts.
- Glassmorphism, glow on UI chrome, decorative pills, ornamental arrows or asterisks, corner labels, frame borders.
- Endless equal card grids; numbered section captions used as decoration.
- Redrawing a real product UI from imagination: use real screenshots or recordings.
- Mixing two component systems (e.g. shadcn + another kit) without a written reason.

## Foundations
- One display face and one UI face; one accent colour unless `DESIGN.md` says otherwise.
- Every value comes from `design/tokens.css`: colour roles, type scale, spacing scale, radii, shadows, motion durations.
- Small text never uses decorative colours; body text meets WCAG AA (4.5:1), large text 3:1.
- Layouts work at 320 px and at 200 % text; no horizontal scroll.
- Visible keyboard focus; semantic HTML; labels on every input; touch targets ≥ 44 px.
- Motion communicates state, hierarchy or continuity; `prefers-reduced-motion` gets a static equivalent.
- States designed, not defaulted: loading, empty, error, success, disabled.
- Copy: sentence case unless the brand says otherwise; never imply something was saved or sent when it wasn't.

## Video / motion extras
- The first 2 seconds carry the hook; something new happens every 2–4 seconds.
- Springs over easing curves; no overshoot on type; seeded randomness only.
- Score each contact sheet (hook, phone readability, motion, variety, brand, sound sync) to ≥8 before the full render.
