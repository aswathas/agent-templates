---
name: app-ui
description: Use when building or changing product UI — dashboards, admin panels, tables, forms, settings, app shells, and any interface whose job is operating rather than persuading. Covers dense data display, every UI state, keyboard and focus behavior, and app-shell navigation. NOT for marketing pages — route those to taste-skill.
user-invocable: false
---

Product UI is judged differently from marketing UI. Nobody arrives to admire it; they arrive to get something done, possibly eight times a day, possibly annoyed. Expression loses to legibility, density, and predictability — the brand lives in precise details, not in the hero.

**This skill does not cover marketing.** Landing pages, portfolios, product pages, hero sections → `taste-skill`. Route there and come back when you reach an actual screen someone operates.

## Density over decoration

The default failure is the landing-page instinct: air it out, card it up, round it. That is wrong here. It wastes vertical space, buries data, and makes scanning slower.

- **Fit the work.** Sidebar, header, content. No decorative hero. No page-intro block taking a third of the first screen.
- **Scan before reading.** Tables get a header row that stays put, column alignment by type (numbers right and tabular, text left, status centered or left-aligned consistently), and a visual anchor for the active row.
- **One primary action per view.** Everything else is secondary or tertiary. Two competing primaries means neither wins.
- **White space is grouping, not luxury.** Space separates things. It is not an effect to add.

## Every state exists

This is the single most common gap. Product UI is judged on the paths that are not the happy path. Build all of these or state explicitly which you left out and why:

| State | Requirement |
|---|---|
| Loading | Skeleton at the real dimensions, or a spinner scoped to the region loading. Never a full-page flash. |
| Empty (first run) | No data yet. Say what will appear here and how to get it. With a primary action. |
| Empty (filtered) | Different from first run. Say the filter matched nothing and offer to clear it. |
| Error | What failed, why, what to do. Retry adjacent to the failure. Not a toast. |
| Partial | Some rows failed to load. Show what loaded; mark what did not. |
| Success | Usually a toast, but never the only confirmation of something important. |
| Permission denied | Hidden, or explicitly shown as unavailable. Never a dead button. |
| Long content | A 60-character name, a 4-line title, a zero, a negative, a million. Design for it. |
| Disabled | Visually distinct from default **and** semantically disabled. Explain why on hover. |

## Forms

- **Label above, always.** Placeholder-as-label loses the value the moment typing starts and is invisible to most assistive tech.
- **Validate on blur, correct on input.** Announce errors in text next to the field, tied with `aria-describedby`. Never color-only — icon plus message.
- **Name the constraint.** "Email" does not say what a valid email is. "Work email, we don't send marketing" does.
- **Required is marked** and so is optional — the rare cases where optional fields matter.
- **One primary submit.** A long form steps, or it sections, but it does not present four equal buttons.
- **Never lose typed input.** On submit failure the form retains everything.

## Tables

- **Sortable columns declare it.** Arrow, and `aria-sort` on the header.
- **Selection is visible** in the row, not only in the row's hover state.
- **Sticky header on vertical scroll.** A 200-row table with no header at row 80 is unusable.
- **Horizontal scroll belongs to the table**, not the page.
- **Bulk actions state the count.** "Delete 3 selected", never "Delete".
- **Row actions in a menu**, so the table stays scannable.

## Keyboard and focus

Product UI is keyboard territory. Users are faster than their mouse.

- Visible `:focus-visible` on every interactive element, on every surface color.
- **Focus order follows visual order.** A positive `tabindex` breaks it — that is a bug, not a fix.
- **Modals and popovers trap focus**, close on Escape, and **restore focus to the trigger** on close.
- **The live thing**: drag-and-drop, rich text, grids — every one needs a keyboard path and a visible focus ring, or it is not finished.
- Skip link as the first tab stop on every app shell.
- Never remove an outline without a visible replacement.

## App shell

- **Nav reflects location.** Current item marked with `aria-current`, visually distinct without depending on color alone.
- **Collapsed state is the default at narrow widths**, expanded by an explicit control with an accessible name.
- **The header does not scroll away** if it holds global actions.
- Deep links work: every view has a URL, back does the obvious thing.

## Design tokens still apply

Everything in `design-foundation` holds. One adjustment: **semantic tokens over primitive ones.** `--color-table-row-hover`, `--color-status-warning`, not `--gray-100`. Product UI gets restyled and re-themed; semantic names survive that, primitive names do not.

## Reference

For the marketing counterpart — art direction, real photographs, the inspector — see `taste-skill`. For the shared six-line brief that routes you here, see `discovery`.