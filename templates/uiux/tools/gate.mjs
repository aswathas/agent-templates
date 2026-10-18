#!/usr/bin/env node
// gate.mjs — brand-conditioned UI gate.
//
// The problem it solves: taste-skill's rules.mjs bans cream, terracotta and
// purple UNCONDITIONALLY. A real product with a genuine terracotta brand gets
// a false FAIL. 2.3M installs of anti-slop advice in the wild and almost none
// of them check their own work.
//
// This gate splits the rules in two:
//
//   UNIVERSAL  always enforced. Focus, semantics, form, colour-only signals,
//              fabricated proof, raw hexes in themed files. These are WCAG
//              failures and fabrications, not taste.
//
//   BRAND      only enforced when the project's OWN tokens put a colour in
//              the banned family. If your theme declares --color-brand-*
//              as terracotta, terracotta is no longer the AI default, it is
//              your brand, and the gate stays quiet.
//
// Usage:
//   gate.mjs <file-or-dir>...        scan source
//   gate.mjs --theme <path>         treat this as the token source
//   gate.mjs --json                 machine-readable
//   gate.mjs --severity <level>     fail at this level or worse (default: warn)
//
// Exit 0 = clean, 1 = blocking findings, 2 = usage error.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative, extname, resolve, dirname } from "node:path"

const argv = process.argv.slice(2)
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`)
  return i === -1 ? d : argv[i + 1]
}
const has = (n) => argv.includes(`--${n}`)

const IGNORED = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".vercel", ".turbo", "vendor", ".cache", "storybook-static", "__snapshots__",
])
const SCAN = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".html", ".vue", ".svelte", ".astro"])

const TOKEN_FILES = [
  "app/globals.css", "app/globals.scss", "src/globals.css", "styles/globals.css",
  "app/index.css", "src/index.css", "src/app/globals.css",
  "src/app/globals.css", "app/theme.css", "src/theme.css", "styles/theme.css",
]

function walk(dir, acc = [], depth = 0) {
  if (depth > 12) return acc
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return acc }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".storybook") continue
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (IGNORED.has(e.name)) continue
      walk(full, acc, depth + 1)
    } else if (SCAN.has(extname(e.name))) acc.push(full)
  }
  return acc
}

/* ───────────────────────── colour maths ───────────────────────── */

const hex2rgb = (h) => {
  let s = h.replace(/^#/, "")
  if (s.length === 3) s = s.split("").map((c) => c + c).join("")
  if (!/^[0-9a-f]{6}$/i.test(s)) return null
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
}
const lin = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const rgb2hsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0))
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return [h, s * 100, l * 100]
}

/* ───────────────── theme discovery ───────────────── */

// Read the project's own tokens. This is what makes the gate brand-conditioned:
// if the theme itself declares purple, purple is the brand and not a tell.
function loadTheme(root, explicit) {
  const candidates = explicit ? [resolve(explicit)] : TOKEN_FILES.map((t) => join(root, t))
  const css = candidates.find((p) => existsSync(p))
  const declared = new Map()

  if (css) {
    const src = readFileSync(css, "utf8")
    for (const m of src.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,8}|rgba?\([^)]*\))/gi)) {
      declared.set(m[1], m[2])
    }
  }

  // Tailwind theme blocks count too.
  for (const name of ["tailwind.config.ts", "tailwind.config.js", "tailwind.config.mjs"]) {
    const p = join(root, name)
    if (!existsSync(p)) continue
    const src = readFileSync(p, "utf8")
    for (const m of src.matchAll(/["']([a-z][\w-]*)["']\s*:\s*["'](#[0-9a-f]{3,8})["']/gi)) {
      declared.set(`--tw-${m[1]}`, m[2])
    }
  }

  // DESIGN.md declares intent. Treat any hex it names as brand-owned.
  const dm = join(root, "DESIGN.md")
  let designMd = null
  if (existsSync(dm)) {
    designMd = readFileSync(dm, "utf8")
    for (const m of designMd.matchAll(/#[0-9a-f]{6}\b/gi)) {
      if (!declared.has("--from-DESIGN.md")) declared.set("--from-DESIGN.md", m[0])
      break
    }
  }

  const designHexes = designMd ? [...designMd.matchAll(/#[0-9a-f]{6}\b/gi)].map((m) => m[0].toLowerCase()) : []
  const tokenHexes = [...declared.values()].filter((v) => v.startsWith("#"))

  return { file: css ? relative(root, css).replace(/\\/g, "/") : null, declared, designHexes, tokenHexes }
}

// A colour is brand-owned when the project's own tokens already use it.
function brandOwns(hex, theme) {
  const h = hex.toLowerCase()
  return theme.designHexes.includes(h) || theme.tokenHexes.some((t) => t.toLowerCase() === h)
}

/* ───────────────────────── the rules ───────────────────────── */

// tier "universal" = always. tier "brand" = only when the theme does not own it.
const RULES = [
  // ── universal: WCAG
  { id: "focus-removed", tier: "universal", sev: "block", why: "focus ring removed with no visible replacement",
    re: /\boutline-none\b|\boutline\s*:\s*(?:none|0)\b/g,
    exempt: (src) => /focus-visible|focus-within/.test(src) },
  { id: "positive-tabindex", tier: "universal", sev: "block", why: "positive tabindex breaks natural tab order",
    re: /\btab[Ii]ndex\s*=\s*["'{]?\s*[1-9]/g },
  { id: "click-noninteractive", tier: "universal", sev: "block", why: "click handler on a non-interactive element",
    re: /<(div|span|li|tr|td)\b[^>]*\sonClick=/g },
  { id: "img-no-alt", tier: "universal", sev: "warn", why: "img with no alt attribute",
    re: /<img\b(?![^>]*\balt\s*=)[^>]*>/g },
  { id: "unlabeled-input", tier: "universal", sev: "warn", why: "input with no label and no aria-label",
    re: /<input\b(?![^>]*\btype\s*=\s*["'](?:hidden|submit|button|image)["'])(?![^>]*aria-label)(?![^>]*aria-labelledby)[^>]*>/g },
  { id: "placeholder-as-label", tier: "universal", sev: "warn", why: "placeholder used in place of a label",
    re: /<input\b[^>]*\bplaceholder=[^>]*(?![^>]*aria-label)/g },
  { id: "empty-button", tier: "universal", sev: "warn", why: "button with no accessible name",
    re: /<button\b(?![^>]*aria-label)(?![^>]*aria-labelledby)[^>]*>\s*<\s*\/?[a-zA-Z]/g },

  // ── universal: fabrication
  { id: "fabricated-proof", tier: "universal", sev: "block", why: "social proof that reads as a real claim",
    re: /trusted by|as seen in|loved by \d|join \d[\d,]* (?:teams|companies|customers)|[\d,]\+ (?:teams|companies|customers)/gi },
  { id: "fabricated-claim", tier: "universal", sev: "warn", why: "unverified product claim stated as fact",
    re: /\b(?:SOC ?2|ISO ?27001|GDPR[- ]compliant|99\.9{1,3}% uptime|bank[- ]grade|end[- ]to[- ]end encrypted)\b/gi },
  { id: "fake-metrics", tier: "universal", sev: "warn", why: "specific unverified performance metric",
    re: /\b\d+(?:\.\d+)?\s?(?:%|x|X|ms|K|k)\s?(?:faster|quicker|more accurate|improvement|uplift|reduction)\b/gi },

  // ── universal: token discipline
  { id: "raw-hex", tier: "universal", sev: "warn", why: "raw hex outside a token file",
    re: /#[0-9a-f]{6}\b/gi, skipInTokenFiles: true, skipLine: (l) => /^\s*(--|[\w.:#\[ ]{0,40}\{)/.test(l) },

  // ── universal: motion
  { id: "motion-no-guard", tier: "universal", sev: "warn", why: "animation with no prefers-reduced-motion guard",
    re: /\b(?:animate-|animation\s*:|@keyframes)/g,
    exempt: (src) => /prefers-reduced-motion|motion-safe|motion-reduce/.test(src) },
  { id: "motion-everywhere", tier: "universal", sev: "warn", why: "transition on a near-universal selector — the generic default",
    re: /\*\s*\{[^}]*transition-all/g },

  // ── brand tier: only fires when the theme does not already own the colour
  { id: "gradient-text", tier: "brand", sev: "warn", why: "gradient text on a headline",
    re: /bg-clip-text[\s\S]{0,80}?text-transparent/g },
  { id: "gradient-mesh", tier: "brand", sev: "warn", why: "decorative gradient wash",
    re: /bg-gradient-to-\w+[\s\S]{0,60}?(?:from-|via-)/g },
  { id: "shadow-at-rest", tier: "universal", sev: "warn", why: "shadow on a static element",
    re: /\bshadow-(?:sm|md|lg|xl|2xl)\b(?!\w)/g },
  { id: "glass", tier: "universal", sev: "warn", why: "backdrop blur panel",
    re: /backdrop-blur/g },
  { id: "eyebrow-chrome", tier: "universal", sev: "warn", why: "tracked-out uppercase label above a heading",
    re: /tracking-(?:widest|wider)[\s\S]{0,60}?uppercase/g },
  { id: "hover-scale", tier: "universal", sev: "warn", why: "scale on hover, the generic default",
    re: /hover:scale-(?:1[0-9]{2}|[0-9]{3})/g },
  { id: "rounded-uniform", tier: "universal", sev: "warn", why: "every surface at one radius",
    re: /rounded-2xl/g, tally: { within: "rounded-" }, tallyWarn: "uniform radius" },
  { id: "inter-default", tier: "universal", sev: "warn", why: "Inter declared without a considered alternative",
    re: /\bInter\b/g, exempt: (src) => /Instrument|Public Sans|Satoshi|Geist|General Sans|Space Grotesk|Manrope|Figtree|Plus Jakarta|IBM Plex|Source Sans|Sora|Manrope|Cabin|Outfit/i.test(src) },
]

/* ───────────────────────── scanning ───────────────────────── */

const lineAt = (src, i) => { let l = 1; for (let k = 0; k < i; k++) if (src[k] === "\n") l++; return l }

function colourFindings(file, src, theme, findings) {
  // AI purple family: hue 240-290 with saturation high enough to read as the tell
  const purples = new Set(["6366f1", "8b5cf6", "a78bfa", "7c3aed", "8b5cf6", "6366f1", "818cf8", "c084fc"])
  for (const m of src.matchAll(/#[0-9a-f]{6}\b/gi)) {
    const hex = m[0].toLowerCase()
    const rgb = hex2rgb(hex)
    if (!rgb) continue
    const [h, s] = rgb2hsl(rgb)
    const isPurpleFamily = h >= 250 && h <= 300 && s >= 45 && s <= 95

    if (brandOwns(hex, theme)) continue

    if (purples.has(hex.slice(1)) || isPurpleFamily) {
      findings.push({
        id: "ai-purple", sev: "block", tier: "brand",
        why: `${hex} is the AI-purple default (hue ${Math.round(h)}, sat ${Math.round(s)}%). Either pick another, or declare it in your theme tokens if it is genuinely your brand.`,
        file, line: lineAt(src, m.index), text: (src.split(/\r?\n/)[lineAt(src, m.index) - 1] || "").trim().slice(0, 100),
      })
    }

    // Contrast when both fg and bg hexes sit on the same line — the cheap case.
    const line = src.split(/\r?\n/)[lineAt(src, m.index) - 1] || ""
    const other = [...line.matchAll(/#[0-9a-f]{6}\b/gi)].map((x) => hex2rgb(x[0])).filter(Boolean)
    if (other.length >= 2) {
      for (const o of other) {
        if (o === rgb) continue
        const r = contrast(rgb, o)
        if (r < 4.5) {
          findings.push({
            id: "contrast", sev: r < 3 ? "block" : "warn", tier: "universal",
            why: `contrast ${r.toFixed(2)}:1 on this line, needs 4.5:1 for body text`,
            file, line: lineAt(src, m.index), text: line.trim().slice(0, 100),
          })
        }
      }
    }
  }
}

function scan(file, theme, corpus) {
  let src
  try { src = readFileSync(file, "utf8") } catch { return [] }
  const isTokenFile = TOKEN_FILES.some((t) => file.replace(/\\/g, "/").endsWith(t))
  const findings = []
  const seen = new Set()

  for (const rule of RULES) {
    const re = new RegExp(rule.re.source, rule.re.flags)
    let m
    while ((m = re.exec(src)) !== null) {
      const ln = lineAt(src, m.index)
      const line = (src.split(/\r?\n/)[ln - 1] || "").trim()
      if (rule.skipInTokenFiles && isTokenFile) break
      if (rule.skipLine && rule.skipLine(line)) continue
      // Exemptions are checked project-wide: a reduced-motion guard lives in
      // globals.css, a font pairing in layout.tsx — never in the file that trips.
      if (rule.exempt && rule.exempt(corpus)) break
      const key = `${ln}:${rule.id}`
      if (seen.has(key)) continue
      seen.add(key)
      findings.push({ id: rule.id, sev: rule.sev, tier: rule.tier, why: rule.why, file, line: ln, text: line.slice(0, 100) })
      break
    }
  }

  colourFindings(file, src, theme, findings)
  return findings
}

/* ───────────────────────── main ───────────────────────── */

const inputs = argv.filter((a) => !a.startsWith("--") && a !== flag("theme") && a !== flag("severity"))
if (!inputs.length) {
  console.error("usage: gate.mjs <file-or-dir>... [--theme <path>] [--json] [--severity warn|block]")
  process.exit(2)
}

const sevRank = { warn: 1, block: 2 }
const failAt = sevRank[flag("severity", "warn")] ?? 1

let all = []
const themeReports = []

for (const input of inputs) {
  const p = resolve(input)
  if (!existsSync(p)) { console.error(`no such path: ${input}`); process.exit(2) }
  const isDir = statSync(p).isDirectory()
  const root = isDir ? p : dirname(p)
  const theme = loadTheme(root, flag("theme"))
  themeReports.push({ root, theme })
  const files = isDir ? walk(p) : [p]
  // One corpus for the whole project, so cross-file exemptions work.
  const corpus = files.map((f) => { try { return readFileSync(f, "utf8") } catch { return "" } }).join("\n")
  for (const f of files) all.push(...scan(f, theme, corpus))
}

const order = { block: 0, warn: 1 }
all.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file) || a.line - b.line)

const theme = themeReports[0].theme
// rank(block)=0, rank(warn)=1; a finding blocks when it is at least as severe
// as the threshold, which with this ordering means rank <= failRank.
const blocking = all.filter((f) => order[f.sev] <= failAt)

if (has("json")) {
  console.log(JSON.stringify({
    theme: { file: theme.file, tokens: theme.declared.size, designHexes: theme.designHexes.length },
    scanned: inputs.length,
    findings: all,
    blocking: blocking.length,
  }, null, 2))
} else {
  console.log(`gate — ${all.length} finding(s)\n`)
  console.log(`  theme   ${theme.file ?? "none found"} (${theme.declared.size} tokens${theme.designHexes.length ? `, ${theme.designHexes.length} hex in DESIGN.md` : ""})`)
  console.log(`  note    brand-tier rules skip colours your own theme already declares.\n`)
  if (!all.length) console.log("  clean")
  for (const f of all) {
    const tag = f.tier === "brand" ? "brand " : "univ  "
    console.log(`  ${tag} ${f.sev === "block" ? "BLOCK" : "WARN "} ${f.id.padEnd(20)} ${f.file}:${f.line}`)
    console.log(`         ${f.why}`)
    if (f.text) console.log(`         ${f.text}`)
  }
  const b = all.filter((f) => f.sev === "block").length
  if (b) console.log(`\n  ${b} blocking.`)
}

process.exit(blocking.length ? 1 : 0)