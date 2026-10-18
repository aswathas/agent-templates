# The gate

`tools/gate.mjs` — static analysis over source, with a brand-conditioned tier.

```bash
node tools/gate.mjs ./src                # human-readable
node tools/gate.mjs ./src --json         # machine-readable
node tools/gate.mjs ./src --severity block  # only blocking fails
node --test tools/gate.test.mjs          # 21 tests
```

Exit `0` clean, `1` blocking findings, `2` usage error.

## Why it exists

The most-installed anti-slop skill in the registry bans cream, terracotta and purple **unconditionally**. A pottery studio whose brand is terracotta gets a false FAIL forever. The rational response is to ignore the gate, which is the same as having no gate.

2.3 million installs of anti-slop advice exist. Almost none of it checks its own work. This one does, and it conditions on your tokens first.

## Two tiers

### Universal — always enforced

These are WCAG failures and fabrications, not taste. No brand setting excuses them.

| Rule | Severity | Catches |
|---|---|---|
| `focus-removed` | block | `outline-none` / `outline: none` with no replacement |
| `positive-tabindex` | block | positive `tabIndex`, which breaks natural tab order |
| `click-noninteractive` | block | `onClick` on `<div>`, `<span>`, `<li>`, `<tr>`, `<td>` |
| `img-no-alt` | warn | `<img>` with no `alt` |
| `unlabeled-input` | warn | `<input>` with no label and no `aria-label` |
| `placeholder-as-label` | warn | placeholder standing in for a label |
| `empty-button` | warn | button with no accessible name |
| `fabricated-proof` | block | "Trusted by 10,000+ teams", invented customer counts |
| `fabricated-claim` | warn | SOC 2, ISO 27001, 99.9% uptime, GDPR — unverified |
| `fake-metrics` | warn | "10x faster", "23% improvement" with no basis |
| `raw-hex` | warn | hex outside a token file |
| `motion-no-guard` | warn | animation with no `prefers-reduced-motion` |
| `motion-everywhere` | warn | `transition: all` |
| `shadow-at-rest` | warn | shadow on a static element |
| `glass` | warn | `backdrop-blur` panels |
| `eyebrow-chrome` | warn | tracked uppercase label above a heading |
| `hover-scale` | warn | `hover:scale-105` and friends |
| `inter-default` | warn | Inter with no considered alternative |
| `ai-purple` | block | purple family hue not declared in your tokens |

### Brand — only when your theme does not own the colour

| Rule | Fires when |
|---|---|
| `ai-purple` | a purple hue (250–300°, sat 45–95%) appears that your tokens do not declare |
| `gradient-text` | `bg-clip-text` with `text-transparent` |
| `gradient-mesh` | decorative `bg-gradient-to-*` wash |

## How brand-conditioning works

```
1. find globals.css, theme.css, index.css, or the Tailwind config
2. collect every hex it declares
3. read DESIGN.md and collect every hex named there
4. if a flagged colour is already in that set, it is your brand → stay silent
5. otherwise → flag it
```

A project with `--brand: #d97757` in `globals.css` gets no finding for `#d97757`. A project with that hex hardcoded inline gets a finding, because the fix is `var(--brand)`.

## Cross-file exemptions

Exemptions are evaluated against the **whole project**, not the file being scanned. A `prefers-reduced-motion` guard lives in `globals.css` while the animation lives in `page.tsx`; the guard has to silence the finding.

This was a real bug. Checking per-file meant every correctly-guarded project still flagged.

## What it cannot see

Static regex over source. It is blind to:

- Rendered geometry and layout at a real breakpoint
- Contrast against a rendered background
- Focus order in the live DOM
- Whether a component is actually reachable

**Use `chrome-devtools` MCP for the rendered half.** `taste-skill`'s `inspect.mjs` measures more deeply than this does.

## False positives

`rounded-uniform` and `shadow-at-rest` will fire on legitimate work — a product genuinely using one radius across its surfaces is not a defect. Both are **warn**, never blocking, because the cost of a wrong block is worse than a missed warn.

If a finding is wrong, fix the code rather than arguing with the meter.

## Related

- [ARCHITECTURE.md](../ARCHITECTURE.md) — where the gate sits
- [CONTRIBUTING.md](../CONTRIBUTING.md) — adding a rule
- [RESEARCH.md](../templates/uiux/RESEARCH.md) §13 — the eval that produced it