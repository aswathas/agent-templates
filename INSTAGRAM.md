# Instagram carousel — 7 slides

**Format:** 1080 × 1350 px, 4:5 portrait, every slide the same ratio
**Slides:** 7 · **Repo:** https://github.com/aswathas/agent-templates

7 is right for this. Instagram allows 20, but the platform itself pushes back on long decks — carousels are judged by swipe rate, and a padded one loses. Seven tells one story with a beginning, a turn, and an ask.

---

## Slide 1 — the hook

> **631,000 installs.**
> One sentence from the most-used AI design skill in the world:
>
> *"If the request is vague, decide and state your reading in one line instead of asking."*
>
> It forbids asking what you want.

**Design:** near-empty, one terracotta shape. Text carries the weight. Slide 2 has to answer "so what did you do?"

---

## Slide 2 — the reframe

> **Generic AI UI isn't a styling problem.**
>
> It's what you get when nobody decided what the thing was for.
>
> Every element is technically correct. Accessible, responsive, well-formed. Nothing is wrong. Nothing was chosen.

**Design:** a page of perfect cards. Every one identical. Let the reader feel it before naming it.

---

## Slide 3 — the fix

> So I built the part that asks first.
>
> Six questions, before any code:
> what's the one thing · who's the exact person · what must it not look like · what assets genuinely exist · what stack · which routes
>
> Then it routes each surface to the method that fits.

**Design:** the six questions as a clean list. This is the product shot.

---

## Slide 4 — the routing

> **Marketing** → art direction, 20 researched directions
> **Product UI** → density, nine states, tables, forms
> **Mobile** → touch targets, safe areas, iOS ≠ Android
> **Canvas** → keyboard equivalent for every gesture
> **Arabic** → logical properties, RTL
>
> They compose. A mobile app with charts in Arabic loads three, not one.

**Design:** the routing list. Reuse `02-architecture` from the LinkedIn set, reformatted portrait.

---

## Slide 5 — the problem with existing tools

> Here's what I couldn't buy.
>
> The best anti-slop skill bans cream, terracotta and purple. Unconditionally.
>
> If your brand *is* terracotta — a pottery studio, a restaurant — you fail forever.
>
> So you ignore the gate. Which is the same as having no gate.

**Design:** a FAIL stamp over a terracotta page. The turn in the story.

---

## Slide 6 — the differentiator

> So the gate reads your tokens first.
>
> `globals.css`. `DESIGN.md`. Your Tailwind config.
>
> Your brand colour is never a finding.
> A hardcoded one always is.

**Design:** side by side. Left, a terracotta page: 1 finding, 0 blocking. Right, an AI page: 15, 2 blocking. The proof. Reuse `01-gate` reformatted portrait.

---

## Slide 7 — the ask

> Open source. MIT.
>
> Two things I'd like argued with:
>
> 1. Is brand-conditioning the right abstraction? Every rule seems to need a "but what if that's your brand."
> 2. The gate is static regex. It can't see rendered geometry or focus order. Worth a headless browser?
>
> Link in bio.

**Design:** the two questions large. Both are genuinely open. People answer real questions.

---

## Caption

```
I searched 93,000 AI agent skills before writing a single line of my own design agent.

Then I found one with 631,000 installs that says: decide your reading in one line instead of asking.

The most-used design skill in the world forbids asking the user what they want.

Generic AI UI isn't a styling problem. It's what you get when nobody decided what the thing was for. Every element is technically correct. Nothing is wrong. Nothing was chosen.

So I built the part that asks first, then routes each surface to the method that fits it.

Then I found the category's real gap. Every anti-slop skill bans cream, terracotta and purple unconditionally — which means a pottery studio fails forever, so you ignore the gate. Which is the same as having no gate.

Mine reads your tokens first. Your brand colour is never a finding. A hardcoded one always is.

Two blinded evals are in the repo. The second one caught a bug in my own ban list: it stopped invented testimonials but let invented product claims through.

MIT licensed. I want to be argued with on two things — is brand-conditioning the right abstraction, and whether the gate should drive a real browser.

What's your honest read: is "but what if that's your brand" the rule that should exist for every finding?

Link in bio.
```

---

## Design constraints that actually matter

**Read at phone size.** A carousel slide is viewed at roughly 400px wide. If you reuse the LinkedIn PNGs, **do not** paste them in as-is — they are 2400×1256 landscape and will crop to unreadable. Rebuild portrait.

**Type floor.** Minimum 40px for body on a 1080px-wide canvas. Headlines 72px+. Anything smaller dies in the feed.

**One idea per slide.** If a slide needs two headlines, it is two slides.

**Seven words or fewer on the hook.** Slide 1 has one job.

**No text baked into AI-generated images.** Every slide here has real type over a real layout. That's the same constraint the whole project is built around.

## Hashtags

`#buildinpublic` `#ai` `#designengineering` `#frontend` `#accessibility` `#claudecode` `#opensource` `#uiux`

Eight. Instagram buries posts past 8–10, and a wall of tags reads as spam to the people you actually want.

## Sources

- [Instagram image size guide 2026 — IGD](https://igdcofficial.com/instagram-sizes/)
- [Instagram carousel spec 2026 — Wavegen](https://wavegen.ai/blog/instagram-carousel)
- [Instagram carousel limits — Sprout Social](https://sproutsocial.com/insights/social-media-image-sizes-guide/)
- [Why long carousels underperform — CreatorFlow](https://creatorflow.so/blog/instagram-carousel-posts-guide/)