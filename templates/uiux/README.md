# uiux

Frontend design agent for Claude Code. Establishes the brief before code, routes each surface to the right method, verifies in a real browser.

## Install

```bash
/plugin marketplace add C:/Users/aswat/uiux
/plugin install uiux@uiux
```

Strongly recommended — this plugin delegates all marketing work to it:

```bash
npx skills add leonxlnx/taste-skill
```

Without it the agent still builds marketing surfaces to the same standard, just without the direction library and browser inspector.

## The shape

```
SUBJECT → AUDIENCE → MUST-NOT → REAL ASSETS → STACK → ROUTE
```

Nothing is designed until that exists. Generic output is what happens when nobody decided what the thing was for.

| Surface | Route |
|---|---|
| Landing, portfolio, product page, hero, marketing site | `taste-skill` |
| Dashboard, admin, table, form, settings, app shell | `app-ui` |
| Native or mobile-web app — RN, Expo, SwiftUI, Flutter | `mobile-ui` |
| Diagram editor, node graph, whiteboard, drawing tool, map | `canvas-ui` |
| More than one language, or any RTL script | `i18n-rtl` |
| Any chart, graph, plot, dashboard viz | `dataviz` (built-in) |
| Figma as source of truth | Figma MCP |
| A design system as the deliverable | Style Dictionary or Terrazzo |

**Routes compose.** A mobile app with charts, in Arabic, loads `mobile-ui` + `dataviz` + `i18n-rtl` — all three. Loading the first one you noticed is how a chart ships with the wrong colors.

## Layout

```
uiux/
├── .claude-plugin/{plugin,marketplace}.json
├── AGENT_CARD.md
├── RESEARCH.md               ← why every rule exists. Read before changing one.
├── skills/
│   ├── discovery/SKILL.md    the brief, before any code
│   └── app-ui/SKILL.md       product UI — density, all 9 states, keyboard, shell
├── agents/ui-designer.md     routes, builds in phases, verifies
├── commands/
│   ├── ui-start.md           brief-first build
│   ├── ui-review.md          render, critique, rank
│   └── ui-states.md          product-state audit
├── tools/
│   ├── gate.mjs               brand-conditioned gate — reads your tokens first
│   └── gate.test.mjs          21 tests
└── .mcp.json                 chrome-devtools · shadcn · context7 · designlang · figma
```

## Commands

```
/ui-start <what you're building>   brief first, confirm direction, then build
/ui-review <url or path>          screenshot at 360/768/1440, ranked findings
/ui-states <view>                 the 9-state table for product UI
/ui-gate <path>                   run the brand-conditioned gate
```

## What it will not ship

A gradient hero. An eyebrow badge above every heading. Icon-topped feature cards. `hover:scale-105` on everything. Inter as an unearned default. A raw hex in a themed file. `outline: none` with no replacement. A click handler on a `<div>`. Color as the only status signal. A happy-path-only surface. Invented customers, quotes, statistics or logos. Invented product behaviour stated as fact.

## MCP servers

| Server | Why |
|---|---|
| `chrome-devtools` | You cannot claim a UI works without rendering it |
| `shadcn` | Don't hand-write what a maintained component exists for |
| `context7` | Tailwind/React APIs go stale in memory |
| `designlang` | Extract a real design system from a reference URL |
| `figma` | Pull variables and layout from a Figma file |

No API keys required. `designlang` needs Node 20+ and installs nothing globally.

## Building in phases

Tokens → layout → styling. Never interleaved. Interleaving is the top cause of regressions — Design2Code measured that screenshot self-refinement breaks working layout.

## Design decisions this comes from

- **Constraint, not prompting.** Retrieval over assembly, token contracts before code, human-picked directions from a library. Better prompts don't work — extended reasoning makes UI structurally better and aesthetically *no* better (2403.03163, 2310.06452).
- **Convergence, not fonts.** Banning Inter just produces Space Grotesk. The ban has to be on convergence, which is why `taste-skill` deals from a 20-direction library instead of naming a replacement.
- **Grounded critique.** Bounding-box critique improves alignment ~55% over free-form (2407.08850). Screenshot-plus-"fix it" regresses (2403.03163).
- **Measured, not asserted.** taste-skill's bans carry data: icon cards 1% on top-scoring sites vs 28% on weak ones; gradients 22% vs 52%.

## Swapping the role

Copy the tree. Rewrite `agents/<role>.md`, replace `skills/`, point `.mcp.json`. The routing structure — brief first, route by surface, phased build, bounded verification — is what generalizes.

## Ports

Skills and commands are plain Markdown. Codex reads `AGENTS.md`; Cursor reads `.cursor/rules/*.mdc`; OpenCode reads `AGENTS.md`. Concatenate the SKILL bodies and the agent system prompt; only the manifest paths differ.

## License

MIT