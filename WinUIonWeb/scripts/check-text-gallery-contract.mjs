import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const names = ['TextBox', 'PasswordBox', 'AutoSuggestBox', 'NumberBox', 'RichEditBox', 'TextBlock', 'RichTextBlock']
const exampleCounts = new Map()
const galleryReference = process.env.WINUI_GALLERY_ROOT
  ? new URL(`file:///${process.env.WINUI_GALLERY_ROOT.replaceAll('\\', '/').replace(/^\/+/, '')}/`)
  : new URL('../WinUI-Gallery/', root)
const referenceAvailable = existsSync(new URL('WinUIGallery/Samples/TextBox/TextBoxPage.xaml', galleryReference))
const resources = ['en-US', 'zh-CN'].map(locale => {
  const gallery = read(`src/gallery/Strings/${locale}/Resources.ts`)
  const controls = read(`src/components/Strings/${locale}/Resources.ts`)
  return new Set([...gallery.matchAll(/"([^"\r\n]+)"\s*:/g), ...controls.matchAll(/"([^"\r\n]+)"\s*:/g)].map(match => match[1]))
})

for (const name of names) {
  const page = read(`src/gallery/pages/${name}Page.vue`)
  const pageSamples = [...page.matchAll(/<ControlExample\b[^>]*SampleDefinition="([^"]+)"/g)].map(match => match[1])
  if (referenceAvailable) {
    const official = readFileSync(new URL(`WinUIGallery/Samples/${name}/${name}Page.xaml`, galleryReference), 'utf8')
    const officialSamples = [...official.matchAll(/<controls:ControlExample\b[^>]*SampleDefinition="([^"]+)"/g)].map(match => match[1])
    assert.deepEqual(pageSamples, officialSamples, `${name} Gallery example order`)
  }
  exampleCounts.set(name, pageSamples.length)
  assert.doesNotMatch(page, /@[Cc]lick|:IsEnabled|:SelectedIndex|v-model|\$t\(|\{\{/, `${name} uses official XAML call syntax`)
  for (const [, key] of page.matchAll(/\bt\('([^']+)'\)/g)) {
    for (const [index, locale] of ['en-US', 'zh-CN'].entries()) {
      assert.ok(resources[index].has(key), `${name}: missing ${locale} resource ${key}`)
    }
  }
  for (const sample of pageSamples) {
    const source = read(`src/gallery/samples/${sample.replaceAll('\\', '/')}`)
    assert.doesNotMatch(source, /@[Cc]lick|v-model|\$t\(|\{\{/, `${name}: source ${sample} contains Vue syntax`)
  }
}
console.log(`${referenceAvailable ? 'PASS official example order, ' : 'SKIP reference order (WinUI-Gallery unavailable); PASS '}XAML syntax, bilingual keys and source samples`)

const base = process.env.TEXT_CHECK_URL ?? 'http://127.0.0.1:63179/WinUIonWeb/'
const browser = await chromium.launch({ headless: true })
const errors = []
try {
  for (const width of [1280, 390]) {
    for (const name of names) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, locale: 'en-US' })
      page.on('pageerror', error => errors.push(`${name} ${width}: ${error.message}`))
      page.on('console', message => {
        if (message.type() === 'warning' && /\[Vue warn\]/.test(message.text())) errors.push(`${name} ${width}: ${message.text()}`)
      })
      await page.goto(`${base}#/${name.toLowerCase()}`, { waitUntil: 'domcontentloaded', timeout: 180000 })
      await page.waitForFunction(expected => document.querySelectorAll('.page-view.active .control-example-root').length === expected, exampleCounts.get(name))
      const result = await page.evaluate(() => {
        const rect = element => element.getBoundingClientRect()
        const displays = [...document.querySelectorAll('.page-view.active .control-example-root')].map((root, index) => {
          const frame = rect(root.querySelector('.control-example-frame'))
          const container = rect(root.querySelector('.example-container'))
          const display = rect(root.querySelector('.example-display'))
          const source = root.querySelector('.code-expander')
          const output = root.querySelector('.example-output')
          const options = root.querySelector('.example-options')
          const children = [...root.querySelector('.example-display').children]
            .filter(element => element.getClientRects().length)
            .map(element => ({ left: rect(element).left, right: rect(element).right }))
          return {
            index,
            frame: { left: frame.left, right: frame.right },
            container: { top: container.top, bottom: container.bottom },
            display: { left: display.left, right: display.right },
            sourceTop: source ? rect(source).top : null,
            output: output ? { left: rect(output).left, right: rect(output).right } : null,
            options: options ? { left: rect(options).left, right: rect(options).right } : null,
            children
          }
        })
        const visibleText = document.body.innerText
        return { displays, visibleText }
      })
      assert.ok(result.displays.length, `${name} has rendered examples at ${width}px`)
      assert.doesNotMatch(result.visibleText, /\[object Object\]|\{x:Bind\s|\$t\(/, `${name} has no unresolved visible text at ${width}px`)
      for (const example of result.displays) {
        const id = `${name} example ${example.index + 1} at ${width}px`
        assert.ok(example.display.left >= example.frame.left - 2 && example.display.right <= example.frame.right + 2, `${id}: display stays in frame`)
        if (example.sourceTop !== null) assert.ok(example.sourceTop >= example.container.bottom - 2, `${id}: source follows display`)
        for (const part of [example.output, example.options]) {
          if (part) assert.ok(part.left >= example.frame.left - 2 && part.right <= example.frame.right + 2, `${id}: output/options stay in frame`)
        }
        for (const child of example.children) {
          assert.ok(child.left >= example.display.left - 2 && child.right <= example.display.right + 2, `${id}: control root stays in display`)
        }
      }
      if (width === 1280) {
        const expanders = page.locator('.page-view.active .control-example-root .code-expander')
        assert.equal(await expanders.count(), exampleCounts.get(name), `${name}: every example exposes official source`)
        for (let index = 0; index < await expanders.count(); index++) {
          const expander = expanders.nth(index)
          await expander.locator('.win-expander-header').evaluate(element => element.click())
          await expander.locator('.win-sample-code code').waitFor({ state: 'attached' })
          const source = await expander.locator('.win-sample-code code').innerText()
          assert.ok(source.trim(), `${name} example ${index + 1}: source is populated`)
          assert.doesNotMatch(source, /\$\([A-Za-z]\w*\)|@[Cc]lick|v-model|\$t\(|\[object Object\]/, `${name} example ${index + 1}: rendered source is resolved XAML/C#`)
        }
        const initialTheme = await page.locator('.page-view.active .example-display').first().getAttribute('data-theme')
        await page.locator('.page-view.active .win-page-header-right-actions .win-page-header-action').first().click()
        await page.waitForFunction(previous => {
          const displays = [...document.querySelectorAll('.page-view.active .example-display')]
          return displays.length > 0 && displays.every(display => display.getAttribute('data-theme') !== previous)
        }, initialTheme)
        const themeScopes = await page.locator('.page-view.active .control-example-theme').evaluateAll(elements => elements.map(element => element.className))
        assert.equal(themeScopes.length, exampleCounts.get(name), `${name}: every example has its own theme scope`)
      }
      console.log(`PASS ${name} ${width}px: ${result.displays.length} examples, independent regions, resolved labels`)
      await page.close()
    }
  }
  assert.deepEqual(errors, [], 'no Vue warnings or browser errors')
} finally {
  await browser.close()
}
