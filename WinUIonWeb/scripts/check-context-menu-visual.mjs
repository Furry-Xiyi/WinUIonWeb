import assert from 'node:assert/strict'
import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const base = process.env.TEXT_CHECK_URL ?? 'http://127.0.0.1:63179/WinUIonWeb/'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US', permissions: ['clipboard-read', 'clipboard-write'] })
page.setDefaultTimeout(30000)
const navigate = async (route, title = route) => {
  await page.goto(`${base}#/${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(expected => document.querySelector('.page-header')?.textContent?.trim() === expected, title)
}
const titlebar = () => page.locator('.gallery-titlebar').evaluate(el => {
  const search = el.querySelector('.gallery-titlebar-search')
  return { compact: el.classList.contains('is-compact'), searchWidth: search?.getBoundingClientRect().width, searchDisplay: search && getComputedStyle(search).display }
})
const menu = () => page.locator('.win-commandbar-flyout:visible').first().evaluate(el => {
  const surface = [...el.querySelectorAll('.win-cbf-primary-items-root, .win-cbf-outer-overflow-content-root')]
    .find(node => node.getBoundingClientRect().height > 0 && getComputedStyle(node).display !== 'none')
  const icon = [...el.querySelectorAll('.win-appbar-button .appbar-button-content-viewbox')]
    .find(node => getComputedStyle(node).display !== 'none' && node.getBoundingClientRect().width > 0)
  const glyph = icon?.querySelector('.win-symbol-icon-glyph')
  return {
    theme: el.getAttribute('data-theme'),
    hasAcrylic: !!surface?.querySelector('.win-acrylic-visual'),
    backdropFilter: surface && getComputedStyle(surface).backdropFilter,
    iconWidth: icon?.getBoundingClientRect().width ?? 0,
    glyph: glyph?.textContent ?? ''
  }
})
const assertMenu = async (label, theme = 'light') => {
  await page.locator('.win-commandbar-flyout:visible').waitFor({ timeout: 5000 })
  const state = await menu()
  assert.equal(state.theme, theme, `${label} theme`)
  assert.equal(state.hasAcrylic, true, `${label} Acrylic visual`)
  assert.match(state.backdropFilter ?? '', /blur/, `${label} Acrylic backdrop`)
  assert.equal(state.iconWidth, 16, `${label} icon width`)
  assert.ok(state.glyph, `${label} SymbolIcon glyph`)
}
try {
  await navigate('textbox', 'TextBox')
  const input = page.locator('.example-display .win-textbox-field').first()
  await input.fill('selected text')
  await input.selectText()
  await input.click({ button: 'right' })
  await assertMenu('TextBox')
  assert.equal((await titlebar()).searchWidth, 350)
  await page.mouse.click(1100, 300)
  const search = page.locator('.gallery-titlebar-search .win-textbox-field')
  await search.fill('test')
  await search.click({ button: 'right' })
  await assertMenu('TitleBar search')
  assert.equal((await titlebar()).searchWidth, 350)
  for (const width of [1100, 900, 700, 625]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(100)
    const before = await titlebar()
    assert.equal(before.searchWidth, 350, `TitleBar search width before right-click at ${width}px`)
    await search.click({ button: 'right' })
    await assertMenu(`TitleBar search at ${width}px`)
    assert.equal((await titlebar()).searchWidth, 350, `TitleBar search width after right-click at ${width}px`)
    await page.mouse.click(width - 10, 100)
  }
  await page.setViewportSize({ width: 600, height: 900 })
  await page.waitForTimeout(100)
  assert.equal((await titlebar()).compact, true, 'Search becomes compact only when the available titlebar width is insufficient')
  await page.setViewportSize({ width: 1280, height: 900 })
  for (const test of [
    ['passwordbox', '.example-display .win-password-box input', 'secret'],
    ['numberbox', '.example-display .win-number-box input', '42'],
    ['autosuggestbox', '.example-display .win-auto-suggest-box input', 'test'],
    ['richeditbox', '.example-display .win-rich-edit-box [contenteditable="true"]', 'sample'],
    ['textblock', '.example-display .win-text-block', null],
    ['richtextblock', '.example-display .win-rich-text-block.is-selectable', null]
  ]) {
    const [route, selector, value] = test
    await navigate(route, route === 'richeditbox' ? 'RichEditBox' : route === 'richtextblock' ? 'RichTextBlock' : route === 'textblock' ? 'TextBlock' : route === 'autosuggestbox' ? 'AutoSuggestBox' : route === 'passwordbox' ? 'PasswordBox' : 'NumberBox')
    if (route === 'textblock') await page.locator('.win-switch-wrap[role="switch"]').last().click()
    const target = route === 'textblock' ? page.locator('.example-display').nth(4).locator('.win-text-block').first() : page.locator(selector).first()
    if (value !== null) await target.fill(value)
    await target.click({ button: 'right' })
    await assertMenu(route)
  }
  await navigate('textbox', 'TextBox')
  await page.locator('.win-page-header-right-actions .win-page-header-action').first().click()
  const darkInput = page.locator('.example-display .win-textbox-field').first()
  await darkInput.fill('dark theme')
  await darkInput.click({ button: 'right' })
  await assertMenu('TextBox dark', 'dark')
  for (const [route, title] of [['textblock', 'TextBlock'], ['richtextblock', 'RichTextBlock']]) {
    await navigate(route, title)
    await page.locator('.win-page-header-right-actions .win-page-header-action').first().click()
    if (route === 'textblock') await page.locator('.win-switch-wrap[role="switch"]').last().click()
    const target = route === 'textblock'
      ? page.locator('.example-display').nth(4).locator('.win-text-block').first()
      : page.locator('.example-display .win-rich-text-block.is-selectable').first()
    await target.click({ button: 'right' })
    await assertMenu(`${route} dark`, 'dark')
  }
  console.log('PASS text-control right-click menus: symbols, Acrylic, dark theme and stable TitleBar search width')
} finally { await browser.close() }
