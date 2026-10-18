# agent-templates

Installable agent templates for Claude Code. Each one is a complete agent — role, skills, MCP servers, CLI tools — built from research rather than from taste.

```bash
/plugin marketplace add aswathas/agent-templates
/plugin install uiux@agent-templates
```

## Templates

| Template | What it does |
|---|---|
| **[uiux](templates/uiux/)** | Frontend design agent. Brief-first routing across marketing, product, mobile, canvas, i18n and charts. Ships a brand-conditioned gate with 21 tests. |

## Why these exist

Every major design agent skips the interview, and one forbids it outright. Of the ten most-installed design skills in a 93,000-skill registry, exactly one asks real questions, and only because its cloud generation costs money.

`uiux` asks. That is the differentiator, and its [RESEARCH.md](templates/uiux/RESEARCH.md) has the evidence: 526 lines covering the competitive landscape, what makes generated UI generic, five gaps nobody had filled, a supply-chain audit with six fabrications caught, and two blinded evals.

## The one thing worth stealing

`uiux/tools/gate.mjs` reads your project's own tokens before flagging anything.

The most-installed anti-slop skill in the registry bans cream, terracotta and purple **unconditionally**. A real brand that *is* terracotta gets a false FAIL, so you either ignore the gate or drown it in exceptions. This one reads `globals.css`, `DESIGN.md` and the Tailwind config first. Your brand colour is never a finding. A hardcoded one is.

```bash
node tools/gate.mjs ./src        # 0 = clean, 1 = blocking findings
node --test tools/gate.test.mjs  # 21 tests
```

## Adding a template

Copy `templates/uiux`, rewrite `agents/<role>.md`, replace `skills/`, point `.mcp.json`. Add it to `.claude-plugin/marketplace.json`. `RESEARCH.md` should say why each rule exists.

## Prior art, credited

- [taste-skill](https://github.com/leonxlnx/taste-skill) (98.7k★, MIT) — 20 researched directions, browser inspector. `uiux` routes marketing surfaces here rather than rebuilding it.
- [Anthropic frontend-design](https://github.com/anthropics/skills) — the calibration list behind `RESEARCH.md` §2.

## License

MIT