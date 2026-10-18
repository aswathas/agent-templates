# Architecture

How the routing actually works, and why it is built the way it is.

## The core idea

Generic AI UI is not a styling failure. It is what you get when nobody decided what the thing was for, so the model sampled the average of every page it has seen. See [RESEARCH.md](templates/uiux/RESEARCH.md) §1 for the papers behind that claim.

So the plugin front-loads a decision and routes the result. Everything else follows from that.

```
User request
    │
    ▼
Read the repo first           ← never ask what you can read
    │
    ▼
Seven-line brief              ← skills/discovery
    │
    ▼
Route every matching method   ← they compose, not first-match
    │
    ▼
Tokens → layout → styling     ← never interleaved
    │
    ▼
Verify with grounded critique ← bounded rounds, not a loop
```

## The brief

Seven lines. Not a questionnaire, not a form.

```
SUBJECT:    the one thing, as a verb
AUDIENCE:   the specific person
MUST-NOT:   the competitor or reference to avoid
REAL:       assets and content that genuinely exist
STACK:      framework, platform, styling, components
LANGUAGES:  locales shipping now, and RTL yes/no
ROUTES:     every method that applies
```

**Why a verb.** "Analytics dashboard" is a category. "Know why the number moved" is a decision. The first produces a category idea; the second produces a specific one, and a category idea renders as category slop.

**Why `REAL` matters.** With no photographs and no logo, the honest options are drawing in code, using the product's own interface, or finding real pictures of the subject's world from open archives. Planning around assets you do not have is how a hero ends up with a stock gradient.

## Routing

| Surface | Method |
|---|---|
| Landing, portfolio, product page, hero | `taste-skill` (external) |
| Dashboard, admin, table, form, app shell | `skills/app-ui` |
| React Native, Expo, SwiftUI, Flutter | `skills/mobile-ui` |
| Diagram editor, node graph, whiteboard | `skills/canvas-ui` |
| Multi-language, or any RTL script | `skills/i18n-rtl` |
| Any chart, graph, dashboard viz | `dataviz` (built in) |
| Figma as source of truth | Figma MCP |

**Routes compose.** A mobile app with charts, in Arabic, loads three skills. Loading the first one you notice is how a chart ships with the wrong colors and an Arabic layout ends up mirrored.

## Why the build is phased

```
1. Tokens        colors and type as CSS custom properties
2. Layout        geometry, hierarchy, responsive behavior
3. Styling       fill and polish within frozen geometry
```

Design2Code ([2403.03163](https://arxiv.org/abs/2403.03163)) measured that naive visual self-refinement causes regressions. Showing a model a screenshot of its own output and saying "fix the visual bugs" broke working layout.

DesignCoder ([2506.13663](https://arxiv.org/abs/2506.13663)) gives the fix: freeze layout geometry first, critique styling separately. UICrit ([2407.08850](https://arxiv.org/abs/2407.08850)) adds that critique grounded in normalized bounding boxes aligns ~55% better than free-form.

Interleaving these phases is the single largest cause of regression. Keep them separate.

## Where enforcement lives

| Layer | Tool | Sees |
|---|---|---|
| Static | `tools/gate.mjs` | Source text, declared tokens |
| Rendered | `chrome-devtools` MCP | Geometry, console, focus order, contrast in situ |

The gate is fast but blind to anything that only appears when a page renders. The browser layer is slow but sees the truth. **Both are needed.** The gate cannot see a focus order; the browser cannot be run on every edit.

## The brand-conditioning principle

Most anti-slop gates are a fixed ban list. That is wrong for any product whose brand is inside the banned family.

```
read tokens  →  is this colour the project already declares?
                    │
              yes   │   no
              ▼         ▼
         stay silent   flag it
```

Universal rules (focus, semantics, fabricated proof) always fire. Brand-tier rules (purple, gradient) only fire when the project's own tokens do not already own the colour.

## Layout

```
templates/uiux/
├── agents/ui-designer.md       routing agent, preloads the skills
├── skills/
│   ├── discovery/              the brief
│   ├── app-ui/                 product surfaces
│   ├── mobile-ui/              native + mobile web
│   ├── canvas-ui/              direct manipulation
│   └── i18n-rtl/               multi-language
├── commands/                   slash commands
├── tools/gate.mjs              static gate
└── .mcp.json                   chrome-devtools, shadcn, context7, designlang, figma
```

## Related

- [RESEARCH.md](templates/uiux/RESEARCH.md) — the evidence
- [GATE.md](templates/uiux/docs/GATE.md) — the rules and their tiers
- [SKILLS.md](templates/uiux/docs/SKILLS.md) — what each skill covers
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — common failures