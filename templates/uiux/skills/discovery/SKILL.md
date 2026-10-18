---
name: discovery
description: Use FIRST, before any UI is built, redesigned, or reviewed. Establishes what the surface is for, who it is for, and what it must make someone do — the facts every later design decision depends on. Also use when a request is vague ("make it look better", "modernize this"), when two valid directions are possible, or when output keeps coming out generic.
user-invocable: false
---

Generic output is not a styling failure. It is what you get when nobody decided what the thing was for, so the model sampled the average of every page it has seen.

## The rule

**No code until the answers are on the table.** Not a component, not a token, not a color pick. A page built from an unexamined brief will be competent, accessible, responsive, and forgettable — because nothing about it was decided.

Ask once, ask well, then commit. Interrogation is not the goal; a brief you can design against is.

## What to establish

Ask only what you cannot infer, and infer the rest by reading the repo first. A request with four answers is better than a request with twenty questions.

**1. The one thing.** What must a person do within three seconds of landing? Not "engage with the product" — the verb. Book a table. Compare plans. Ship a fix. If there are two answers, there is no one thing.

**2. Who exactly.** Not "developers" or "small businesses". Who is looking at this, what do they already know, and what are they afraid of? The specific person is what makes copy and density decisions.

**3. What already exists.** Brand colors, logo, fonts, an existing component library, a screenshot, a competitor they admire, a site they hate. Read the repo before asking — much of this is answerable from the code and asking anyway signals you did not look.

**4. What must not look like.** The nearest competitor, and the reference they hate. "Not like <competitor>" is a stronger constraint than "modern and clean", which is a constraint on nothing.

**5. What is real.** Which images, screenshots, numbers, and content genuinely exist. This decides whether you are building a hero around a photograph, a video loop, a drawn diagram, or pure type. Plan around assets you have. Nothing at all is rarer than it sounds — a subject's city, materials, and history are in open archives and can be found.

**6. The stack.** Existing framework, styling approach, deployment target. Match it.

## When the brief is thin

Do not interrogate someone who has already told you what they want. State your reading in one line and continue:

> Reading this as: a solo consultant's site, one client enquiry as the goal, no existing brand, video of her work available. Correct me and I'll adjust.

A wrong reading costs one message. A blank page costs the whole build.

**Ask only when a missing fact blocks the work.** No product name, no idea what the thing does, an empty repo with no context — those are blocking. Everything else is guessable, and a stated guess is faster than a question.

This borrows one rule from `taste-skill`, which handles a vague brief the same way. The rest of this skill is the part it does not do — see below.

## Handling the three cases

The same questions, three entry points:

| Case | What changes |
|---|---|
| **New surface** | All six. Nothing exists yet, so 5 is mostly a search. |
| **Improve an existing one** | 3 and 4 matter most. Read the code first and ask what still feels wrong, not what it does. |
| **Audit, then improve** | Ask only 1 and 4. The findings come from inspection, not from questions. |

## Then hand off

Discovery produces a brief, and the brief routes. Every method that applies is a method to load:

| Surface | Route |
|---|---|
| Landing, portfolio, product page, hero, one-pager, marketing | `taste-skill` |
| Dashboard, admin, table, form, settings, app shell, web product UI | `app-ui` |
| Native or mobile-web app — React Native, Expo, SwiftUI, Flutter | `mobile-ui` |
| Any chart, graph, plot, dashboard viz | `dataviz` |
| Diagram editor, node graph, whiteboard, drawing tool, map | `canvas-ui` |
| More than one language, or any RTL script | `i18n-rtl` |
| Figma as source of truth | Figma MCP → tokens, then generate |
| A design system as the deliverable | Style Dictionary or Terrazzo |

**These compose.** A mobile app with charts, in Arabic, needs `mobile-ui` + `dataviz` + `i18n-rtl` — all three. Read the stack, list every surface type in the product, and load every matching method before building. Loading the first one you noticed is how a chart gets built with the wrong colors and an Arabic layout ships mirrored.

Do not reinvent art direction. `taste-skill` has a 20-direction library drawn from 247 real sites, real-browser inspection, and open-archive imagery.

## Why this skill exists

Every major design skill skips the interview, and one forbids it outright. Of the ten most-installed skills in the registry, exactly one asks real questions — `superdesign`, and only because its cloud generation costs money, so it asks rather than burns credits.

`taste-skill` states the opposite policy: *"If the request is vague, decide and state your reading in one line instead of asking."* It substitutes internal inventory-building and a procedural deal for a conversation. That works when the subject is a physical thing — a bakery, a joinery, a hotel — where eight to twelve hyper-specific attributes can be derived from the world itself. It does not work when the subject is an app, a tool, or an abstraction with no physical referent. There is no street to inventory.

That is where the questions have to come from the person.

## The output

Write the brief before building. Seven lines is enough:

```
SUBJECT:    the one thing, as a verb
AUDIENCE:   the specific person
MUST-NOT:   the competitor or reference to avoid
REAL:       assets and content that genuinely exist
STACK:      framework, platform, styling, components
LANGUAGES:  locales shipping now, and RTL yes/no
ROUTES:     every method that applies — marketing | app | mobile | canvas | i18n | dataviz | figma
```

Paste it at the top of the working notes and keep it visible. Every later decision is a check against it. When you catch yourself choosing something that reads well but serves none of these lines, that is the slop creeping back in.

If the project already has a `DESIGN.md`, extract lines 3–6 from it rather than asking. The brief reconciles the document with reality; it does not replace it.