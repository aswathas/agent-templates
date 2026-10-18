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
  deviceScaleFactor: 2, // LinkedIn downsamples; 2x keeps type crisp
})

const files = readdirSync(srcDir).filter((f) => f.endsWith(".html")).sort()
for (const f of files) {
  const out = join(outDir, f.replace(/\.html$/, ".png"))
  await page.goto(pathToFileURL(join(srcDir, f)).href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  console.log(`rendered ${f} -> out/${f.replace(/\.html$/, ".png")}`)
}

await browser.close()