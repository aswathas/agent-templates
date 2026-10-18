# Contributing

## Setup

```bash
git clone https://github.com/aswathas/agent-templates
cd agent-templates
npm install          # playwright, for image rendering only
npm test             # 21 gate tests
```

The plugin itself has no runtime dependencies. `playwright` is a dev dependency for rendering `images/`.

## Adding a gate rule

The rules live in `templates/uiux/tools/gate.mjs`. Each one is an object:

```js
{
  id: "positive-tabindex",
  tier: "universal",
  sev: "block",
  why: "positive tabindex breaks natural tab order",
  re: /\btab[Ii]ndex\s*=\s*["'{]?\s*[1-9]/g,
}
```

| Field | Meaning |
|---|---|
| `id` | Stable identifier. Appears in `--json` output. |
| `tier` | `universal` always fires. `brand` only when your theme does not own the colour. |
| `sev` | `block` fails the build. `warn` does not. |
| `why` | One line. Shown to the user. Say what breaks, not what is wrong. |
| `re` | Global regex, matched per file. |
| `exempt` | Optional. Receives the **whole-project corpus**, returns true to silence. |
| `skipInTokenFiles` | Skip `.css` token definitions. |
| `skipLine` | Per-line escape hatch. Use sparingly. |

Then add a test that fires it, and a test that a correct pattern does **not** fire it. A rule without the negative test will accumulate false positives.

### Choosing a severity

**`block` only for things that are broken or fabricated.** A WCAG failure, an invented testimonial, an unverified compliance claim. Wrongly blocking good work is worse than missing a warning, because the response is to disable the gate.

**`warn` for everything else.** Tells, defaults, inconsistency.

### Choosing a tier

`brand` if the rule is about a **specific colour or visual choice** that a legitimate brand might own. `universal` if it is wrong regardless of brand.

Focus removal is universal. Purple is brand-tier.

## Tests

```bash
node --test templates/uiux/tools/gate.test.mjs
```

Standard library only, no runner dependency. The pattern is:

```js
test("blocks outline-none with no replacement", () => {
  const d = project({ "app/page.tsx": `<div className="focus:outline-none">x</div>` })
  assert.ok(has(run(d), "focus-removed"))
  rmSync(d, { recursive: true, force: true })
})
```

Always write the negative case too:

```js
test("allows outline-none when focus-visible replaces it", () => {
  const d = project({ "app/page.tsx": `<div className="outline-none focus-visible:ring-2">x</div>` })
  assert.ok(!has(run(d), "focus-removed"))
})
```

## Adding a skill

1. `templates/uiux/skills/<name>/SKILL.md` with `name`, `description`, `user-invocable: false`
2. The `name` must match the directory name
3. Add it to the agent's `skills:` frontmatter list
4. Add a row to the routing table in `ARCHITECTURE.md` and `docs/SKILLS.md`

**Before writing one**, search the 93k registry. Most skills that sound needed already exist:

```bash
npx skills find "your concept"
npx findskills "your concept"      # needs: npx findskills auth
```

If something good exists, add a routing entry instead of a new skill. That is what this plugin does with `taste-skill`, `dataviz` and Figma MCP.

## Writing a skill

- **Skill = the decision, reference = the numbers.** If a SKILL.md becomes a documentation dump nobody reads, split the tables into a reference file.
- **Every rule traces to evidence.** A measured fact, a paper, or a reproduced failure. "This looks better" is not a rule.
- **State the bans and the reasons.** A ban without a reason gets argued away on the first project that legitimately needs it.
- **Name the scope.** What it does not cover matters as much as what it does. That is how routes get chosen.

## Adding a template

Copy `templates/uiux`, rewrite `agents/<role>.md`, replace `skills/`, point `.mcp.json`, then add it to `.claude-plugin/marketplace.json` under `plugins[]` with a distinct `name`.

The routing structure generalizes: brief first, route by surface, phased build, bounded verification. Keep it.

## Commit style

One topic per commit. A rewrite of every stylesheet is one commit; a new gate rule with its tests is another.

If you touch the plugin and the repo docs together, say why in the message. Otherwise split.

## Before opening a PR

```bash
npm test                                    # 21 pass
node templates/uiux/tools/gate.mjs . --json | head   # gate stays quiet on its own source
```

Then: does the README still describe what exists? Did a command change? Did a number in `RESEARCH.md` change?

## License

MIT. Add your name to the commit; GitHub attributes it from your git config.