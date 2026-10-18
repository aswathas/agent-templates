---
description: Audit an existing UI — render it, ground the findings, rank by severity
argument-hint: "[url or path]"
allowed-tools: Read, Glob, Grep, Bash, Write, Edit
---

Reviewing: $ARGUMENTS

**1. Render it.** Use `chrome-devtools` MCP. If the app runs locally, start it. Screenshot at **360 / 768 / 1440**. Read the console — React key warnings, hydration mismatches and browser a11y warnings are all defects.

If it cannot be run, say so and review from source only. Do not imply you looked at pixels you did not see.

**2. Route the surface.** Marketing/landing/portfolio → `taste-skill`'s critique and inspector, plus the house rules. Product/dashboard/form/table → the `app-ui` state table and keyboard rules.

**3. Judge only the pictures.** If a problem is visible in a screenshot, it is real, whatever the code says.

Check for the ones that block a ship: horizontal overflow at 360px, a keyboard trap or invisible focus, contrast under 3:1 on a meaningful boundary, an action reachable only by mouse, a clipped or truncated label, a touch target under 44px.

**4. Report one line per finding**, most severe first, no praise:

```
src/components/Table.tsx:88  BLOCKED  onClick on <tr> with no keyboard equivalent; use a real button in the cell
hero.tsx:14                  WRONG    Inter as unearned default, and gradient text on the h1
```

Severity: **BLOCKED** (unusable, inaccessible, or broken at a width) · **WRONG** (missing state, missing name, colour-only signal) · **ROUGH** (inconsistent with the token scale, animation that overshoots).

No summary of what the page does. No findings about code outside the surface. No praise.

**5. Then fix** — offer to fix the BLOCKED findings first, in one batch.