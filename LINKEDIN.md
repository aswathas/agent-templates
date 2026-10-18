# LinkedIn post — draft

**Publish to:** https://www.linkedin.com/feed/
**Repo:** https://github.com/aswathas/agent-templates
**Notes:** 15 templates/4 calls to action. First line is the hook — keep it under ~200 chars so it doesn't truncate.

---

I searched 93,000 AI agent skills before writing a single line of my own design agent.

Then I found one with 631,000 installs that says this:

> *"If the request is vague, decide and state your reading in one line instead of asking."*

The most-used design skill in the world explicitly forbids asking the user what they want.

That sentence reframed the whole project for me.

**Generic AI UI isn't a styling problem.**

It's a consequence of nobody deciding what the thing was for. Every element is technically correct — accessible, responsive, well-formed. Nothing is wrong. Nothing was chosen.

So I built the part that asks first, then routes each surface to the method that fits it:

- Marketing pages → taste-skill (98.7k★, real browser inspector)
- Dashboards, forms, tables → product UI states and density
- Native apps → touch targets, safe areas, iOS ≠ Android
- Multi-language → logical properties, RTL
- Diagram editors → keyboard equivalent for every single gesture

Then I ran two blinded evals, because "it looks good to me" is how you ship a preference.

**Eval 1** — same prompt, two agents, one with my plugin, one with nothing, judged blind by a different model family.

1 vs 5. The plugin version varied its section geometry. The baseline repeated a three-column grid three times and restated the hero at the end. "Every metric. One source of truth" versus "Know why the number moved."

**But eval 1 also found a bug in my own plugin.**

It banned inventing customers and quotes. It didn't ban inventing *product behaviour*. My agent shipped a page telling customers "credentials are scoped to select and nothing is written back" for a product that doesn't exist — caveat buried in a source comment nobody sees.

Test it. That's the point of testing it.

**Eval 2** tested the gate I built to fix the category's actual gap:

The best anti-slop skill in the registry bans cream, terracotta and purple **unconditionally**. If your brand *is* terracotta — a pottery studio, a restaurant — you get a false FAIL forever.

Mine reads your tokens first. Your `globals.css`, your `DESIGN.md`, your Tailwind config. Your brand colour is never a finding. A hardcoded one is.

15 of 15 tells caught on a seeded AI-typical page. Zero false positives on a genuinely terracotta brand. 21 tests.

Two of those tests caught real bugs. One inverted a severity comparison so **no blocking finding could ever fail CI** — the gate would have passed everything. The other checked exemptions per-file, so the reduced-motion guard in `globals.css` could never silence a finding in `page.tsx`.

The whole RESEARCH.md is 526 lines: the competitive landscape, the papers, five gaps nobody had filled, a supply-chain audit that caught six fabrications, and everything I got wrong.

Including this: I assumed extended reasoning couldn't fix aesthetics. The eval showed a current model escapes the obvious tells unaided. The plugin's real contribution was composition and restraint, not purple avoidance.

That's the correction I'd have shipped without running the test.

---

**Repo is public and MIT.** Install:

```
/plugin marketplace add aswathas/agent-templates
/plugin install uiux@agent-templates
```

Two things I'd genuinely like feedback on:

1. **Is brand-conditioning the right abstraction?** Every rule I could think of has a "but what if that's your brand" exception. Maybe the whole category should.
2. **The gate is static regex.** It can't see rendered geometry or focus order. Should the next version drive a headless browser, and is that worth the dependency?

---

## Alternate hooks (pick one)

**A — the contradiction**
> 631,000 installs. One sentence: "decide and state your reading in one line instead of asking."
> The most-used AI design skill forbids asking what you want. I searched 93,000 skills before writing my own design agent. Here's what I found.

**B — the number**
> I searched 93,000 AI agent skills. Ten were serious. Only one asks the user a question. I built the part that does.

**C — the finding**
> I banned AI slop in my agent. Then I ran a blinded eval and it shipped a page claiming "read-only credentials" for a product that doesn't exist. The ban was too narrow.

## Shorter version (~600 chars, for a punchy post)

I searched 93,000 AI agent skills before writing one.

The most-installed design skill (631k) forbids asking the user what they want. Generic AI UI isn't a styling problem — it's what you get when nobody decided what the thing was for.

So I built the part that asks first. Then I ran two blinded evals. The second caught a bug in my own ban list: it stopped invented testimonials but let invented *product claims* through.

Public + MIT: https://github.com/aswathas/agent-templates

---

## Post images — generated and ready

Three 1200x628 PNGs in `images/out/`, 2x scale (2400x1256), LinkedIn feed dimensions.

| # | File | What it shows |
|---|---|---|
| 1 | `01-gate.png` | AI-typical page (15 findings, 2 blocking, exit 1) beside a real terracotta brand (1 finding, 0 blocking, exit 0) |
| 2 | `02-architecture.png` | The four-step flow and all eight routes, with the closed/open boundary marked |
| 3 | `03-eval.png` | The blinded A/B. Bars are the literal rubric scores — A: 0,0,1,0,0,0. B: 0,0,2,1,1,1 |

Post as a **three-image carousel in that order**. The gate image leads because it is the only claim a reader can verify in ten seconds.

Rebuild after editing anything: `node images/render.mjs`. Sources are plain HTML, no image API, no keys. Every number in every image is the number the post makes a claim about — nothing is decorative.

## Suggested first comment

> Two caveats, because the post oversells in places:
>
> The gate is static regex over source. It can't see rendered geometry, contrast against a rendered background, or focus order. That needs a headless browser — taste-skill's `inspect.mjs` does more here.
>
> And one eval, one prompt, one domain. The 1-vs-5 gap is real but not proven general. Happy to be argued with on either point.

Dropping caveats in a comment rather than the post reads as honest rather than defensive.