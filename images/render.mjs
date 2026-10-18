// render.mjs — screenshot the HTML image sources to PNG for LinkedIn.
// Usage: node images/render.mjs
import { chromium } from "playwright"
import { readdirSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const srcDir = join(here, "src")
const outDir = join(here, "out")

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 628 },
  deviceScaleFactor: 2, // 1200 CSS x 2 -> 2400px PNG; LinkedIn shows it near 600px, so type is sized up in the source
})

const files = readdirSync(srcDir).filter((f) => f.endsWith(".html")).sort()
for (const f of files) {
  const out = join(outDir, f.replace(/\.html$/, ".png"))
  await page.goto(pathToFileURL(join(srcDir, f)).href)
  await page.evaluate(() => document.fonts.ready)

  // Overflow assertion. A screenshot of clipped content still renders fine,
  // so the only way to catch this is to measure it.
  const fit = await page.evaluate(() => {
    const de = document.documentElement
    const over = []
    if (de.scrollWidth > de.clientWidth + 1) over.push(`page x: ${de.scrollWidth} > ${de.clientWidth}`)
    if (de.scrollHeight > de.clientHeight + 1) over.push(`page y: ${de.scrollHeight} > ${de.clientHeight}`)
    for (const el of document.querySelectorAll(".pad > *")) {
      const r = el.getBoundingClientRect()
      if (r.bottom > de.clientHeight + 1) over.push(`${el.className || el.tagName} bottom ${Math.round(r.bottom)} > ${de.clientHeight}`)
      if (r.right > de.clientWidth + 1) over.push(`${el.className || el.tagName} right ${Math.round(r.right)} > ${de.clientWidth}`)
    }
    return over
  })
  if (fit.length) {
    console.error(`OVERFLOW in ${f}:`)
    for (const o of fit) console.error(`  ${o}`)
    process.exitCode = 1
  }

  await page.screenshot({ path: out })
  console.log(`rendered ${f} -> out/${f.replace(/\.html$/, ".png")}${fit.length ? "  [OVERFLOW]" : ""}`)
}

await browser.close()