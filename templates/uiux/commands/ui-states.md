---
description: Audit or fill in every UI state for a product surface
argument-hint: "[view or component path]"
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
---

States audit: $ARGUMENTS

Load the `app-ui` skill and check this surface against its state table.

For each of these, report **present / missing / broken** with a file and line:

| State | Look for |
|---|---|
| Loading | Skeleton at real dimensions, or region-scoped spinner. No full-page flash. |
| Empty (first run) | Says what appears here and how to get it. Has a primary action. |
| Empty (filtered) | Distinct from first run. Offers to clear the filter. |
| Error | What failed, why, what to do. Retry adjacent, not in a toast. |
| Partial | Some rows failed. Shows what loaded, marks what did not. |
| Permission denied | Hidden, or explicitly unavailable. Never a dead button. |
| Long content | 60-char name, 4-line title, zero, negative, 1M. Does it survive? |
| Disabled | Visually distinct **and** semantically disabled. Reason on hover. |

Also check: labels above inputs (never placeholder-as-label), validation tied with `aria-describedby` and never color-only, sort state declared with `aria-sort`, sticky table headers, focus trap + Escape + focus restore on every modal, skip link as first tab stop.

Report one line per gap, severity first. Then offer to fill them in, in one batch, in the order BLOCKED → WRONG.

Do not mark a state present because a `isLoading` flag exists in the code — the state has to render something the user can see.