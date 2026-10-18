// gate.test.mjs — behaviour tests for gate.mjs. Run: node --test tools/
import { test } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const GATE = new URL("./gate.mjs", import.meta.url).pathname.replace(/^\//, "")

function project(files) {
  const dir = mkdtempSync(join(tmpdir(), "gate-"))
  for (const [p, c] of Object.entries(files)) {
    const full = join(dir, p)
    mkdirSync(join(full, ".."), { recursive: true })
    writeFileSync(full, c)
  }
  return dir
}
function run(dir, extra = []) {
  try {
    const out = execFileSync("node", [GATE, dir, "--json", ...extra], { encoding: "utf8" })
    return { code: 0, json: JSON.parse(out) }
  } catch (e) {
    return { code: e.status, json: JSON.parse(e.stdout) }
  }
}
const ids = (r) => r.json.findings.map((f) => f.id)
const has = (r, id) => ids(r).includes(id)

test("blocks outline-none with no replacement", () => {
  const d = project({ "app/page.tsx": `export default function P(){return <div className="focus:outline-none">x</div>}` })
  assert.ok(has(run(d), "focus-removed"), "expected focus-removed")
  rmSync(d, { recursive: true, force: true })
})

test("allows outline-none when focus-visible replaces it", () => {
  const d = project({ "app/page.tsx": `export default function P(){return <div className="outline-none focus-visible:ring-2">x</div>}` })
  assert.ok(!has(run(d), "focus-removed"), "false positive on a correct focus pattern")
  rmSync(d, { recursive: true, force: true })
})

test("blocks positive tabindex", () => {
  const d = project({ "app/page.tsx": `const x = <div tabIndex={3}>y</div>` })
  assert.ok(has(run(d), "positive-tabindex"))
  rmSync(d, { recursive: true, force: true })
})

test("blocks click on non-interactive element", () => {
  const d = project({ "app/page.tsx": `const x = <div onClick={go}>y</div>` })
  assert.ok(has(run(d), "click-noninteractive"))
  rmSync(d, { recursive: true, force: true })
})

test("flags img without alt", () => {
  const d = project({ "app/page.tsx": `const x = <img src="/a.png" />` })
  assert.ok(has(run(d), "img-no-alt"))
  rmSync(d, { recursive: true, force: true })
})

test("does NOT flag img with empty alt (decorative is correct)", () => {
  const d = project({ "app/page.tsx": `const x = <img src="/a.png" alt="" />` })
  assert.ok(!has(run(d), "img-no-alt"), "empty alt is valid for decorative images")
  rmSync(d, { recursive: true, force: true })
})

test("blocks AI purple when the theme does not own it", () => {
  const d = project({
    "app/globals.css": `:root{--background:#fff;--foreground:#111}`,
    "app/page.tsx": `const x = <div className="bg-[#6366f1]">y</div>`,
  })
  assert.ok(has(run(d), "ai-purple"), "expected the purple to be caught")
  rmSync(d, { recursive: true, force: true })
})

test("BRAND-CONDITIONED: allows purple when the theme declares it", () => {
  const d = project({
    "app/globals.css": `:root{--brand:#6366f1;--background:#fff}`,
    "app/page.tsx": `const x = <div className="bg-[#6366f1]">y</div>`,
  })
  assert.ok(!has(run(d), "ai-purple"), "a brand's own purple is not the AI default")
  rmSync(d, { recursive: true, force: true })
})

test("BRAND-CONDITIONED: allows terracotta declared in DESIGN.md", () => {
  const d = project({
    "app/globals.css": `:root{--background:#fff}`,
    "DESIGN.md": `# Brand\n\nPrimary accent is #d97757, drawn from the kiln glaze.\n`,
    "app/page.tsx": `const x = <div style={{color:"#d97757"}}>y</div>`,
  })
  const r = run(d)
  assert.ok(!has(r, "ai-purple"), "terracotta owned by DESIGN.md must not flag")
  rmSync(d, { recursive: true, force: true })
})

test("universal rules still fire even when a theme exists", () => {
  const d = project({
    "app/globals.css": `:root{--brand:#6366f1}`,
    "app/page.tsx": `const x = <div tabIndex={2} onClick={f} />`,
  })
  const r = run(d)
  assert.ok(has(r, "positive-tabindex"), "theme must not suppress WCAG rules")
  assert.ok(has(r, "click-noninteractive"))
  rmSync(d, { recursive: true, force: true })
})

test("flags fabricated social proof", () => {
  const d = project({ "app/page.tsx": `const x = <p>Trusted by 10,000+ teams</p>` })
  assert.ok(has(run(d), "fabricated-proof"))
  rmSync(d, { recursive: true, force: true })
})

test("flags unverified compliance claim", () => {
  const d = project({ "app/page.tsx": `const x = <p>SOC 2 Type II certified</p>` })
  assert.ok(has(run(d), "fabricated-claim"))
  rmSync(d, { recursive: true, force: true })
})

test("flags motion with no reduced-motion guard", () => {
  const d = project({ "app/page.tsx": `const x = <div className="animate-pulse">y</div>` })
  assert.ok(has(run(d), "motion-no-guard"))
  rmSync(d, { recursive: true, force: true })
})

test("allows motion when reduced-motion is honoured", () => {
  const d = project({ "app/globals.css": `@media (prefers-reduced-motion: reduce){*{animation:none}}`, "app/page.tsx": `const x = <div className="animate-pulse">y</div>` })
  assert.ok(!has(run(d), "motion-no-guard"), "reduced-motion guard should silence it")
  rmSync(d, { recursive: true, force: true })
})

test("does not flag hex inside the token file itself", () => {
  const d = project({ "app/globals.css": `:root{--brand:#6366f1;--bg:#fff}` })
  assert.ok(!has(run(d), "ai-purple"), "the token definition is not a violation")
  rmSync(d, { recursive: true, force: true })
})

test("flags Inter when it is the only face", () => {
  const d = project({ "app/globals.css": `body{font-family:Inter,sans-serif}` })
  assert.ok(has(run(d), "inter-default"))
  rmSync(d, { recursive: true, force: true })
})

test("allows Inter when paired with an alternative", () => {
  const d = project({ "app/globals.css": `:root{--font-sans:'Instrument Sans';--font-fallback:Inter}` })
  assert.ok(!has(run(d), "inter-default"), "Inter as a fallback is fine")
  rmSync(d, { recursive: true, force: true })
})

test("exits 1 when blocking findings exist", () => {
  const d = project({ "app/page.tsx": `const x = <div tabIndex={5}/>` })
  assert.equal(run(d).code, 1)
  rmSync(d, { recursive: true, force: true })
})

test("exits 0 on a clean file", () => {
  const d = project({ "app/page.tsx": `const x = <button type="button" aria-label="Close">x</button>` })
  assert.equal(run(d).code, 0)
  rmSync(d, { recursive: true, force: true })
})

test("ignores node_modules", () => {
  const d = project({
    "node_modules/x/index.js": `const x = <div tabIndex={9} onClick={f}/>`,
    "app/page.tsx": `const x = <button>x</button>`,
  })
  const r = run(d)
  assert.ok(!r.json.findings.some((f) => f.file.includes("node_modules")), "must not scan node_modules")
  rmSync(d, { recursive: true, force: true })
})

test("reports the theme file it conditioned on", () => {
  const d = project({ "app/globals.css": `:root{--brand:#6366f1}`, "app/page.tsx": `const x = <p>y</p>` })
  const r = run(d)
  assert.match(r.json.theme.file, /globals\.css$/)
  assert.ok(r.json.theme.tokens > 0)
  rmSync(d, { recursive: true, force: true })
})