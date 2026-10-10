import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const base = process.env.TEXT_CHECK_URL ?? 'http://127.0.0.1:63179/WinUIonWeb/'
const output = path.resolve('../.verification/input-button-sizing')
fs.mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true, ...(process.env.INPUT_BROWSER_CHANNEL ? { channel: process.env.INPUT_BROWSER_CHANNEL } : {}) })
const problems = []
const measure = async locator => locator.evaluateAll(elements => elements.map(el => {
  const rect = el.getBoundingClientRect()
  const style = getComputedStyle(el)
  return { class: el.className, width: rect.width, height: rect.height, left: rect.left, top: rect.top,
    fontSize: style.fontSize, margin: style.margin, padding: style.padding, background: style.backgroundColor,
    children: [...el.children].map(child => {
      const bounds = child.getBoundingClientRect(), css = getComputedStyle(child)
      return { class: child.className, width: bounds.width, height: bounds.height, left: bounds.left, top: bounds.top,
        fontSize: css.fontSize, margin: css.margin, padding: css.padding, background: css.backgroundColor }
    }) }
}))
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US' })
  page.setDefaultTimeout(30000)
  page.on('pageerror', error => problems.push(error.message))
  page.on('console', message => { if (message.type() === 'warning' && /\[Vue warn\]/.test(message.text())) problems.push(message.text()) })
  const navigate = async route => {
    if (page.url().startsWith(base)) await page.evaluate(hash => { location.hash = hash }, `/${route}`)
    else await page.goto(`${base}#/${route}`, { waitUntil: 'domcontentloaded', timeout: 180000 })
    await page.waitForFunction(name => document.querySelector('.page-header')?.textContent === name, {
      textbox: 'TextBox', passwordbox: 'PasswordBox', autosuggestbox: 'AutoSuggestBox', numberbox: 'NumberBox'
    }[route])
  }
  for (const route of ['textbox', 'passwordbox', 'autosuggestbox', 'numberbox']) {
    await navigate(route)
    await page.waitForTimeout(350)
    const sample = page.locator('.example-display').nth(route === 'textbox' ? 0 : 1)
    const input = sample.locator('input').first()
    if (route === 'textbox') await sample.locator('.win-textbox').evaluate(el => { el.style.width = '300px' })
    await input.fill(route === 'numberbox' ? '20' : 'sample')
    const buttons = sample.locator('.win-textbox-delete-button,.win-password-reveal,.win-asb-query-button,.win-number-spin-button')
    await buttons.first().waitFor()
    const dimensions = await measure(buttons)
    const expected = {
      textbox: [[30, 32, 26, 24]], passwordbox: [[30, 32, 26, 24]],
      autosuggestbox: [[32, 32, 32, 24], [32, 28, 30, 22]],
      numberbox: [[40, 32, 36, 24], [32, 24, 32, 24], [32, 24, 32, 24]]
    }[route]
    const geometry = values => values.map(value => [value.width, value.height, value.children[0].width, value.children[0].height].map(Math.round))
    assert.deepEqual(geometry(dimensions), expected, `${route}: official button and feedback dimensions`)
    const border = sample.locator('.win-textbox-border')
    await border.evaluate(el => { el.style.minHeight = '56px' })
    const tall = await measure(buttons)
    const tallExpected = expected.map(value => value[1] === 28 ? value : [value[0], value[1] + 24, value[2], value[3] + 24])
    assert.deepEqual(geometry(tall), tallExpected, `${route}: taller row stretching`)
    await border.evaluate(el => { el.style.minHeight = '' })
    console.log(`PASS ${route}: official hit area/feedback size; 56px row stretching`)
    if (route === 'numberbox') {
      await buttons.last().hover()
      await page.waitForTimeout(150)
      const hovered = await measure(buttons)
      assert.equal(hovered.at(-1).background, 'rgba(0, 0, 0, 0)')
      assert.notEqual(hovered.at(-1).children[0].background, 'rgba(0, 0, 0, 0)')
      await page.screenshot({ path: path.join(output, 'number-inline.png'), fullPage: true })
      await page.locator('.control-example-root').nth(1).locator('label.win-radio-button').filter({ hasText: 'Compact' }).click()
      await input.focus()
      const popup = page.locator('.win-number-compact-popup')
      await popup.waitFor()
      await popup.locator('button').first().hover()
      await page.waitForTimeout(150)
      assert.deepEqual(geometry(await measure(popup.locator('button'))), [[36, 36, 36, 36], [36, 36, 36, 36]])
      const initial = Number(await input.inputValue())
      await popup.locator('button').first().click()
      assert.equal(Number(await input.inputValue()), initial + 10)
      await popup.locator('button').last().click()
      assert.equal(Number(await input.inputValue()), initial)
      assert.equal(await sample.locator('.win-number-compact-indicator').evaluate(el => {
        const bounds = el.getBoundingClientRect()
        return !!document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)?.closest('.win-number-compact-popup')
      }), true)
      await page.screenshot({ path: path.join(output, 'number-compact.png'), fullPage: true })
      console.log('PASS NumberBox popup: complete 36px feedback, overlay and real +/- actions')
    } else if (await buttons.count()) {
      await buttons.last().hover()
      await page.screenshot({ path: path.join(output, `${route}.png`), fullPage: true })
    }
    await page.setViewportSize({ width: 390, height: 844 })
    const overflow = await page.evaluate(() => [...document.querySelectorAll('.example-display')].flatMap(region => {
      const bounds = region.getBoundingClientRect()
      return [...region.querySelectorAll('.win-textbox,.win-password-box,.win-auto-suggest-box,.win-number-box')]
        .filter(control => {
          const rect = control.getBoundingClientRect()
          return rect.width && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)
        }).map(control => control.className)
    }))
    assert.deepEqual(overflow, [], `${route}: mobile Gallery display bounds`)
    await page.setViewportSize({ width: 1280, height: 900 })
  }
  await navigate('passwordbox')
  const custom = page.locator('.example-display').nth(1).locator('input')
  await custom.evaluate(el => {
    let instance = el.__vueParentComponent
    while (instance && instance.type.__name !== 'PasswordBox') instance = instance.parent
    if (!instance?.exposed) throw new Error('PasswordBox API was not found')
    window.passwordSizingProbe = instance.exposed
  })
  const password = () => page.evaluate(() => window.passwordSizingProbe.Password)
  await custom.fill('abcd')
  assert.equal(await password(), 'abcd')
  assert.equal(await custom.inputValue(), '####')
  await custom.press('Home')
  await custom.press('ArrowRight')
  await custom.press('ArrowRight')
  await custom.press('X')
  assert.equal(await password(), 'abXcd')
  assert.equal(await custom.inputValue(), '#####')
  assert.equal(await custom.evaluate(el => el.selectionStart), 3)
  await custom.press('Backspace')
  assert.equal(await password(), 'abcd')
  await custom.press('Control+z')
  assert.equal(await password(), 'abXcd')
  await custom.press('Control+y')
  assert.equal(await password(), 'abcd')
  await custom.evaluate(el => {
    el.setSelectionRange(1, 3)
    const data = new DataTransfer(); data.setData('text/plain', 'YZ')
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }))
  })
  assert.equal(await password(), 'aYZd')
  assert.equal(await custom.inputValue(), '####')
  await custom.evaluate(el => {
    el.setSelectionRange(1, 3)
    el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }))
    el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '中文' }))
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', data: '中文' }))
  })
  assert.equal(await password(), 'a中文d')
  assert.equal(await custom.inputValue(), '####')
  await page.evaluate(() => {
    const api = window.passwordSizingProbe
    api.PasswordChar = 'W'
    api.Password = 'a'.repeat(60)
  })
  await custom.focus()
  await custom.press('End')
  assert.equal(await custom.evaluate(el => el.selectionStart), 60)
  assert.equal(await custom.inputValue(), 'W'.repeat(60))
  assert(await custom.evaluate(el => el.scrollLeft > 0), 'long mask scrolls with native caret')
  await custom.press('Home')
  assert.equal(await custom.evaluate(el => el.scrollLeft), 0)
  const click = await custom.evaluate(el => {
    const css = getComputedStyle(el), rect = el.getBoundingClientRect()
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
    ctx.font = `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`
    return { x: rect.x + parseFloat(css.paddingLeft) + ctx.measureText('WWW').width + 0.1, y: rect.y + rect.height / 2 }
  })
  await page.mouse.click(click.x, click.y)
  assert.equal(await custom.evaluate(el => el.selectionStart), 3, 'pointer caret follows actual custom glyph width')
  const reveal = page.locator('.example-display').nth(1).locator('.win-password-reveal')
  await reveal.hover()
  await page.mouse.down()
  assert.equal(await custom.inputValue(), 'a'.repeat(60))
  await page.mouse.up()
  assert.equal(await custom.inputValue(), 'W'.repeat(60))
  assert.equal(await custom.evaluate(el => el.selectionStart), 3, 'Peek preserves selection')
  await page.screenshot({ path: path.join(output, 'password-custom-caret.png'), fullPage: true })
  const native = page.locator('.example-display').nth(2).locator('input')
  await native.fill('native password')
  assert.equal(await native.getAttribute('type'), 'password')
  assert.equal(await native.evaluate(() => [...document.querySelectorAll('style')].some(style =>
    /input::\-ms-reveal\s*\{\s*display:\s*none/.test(style.textContent))), true, 'browser reveal suppression rule is loaded')
  console.log('PASS PasswordChar: actual masks, native caret/scroll/pointer selection, editing, undo/redo, paste, IME and Peek selection; browser reveal hidden')
  assert.deepEqual(problems, [], 'browser errors and Vue warnings')
} finally { await browser.close() }
