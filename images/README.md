# Post images

Three 1200×628 PNGs at 2× device scale (2400×1256), sized for LinkedIn's link-preview and feed image slots.

| File | Use |
|---|---|
| `out/01-gate.png` | The brand-conditioned comparison. **Lead with this** — it is the proof the post argues from. |
| `out/02-architecture.png` | The routing architecture. Use in the carousel or as a follow-up post. |
| `out/03-eval.png` | The blinded A/B result. Use in the carousel. |

## Rebuild

```bash
npm install          # playwright, dev only
npm run render
```

Sources are plain HTML in `images/src/`. Edit the HTML, re-run, done. No design tool, no image API, no keys.

**The renderer asserts no overflow and exits 1 if any element runs past the 628px frame.** A screenshot of clipped content still renders, so measuring is the only way to catch it. Every one of these images overflowed at least once during authoring and looked fine in the PNG until it was measured.

## Legibility at feed size

LinkedIn shows a feed image near 600px wide. These are 1200px CSS at 2x DPR, so a reader sees them at roughly half scale.

That makes the type floor different from a web page. The source type is sized so the *viewed* size clears the bar, not so the CSS value does. Anything under 11px in the source becomes sub-pixel in the feed. The `impeccable` hook caught six of those during authoring; the same class of failure that the eval-1 candidate found in its own overflow detector — a check that looks right and catches nothing.

## Why HTML and not an image model

Every visual here is a number the post makes a claim about. 15 findings, 2 blocking, exit 1. A score of 5 against 1. Those have to be exact and they have to stay in sync with the code that produced them. A generated illustration would be decorative and would drift the moment a number changed.

The typography, the two-colour comparison, and the bar lengths are all things CSS already does well.

## Design notes

Every value in these files resolves to something checkable. The bar widths in `03-eval` are the literal rubric scores: A scored 0/0/1/0/0/0, B scored 0/0/2/1/1/1. Nothing is approximated.

Contrast was checked, not eyeballed. The `impeccable` design hook flagged three real failures during authoring — `#999` footer text at 2.8:1, and body copy under 12px in two files. All fixed before rendering.

The one thing left standing is the 10.5px uppercase tracked labels. Those are labels, not body copy, and the rule targets body text.

## Carousel order

LinkedIn allows up to 20 images. If you post all three:

1. `01-gate.png` — the problem and the fix, stated as a comparison
2. `02-architecture.png` — how it routes
3. `03-eval.png` — the evidence

The gate image leads because it is the only claim in the post that a reader can verify in ten seconds.