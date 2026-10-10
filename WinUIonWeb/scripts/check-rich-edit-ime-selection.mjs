import assert from 'node:assert/strict'
import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'

const base = process.env.TEXT_CHECK_URL ?? 'http://127.0.0.1:63179/WinUIonWeb/'
const browser = await chromium.launch({ headless: true })
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}#/richeditbox`, { waitUntil: 'domcontentloaded', timeout: 180000 })
  await page.locator('.win-reb-editor').first().waitFor({ timeout: 90000 })
  const editor = page.locator('.win-reb-editor').first()
  await editor.evaluate(el => {
    let instance = el.__vueParentComponent
    while (instance && instance.type.__name !== 'RichEditBox') instance = instance.parent
    if (!instance) throw new Error('RichEditBox component is missing')
    window.richEditProbe = { api: instance.exposed, events: [], writes: 0 }
    for (const name of ['TextChanged', 'TextCompositionStarted', 'TextCompositionChanged', 'TextCompositionEnded']) {
      instance.vnode.props[`on${name}`] = () => window.richEditProbe.events.push(name)
    }
    const nativeInnerText = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText')
    Object.defineProperty(el, 'innerText', {
      get() { return nativeInnerText.get.call(this) },
      set(value) { window.richEditProbe.writes++; nativeInnerText.set.call(this, value) }
    })
    const probe = window.richEditProbe
    probe.api.Document.SetText('None', '')
    probe.api.MaxLength = 4
    probe.api.CharacterCasing = 'Upper'
    probe.api.AcceptsReturn = false
    probe.events = []; probe.writes = 0
  })
  await editor.focus()
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.imeSetComposition', { text: 'ni', selectionStart: 2, selectionEnd: 2 })
  await page.waitForTimeout(50)
  assert.equal(await editor.innerText(), 'ni', 'IME candidate casing must remain untouched')
  assert.equal(await page.evaluate(() => window.richEditProbe.writes), 0, 'IME candidate must not rewrite innerText')
  assert.equal(await page.evaluate(() => window.richEditProbe.events.filter(event => event === 'TextChanged').length), 0, 'IME candidate must not commit document changes')
  const candidateKeys = await editor.evaluate(el => {
    const enter = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, cancelable: true, bubbles: true })
    const undo = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, isComposing: true, cancelable: true, bubbles: true })
    el.dispatchEvent(enter); el.dispatchEvent(undo)
    return { enter: enter.defaultPrevented, undo: undo.defaultPrevented }
  })
  assert.deepEqual(candidateKeys, { enter: false, undo: false }, 'IME candidate keys must reach the native candidate window')
  await cdp.send('Input.imeSetComposition', { text: '你好世界呀', selectionStart: 5, selectionEnd: 5 })
  assert.equal(await editor.innerText(), '你好世界呀', 'MaxLength must not truncate an active candidate')
  await cdp.send('Input.insertText', { text: '你好世界呀' })
  await page.waitForTimeout(60)
  assert.equal(await editor.innerText(), '你好世界', 'Committed IME text applies MaxLength')
  const composition = await page.evaluate(() => ({ events: window.richEditProbe.events, writes: window.richEditProbe.writes,
    start: window.richEditProbe.api.Document.Selection.StartPosition, end: window.richEditProbe.api.Document.Selection.EndPosition }))
  assert.equal(composition.events.filter(event => event === 'TextChanged').length, 1, 'Final composition input must commit exactly once')
  assert.equal(composition.events.filter(event => event === 'TextCompositionStarted').length, 1)
  assert.equal(composition.events.filter(event => event === 'TextCompositionEnded').length, 1)
  assert.equal(composition.start, 4, 'Truncated IME caret must stay at committed text end')
  assert.equal(composition.end, 4)
  await page.evaluate(() => window.richEditProbe.api.Document.Undo())
  assert.equal(await editor.innerText(), '', 'One undo restores the pre-composition document')
  console.log('PASS RichEditBox native Chromium IME: untouched candidates, Enter/shortcuts, one commit/undo, MaxLength and caret')

  await page.evaluate(() => {
    const api = window.richEditProbe.api
    api.MaxLength = 0; api.CharacterCasing = 'Normal'; api.AcceptsReturn = true
    api.Document.SetText('None', 'abcdef')
    api.Focus(); api.Document.Selection.SetRange(1, 4)
  })
  assert.equal(await page.evaluate(() => getSelection().toString()), 'bcd')
  await page.mouse.click(800, 8)
  assert.equal(await page.evaluate(() => getSelection().toString()), '', 'Clicking page text releases native rich text selection')
  assert.equal(await page.evaluate(() => window.richEditProbe.api.Document.Selection.EndPosition - window.richEditProbe.api.Document.Selection.StartPosition), 0, 'Outside click collapses the document selection')
  await page.evaluate(() => { window.richEditProbe.api.Focus(); window.richEditProbe.api.Document.Selection.SetRange(0, 3) })
  const findInput = page.locator('.win-relative-panel input').first()
  await findInput.focus()
  const query = await page.evaluate(() => {
    const active = document.activeElement
    const format = window.richEditProbe.api.Document.Selection.CharacterFormat
    void format.Bold; void format.ForegroundColor
    return { stableFocus: document.activeElement === active, selection: getSelection().toString(), length: window.richEditProbe.api.Document.Selection.EndPosition - window.richEditProbe.api.Document.Selection.StartPosition }
  })
  assert.deepEqual(query, { stableFocus: true, selection: '', length: 0 }, 'CharacterFormat getters must not steal focus or restore old selection')
  console.log('PASS RichEditBox outside pointer/focus selection release and side-effect-free CharacterFormat getters')

  const customEditor = page.locator('.win-relative-panel .win-reb-editor')
  await customEditor.evaluate(el => {
    let instance = el.__vueParentComponent
    while (instance && instance.type.__name !== 'RichEditBox') instance = instance.parent
    window.customRichEditProbe = instance.exposed
    instance.exposed.Document.SetText('None', 'formatting')
    instance.exposed.Focus(); instance.exposed.Document.Selection.SetRange(0, 6)
  })
  const boldButton = page.locator('.win-relative-panel button').nth(2)
  await boldButton.click()
  assert.equal(await customEditor.evaluate(el => [...el.querySelectorAll('b,strong')].some(node => node.textContent === 'format')), true, 'Gallery toolbar formats the retained real selection')
  await page.mouse.click(800, 8)
  assert.equal(await page.evaluate(() => getSelection().toString()), '')
  assert.equal(await page.evaluate(() => window.customRichEditProbe.Document.Selection.EndPosition - window.customRichEditProbe.Document.Selection.StartPosition), 0)
  console.log('PASS RichEditBox Gallery toolbar keeps the real formatting range, then outside click releases it')

  await page.evaluate(() => {
    const api = window.richEditProbe.api
    api.Focus(); api.Document.SetText('None', '')
    window.richEditProbe.events = []; window.richEditProbe.writes = 0
  })
  await cdp.send('Input.imeSetComposition', { text: 'ni', selectionStart: 2, selectionEnd: 2 })
  await page.evaluate(() => window.richEditProbe.api.Document.SetText('None', 'queued'))
  assert.equal(await editor.innerText(), 'ni', 'Programmatic document changes wait for the IME transaction')
  await cdp.send('Input.insertText', { text: '你' })
  await page.waitForTimeout(50)
  assert.equal(await editor.innerText(), 'queued', 'Deferred document changes apply after composition completes')
  console.log('PASS RichEditBox programmatic SetText cannot invalidate an active IME composition')
  assert.deepEqual(errors, [], 'No browser runtime errors')
} finally {
  await browser.close()
}
