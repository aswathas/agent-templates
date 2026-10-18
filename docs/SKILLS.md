# Skills reference

What each skill covers, what it does not, and where the boundaries are.

## The three-tier split

| Tier | Skills | Rule |
|---|---|---|
| **This plugin** | discovery, app-ui, mobile-ui, canvas-ui, i18n-rtl | Judgment no existing skill covers |
| **External** | taste-skill, dataviz, Figma MCP | Already good enough; depend, do not rebuild |
| **Bundled tool** | gate.mjs | Judgment that must be executable |

Roughly 93,000 skills exist. Anti-slop is saturated in prose and empty in enforcement. Rebuilding a fifth "make your UI better" skill adds nothing.

## discovery

**Use first, before any visual change.**

Six questions that decide everything: the one thing as a verb, the specific audience, what it must not look like, what assets genuinely exist, the stack, the locales, and which routes apply.

**Why it exists.** Of the ten most-installed design skills in the registry, exactly one asks real questions, and only because its cloud generation costs money. `taste-skill` states the opposite policy:

> *"If the request is vague, decide and state your reading in one line instead of asking."*

That works when the subject is a physical thing with attributes to inventory. It fails for an app, where there is no street to inventory.

**When the brief is thin,** state your reading in one line and continue. A wrong reading costs one message; a blank page costs the whole build.

## app-ui

**Web product surfaces.** Density over decoration, all nine states, tables, forms, focus management, app shell.

**Not marketing.** Landing pages and portfolios route to `taste-skill`.

The common failure is the landing-page instinct applied to a dashboard: air it out, card it up, round it. That wastes vertical space and slows scanning.

The nine states: loading, empty (first run), empty (filtered), error, partial, permission denied, long content, disabled, success. Product UI is judged on the paths that are not the happy path.

## mobile-ui

**Native and mobile web.** Touch targets (44pt iOS, 48dp Android), platform-native affordances, safe areas, offline, Dynamic Type, performance.

**iOS and Android are different products.** Android must have a visible back affordance; iOS gets the edge-swipe. Build two layouts when you ship both.

Every gesture needs a visible equivalent. Users miss gestures constantly — motor ability, disability, or a plain wrong guess.

## canvas-ui

**Direct manipulation.** Diagram editors, node graphs, whiteboards, maps, drag-and-drop layouts.

**The rule:** every gesture has a keyboard and button equivalent. A user who cannot move a node without holding the mouse has a broken editor, and the failure is invisible in a screenshot.

Covers the pointer model (`setPointerCapture` or drags die mid-gesture), hit targets, selection semantics, the key map, and the frame budget.

## i18n-rtl

**Multi-language and right-to-left.** Translation-safe layout, logical properties, locale formatting through `Intl`.

**The bug list that ships anyway:** hardcoded strings, concatenated sentences, `text-transform: uppercase` (wrong for Turkish, German, most scripts), `left`/`right` in CSS, fixed widths on text, English-only formatting.

Use `margin-inline-start` over `margin-left`. That single substitution makes a whole stylesheet RTL-safe.

## Not bundled, and why

**taste-skill** (98.7k★, MIT) — marketing art direction. 20 researched directions drawn from 247 real sites, a real-browser inspector, measured bans. Better than anything we could write. Depend on it.

**dataviz** — built into Claude Code. Charts, plots, dashboards. Not duplicated here.

**Figma MCP** — official, `https://mcp.figma.com/mcp`. Token and variable sync is production-ready; "Figma to working app with state and auth" is not.

**Style Dictionary / Terrazzo** — token pipelines, when a design system is the deliverable.

## Related

- [ARCHITECTURE.md](../ARCHITECTURE.md) — how routing picks between these
- [templates/uiux/skills/](../templates/uiux/skills/) — the sources