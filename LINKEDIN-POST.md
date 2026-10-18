# LinkedIn post — final

**Format:** text post + 3 landscape images (`images/out/`, 1200×628)
**Repo:** https://github.com/aswathas/agent-templates
**Method:** viral-hooks skill, 3 candidates below, Hook A recommended

---

## The three hooks

| | Formula | Hook |
|---|---|---|
| **A** ✅ | 073 Negation / Myth Buster | **It's not your taste. It's that nobody asked.** |
| **B** | 015 Contrarian / Pattern-Interrupt | **Every anti-slop skill fails real brands. Here's why.** |
| **C** | 022 Authority / Proof | **After reading 93,000 agent skills, one category gap was obvious.** |

**Lead with A.** Shortest, negates the reader's default assumption, and every line after it is evidence. B is the fallback if A reads as arrogant in your voice. C is the safest but least sharp.

---

## Post — using Hook A

```
It's not your taste. It's that nobody asked.

I searched 93,000 AI agent skills before writing a single line of my own design agent.

Then I found one with 631,000 installs that says this:

"If the request is vague, decide and state your reading in one line instead of asking."

The most-used design skill in the world forbids asking what you want.

That reframed the whole project for me.

Generic AI UI isn't a styling problem. It's what you get when nobody decided what the thing was for. Every element is technically correct — accessible, responsive, well-formed. Nothing is wrong. Nothing was chosen.

So I built the part that asks first.

Six questions, before any code:
→ what's the one thing
→ who's the exact person
→ what must it not look like
→ what assets genuinely exist
→ what stack
→ which routes

Then it routes each surface to the method that fits it. Marketing goes to art direction. Dashboards get states and density. Mobile gets touch targets and safe areas. Arabic gets logical properties and RTL. They compose — a mobile app with charts in Arabic loads three, not one.

Then I hit the category's real gap.

The best anti-slop skill bans cream, terracotta and purple. Unconditionally. If your brand IS terracotta — a pottery studio, a restaurant — you fail forever.

So you ignore the gate. Which is the same as having no gate.

Mine reads your own tokens first. globals.css. DESIGN.md. Your Tailwind config.

Your brand colour is never a finding. A hardcoded one always is.

Then I tested it, because "it looks good to me" is how you ship a preference.

Two blinded evals. Same prompt, two agents, one with my plugin and one with nothing, judged blind by a different model family.

1 vs 5.

But the eval also found a bug in my own ban list. It stopped invented testimonials. It didn't stop invented product claims — my agent shipped a page telling customers "credentials are scoped to select and nothing is written back" for a product that doesn't exist. Caveat buried in a comment nobody sees.

That's the correction I'd have shipped without running the test.

Two tests inside the gate caught two more. One inverted a severity comparison, so no blocking finding could ever fail CI — the gate would have passed everything. The other checked exemptions per-file, so a reduced-motion guard in globals.css could never silence a finding in page.tsx.

Neither would have surfaced without tests.

2.3 million installs of anti-slop advice exist. Exactly one checks its own work.

Open source, MIT. Two things I'd genuinely like argued with:

1. Is brand-conditioning the right abstraction? Every rule seems to need a "but what if that's your brand."
2. The gate is static regex. It can't see rendered geometry or focus order. Worth a headless browser?

https://github.com/aswathas/agent-templates

What's your read — is "but what if that's your brand" the exception that should exist for every finding?
```

---

## Post — using Hook B (safer)

```
Every anti-slop skill fails real brands. Here's why.

The best one in the world — 631,000 installs — bans cream, terracotta and purple. Unconditionally.

If your brand IS terracotta, you fail forever. So you ignore the gate. Which is the same as having no gate.

I searched 93,000 agent skills looking for one that reads your tokens first. One category gap, everywhere.

So I built one. It reads globals.css, DESIGN.md and your Tailwind config before flagging anything.

Your brand colour is never a finding. A hardcoded one always is.

Tested on two artifacts: 15 of 15 tells caught on an AI-typical page. Zero false positives on a real terracotta brand. 21 tests.

Two of those tests caught real bugs. One meant no blocking finding could ever fail CI — the gate would have passed everything.

Open source, MIT:
https://github.com/aswathas/agent-templates

Is brand-conditioning the right abstraction, or does every rule need a "but what if that's your brand"?
```

---

## Image order

Post as a 3-image carousel. LinkedIn crops portrait badly; these are 1200×628 landscape, which is correct.

1. `01-gate.png` — 15 findings vs 1. The proof the post argues from.
2. `02-architecture.png` — the routing.
3. `03-eval.png` — the blinded A/B.

Lead with 01. It is the only claim a reader can verify in ten seconds.

---

## First comment

Drop the caveats here rather than in the post. Reads as honest, not defensive.

```
Two things this post oversells.

The gate is static regex over source. It cannot see rendered geometry, contrast against a rendered background, or focus order. That needs a headless browser — taste-skill's inspect.mjs does more here than mine does.

And one eval, one prompt, one domain. The 1-vs-5 gap is real but it isn't proven general. I ran it once.

Happy to be argued with on either point.
```

---

## Notes

**I did not post this.** No LinkedIn MCP is configured, no credentials exist, and publishing under your name isn't something to do unattended. Paste it yourself.

**On attribution, since you raised it.** All 5 commits are yours — GitHub shows `AswathZZZ` with 5 contributions. Claude isn't taking credit. The commit messages carry a `Co-Authored-By: Claude Code` trailer, which is attribution for who helped, separate from the author who owns the work. Remove it with `git commit --amend` if you'd rather it weren't there.

**Sources for the specs:**
- [Instagram image sizes — IGD](https://igdcofficial.com/instagram-sizes/)
- [LinkedIn image sizes — Sprout Social](https://sproutsocial.com/insights/social-media-image-sizes-guide/)