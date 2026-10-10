import assert from 'node:assert/strict'
import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const base = process.env.TEXT_CHECK_URL ?? 'http://127.0.0.1:63179/WinUIonWeb/'
const browser = await chromium.launch({ headless: true })
const problems = []
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US', permissions: ['clipboard-read', 'clipboard-write'] })
  page.setDefaultTimeout(60000)
  page.on('pageerror', error => problems.push(error.message))
  page.on('console', message => { if (message.type() === 'warning' && /\[Vue warn\]/.test(message.text())) problems.push(message.text()) })
  const cdp = await page.context().newCDPSession(page)
  const navigate = async (route, title) => {
    if (page.url().startsWith(base)) await page.evaluate(hash => { location.hash = hash }, `/${route}`)
    else await page.goto(`${base}#/${route}`, { waitUntil: 'domcontentloaded', timeout: 180000 })
    await page.waitForFunction(expected => document.querySelector('.page-header')?.textContent === expected, title)
  }
  const getApi = (input, name, key) => input.evaluate((el, { name, key }) => {
    let instance = el.__vueParentComponent
    while (instance && instance.type.__name !== name) instance = instance.parent
    if (!instance?.exposed) throw new Error(`${name} API was not found`)
    window[key] = instance.exposed
  }, { name, key })

  await navigate('textbox', 'TextBox')
  const input = page.locator('.example-display .win-textbox-field').first()
  await getApi(input, 'TextBox', 'editInputProbe')
  await input.evaluate(el => {
    let instance = el.__vueParentComponent
    while (instance && instance.type.__name !== 'TextBox') instance = instance.parent
    window.textBoxImeEvents = []
    instance.vnode.props.onBeforeTextChanging = (_sender, args) => {
      window.textBoxImeEvents.push(`before:${args.NewText}`)
      if (args.NewText === 'ni') args.Cancel = true
    }
    instance.vnode.props.onTextChanged = () => window.textBoxImeEvents.push('changed')
  })
  await input.focus()
  await cdp.send('Input.imeSetComposition', { text: 'ni', selectionStart: 2, selectionEnd: 2 })
  assert.equal(await input.inputValue(), 'ni', 'IME candidate remains in native TextBox')
  assert.deepEqual(await page.evaluate(() => window.textBoxImeEvents), [], 'BeforeTextChanging waits for IME commit')
  const key = await input.evaluate(el => {
    const enter = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, bubbles: true, cancelable: true })
    el.dispatchEvent(enter)
    return enter.defaultPrevented
  })
  assert.equal(key, false, 'IME Enter is not swallowed')
  await cdp.send('Input.insertText', { text: '你' })
  await page.waitForTimeout(50)
  assert.equal(await input.inputValue(), '你')
  assert.equal(await page.evaluate(() => window.editInputProbe.Text), '你')
  assert.deepEqual(await page.evaluate(() => window.textBoxImeEvents), ['before:你', 'changed'])
  await input.fill('selected text')
  await page.evaluate(() => window.editInputProbe.Select(0, 8))
  const selected = await input.evaluate(el => [el.selectionStart, el.selectionEnd])
  assert.deepEqual(selected, [0, 8])
  await page.mouse.click(900, 8)
  assert.equal(await input.evaluate(el => document.activeElement === el), false, 'outside click releases TextBox focus')
  assert.equal(await page.locator('.example-display .win-textbox').first().evaluate(el => el.classList.contains('is-focused')), false)
  assert.equal(await page.locator('.win-commandbar-flyout:visible').count(), 0)
  await input.click()
  assert.equal(await input.evaluate(el => el.selectionStart === el.selectionEnd), true, 'new text pointer collapses old selection')
  await input.selectText()
  assert.equal(await page.locator('.win-commandbar-flyout:visible').count(), 0, 'mouse text selection does not open a flyout')
  await input.click({ button: 'right' })
  await page.locator('.win-commandbar-flyout:visible').waitFor()
  await page.mouse.click(900, 8)
  assert.equal(await input.evaluate(el => document.activeElement === el), false, 'right menu dismissal does not restore stale focus')
  console.log('PASS TextBox: native IME candidate, one final change, outside focus/selection release, mouse selection and right-menu dismissal')

  await navigate('autosuggestbox', 'AutoSuggestBox')
  const asb = page.locator('.example-display').nth(1).locator('input').first()
  await asb.focus()
  await cdp.send('Input.imeSetComposition', { text: 'ni', selectionStart: 2, selectionEnd: 2 })
  assert.equal(await asb.inputValue(), 'ni')
  await cdp.send('Input.insertText', { text: '你' })
  await page.waitForTimeout(50)
  assert.equal(await asb.inputValue(), '你')
  await asb.evaluate(el => el.setSelectionRange(0, 1))
  await asb.click()
  assert.equal(await asb.evaluate(el => el.selectionStart === el.selectionEnd), true, 'AutoSuggestBox pointer collapses its selection')
  await page.mouse.click(900, 8)
  assert.equal(await asb.evaluate(el => document.activeElement === el), false, 'AutoSuggestBox outside pointer releases focus')
  console.log('PASS AutoSuggestBox: candidate preserved and final IME text committed')
  const suggestionsField = page.locator('.example-display').first().locator('input')
  await suggestionsField.fill('a')
  const option = page.locator('.win-asb-popup [role="option"]:not([disabled])').first()
  await option.waitFor()
  await option.click()
  assert.equal(await page.locator('.win-asb-popup:visible').count(), 0)
  assert.notEqual((await page.locator('.example-display').first().textContent()).trim(), '')
  console.log('PASS AutoSuggestBox teleported suggestion keeps its owner focused through click')

  await navigate('numberbox', 'NumberBox')
  const number = page.locator('.example-display').nth(2).locator('input')
  await number.focus()
  await number.fill('')
  await cdp.send('Input.imeSetComposition', { text: '1.2', selectionStart: 3, selectionEnd: 3 })
  assert.equal(await number.inputValue(), '1.2', 'NumberBox candidate is not formatted early')
  const numberKey = await number.evaluate(el => {
    const down = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, bubbles: true, cancelable: true })
    el.dispatchEvent(down)
    return down.defaultPrevented
  })
  assert.equal(numberKey, false, 'NumberBox lets IME Enter reach candidate window')
  await cdp.send('Input.insertText', { text: '1.2' })
  const numberUp = await number.evaluate(el => {
    const up = new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true })
    el.dispatchEvent(up)
    return up.defaultPrevented
  })
  assert.equal(numberUp, false, 'IME confirmation keyup cannot commit NumberBox')
  assert.equal(await number.inputValue(), '1.2', 'NumberBox does not round IME confirmation to 1.25')
  await number.evaluate(el => el.setSelectionRange(0, 3))
  await number.click()
  assert.equal(await number.evaluate(el => el.selectionStart === el.selectionEnd), true, 'NumberBox pointer collapses its selection')
  await page.mouse.click(900, 8)
  assert.equal(await number.evaluate(el => document.activeElement === el), false, 'NumberBox outside pointer releases focus')
  console.log('PASS NumberBox: candidate Enter/keyup does not format until real commit')

  await navigate('passwordbox', 'PasswordBox')
  const password = page.locator('.example-display').nth(1).locator('input')
  await getApi(password, 'PasswordBox', 'passwordImeProbe')
  await password.fill('')
  await password.focus()
  await cdp.send('Input.imeSetComposition', { text: 'ni', selectionStart: 2, selectionEnd: 2 })
  const passwordKey = await password.evaluate(el => {
    const enter = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, bubbles: true, cancelable: true })
    el.dispatchEvent(enter)
    return enter.defaultPrevented
  })
  assert.equal(passwordKey, false)
  const passwordUndoKey = await password.evaluate(el => {
    const before = el.value
    const undo = new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', keyCode: 229, ctrlKey: true, isComposing: true, bubbles: true, cancelable: true })
    el.dispatchEvent(undo)
    return { prevented: undo.defaultPrevented, sameCandidate: el.value === before }
  })
  assert.deepEqual(passwordUndoKey, { prevented: false, sameCandidate: true }, 'IME Ctrl+Z belongs to the candidate window, not password history')
  await cdp.send('Input.insertText', { text: '你' })
  await page.waitForTimeout(50)
  assert.equal(await page.evaluate(() => window.passwordImeProbe.Password), '你')
  assert.equal(await password.inputValue(), '#')
  await password.evaluate(el => el.setSelectionRange(0, 1))
  await password.click()
  assert.equal(await password.evaluate(el => el.selectionStart === el.selectionEnd), true, 'PasswordBox pointer collapses its selection')
  await password.evaluate(el => el.setSelectionRange(0, 1))
  await page.mouse.click(900, 8)
  assert.equal(await password.evaluate(el => document.activeElement === el), false)
  const titleSearch = page.locator('.gallery-titlebar-search')
  const searchBefore = await titleSearch.boundingBox()
  await password.click({ button: 'right' })
  const menu = page.locator('.win-commandbar-flyout:visible')
  await menu.waitFor()
  assert.equal(await menu.getByRole('menuitem', { name: 'Copy', exact: true }).count(), 0)
  await page.mouse.click(900, 8)
  assert.equal(await password.evaluate(el => document.activeElement === el), false)
  assert.equal(Math.round((await titleSearch.boundingBox()).width), Math.round(searchBefore.width), 'right-click does not collapse titlebar search')
  console.log('PASS PasswordBox: native IME transaction, custom mask and outside focus release')
  assert.deepEqual(problems, [], 'browser errors and Vue warnings')
} finally { await browser.close() }
