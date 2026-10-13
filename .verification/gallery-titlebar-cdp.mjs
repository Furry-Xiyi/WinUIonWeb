import { writeFile } from 'node:fs/promises'

const endpoint = 'http://127.0.0.1:9933'
const target = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json()
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let nextId = 0
const pending = new Map()
socket.addEventListener('message', ({ data }) => {
  const event = JSON.parse(data)
  if (!event.id) return
  const entry = pending.get(event.id)
  if (!entry) return
  pending.delete(event.id)
  if (event.error) entry.reject(new Error(JSON.stringify(event.error)))
  else entry.resolve(event.result)
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}
const inspect = async width => {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false })
  await sleep(800)
  return evaluate(`(() => {
    const root = document.querySelector('.gallery-titlebar')
    const content = root?.querySelector('.win-titlebar-content')
    const search = root?.querySelector('.gallery-titlebar-search')
    const button = root?.querySelector('.gallery-titlebar-search-button')
    const rect = element => { const r = element?.getBoundingClientRect(); return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null }
    const style = element => element ? { display: getComputedStyle(element).display, pointerEvents: getComputedStyle(element).pointerEvents } : null
    const r = button?.getBoundingClientRect()
    const hit = r ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null
    const buttonComputed = button ? getComputedStyle(button) : null
    const searchComputed = search ? getComputedStyle(search) : null
    const ancestors = []
    for (let element = button; element && ancestors.length < 7; element = element.parentElement) {
      const computed = getComputedStyle(element)
      ancestors.push({ tag: element.tagName, className: element.className, rect: rect(element), height: computed.height, minHeight: computed.minHeight, alignSelf: computed.alignSelf, display: computed.display, padding: computed.padding, margin: computed.margin })
    }
    return { width: innerWidth, rootClass: root?.className, gridColumns: getComputedStyle(root).gridTemplateColumns, children: [...root.children].filter(x => x.classList.contains('win-titlebar-title') || x.classList.contains('win-titlebar-icon') || x.classList.contains('win-titlebar-pane-toggle-button')).map(x => ({ className: x.className, rect: rect(x), display: getComputedStyle(x).display })), root: rect(root), content: rect(content), search: rect(search), searchStyle: style(search), searchComputed: searchComputed && { width: searchComputed.width, minWidth: searchComputed.minWidth, margin: searchComputed.margin, flexBasis: searchComputed.flexBasis }, button: rect(button), buttonStyle: style(button), buttonComputed: buttonComputed && { height: buttonComputed.height, minHeight: buttonComputed.minHeight, alignSelf: buttonComputed.alignSelf, margin: buttonComputed.margin, padding: buttonComputed.padding }, ancestors, buttonAttr: button?.getAttribute('tooltipservice.tooltip'), hit: hit?.className ?? hit?.tagName, hitIsButton: !!(hit && button?.contains(hit)), popup: !!document.querySelector('.gallery-compact-search-popup') }
  })()`)
}
await send('Page.enable')
await send('Runtime.enable')
if (process.argv.includes('--fake-host')) await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.winUIonWebWindowControls = { Minimize() {}, ToggleMaximize() {}, Close() {}, IsMaximized() { return false }, GetTitleBarInsets() { return { LeftInset: 0, RightInset: 0, TitleBarArea: { X: 0, Y: 0, Width: innerWidth, Height: 46 } } } }` })
await send('Page.navigate', { url: 'http://127.0.0.1:5185/' })
for (let attempt = 0; attempt < 50; attempt++) {
  if (await evaluate('!!document.querySelector(\'.gallery-titlebar\')')) break
  await sleep(200)
}
console.log('dialog buttons', JSON.stringify(await evaluate(`Array.from(document.querySelectorAll('.content-dialog button')).map(button => ({ text: button.textContent, className: button.className, disabled: button.disabled }))`)))
await evaluate(`document.querySelector('.content-dialog-close')?.click()`)
await sleep(500)
for (const width of [600, 500, 450, 420, 380, 340]) console.log(JSON.stringify(await inspect(width)))
const small = await inspect(380)
if (small.button && small.buttonStyle?.display !== 'none') {
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: small.button.x + small.button.width / 2, y: small.button.y + small.button.height / 2 })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: small.button.x + small.button.width / 2, y: small.button.y + small.button.height / 2, button: 'left', clickCount: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: small.button.x + small.button.width / 2, y: small.button.y + small.button.height / 2, button: 'left', clickCount: 1 })
  await sleep(100)
  console.log('after click', JSON.stringify(await inspect(380)))
}
console.log('tooltip test', JSON.stringify(await evaluate(`(async () => {
  const target = document.querySelector('.win-titlebar-back-button, .win-titlebar-pane-toggle-button')
  if (!target) return { target: null }
  const r = target.getBoundingClientRect()
  target.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse', clientX: r.x + 2, clientY: r.y + 2 }))
  await new Promise(resolve => setTimeout(resolve, 1100))
  return { target: target.getAttribute('tooltipservice.tooltip'), tips: Array.from(document.querySelectorAll('.win-tooltip')).map(tip => ({ text: tip.textContent, display: getComputedStyle(tip).display, rect: (() => { const box = tip.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height } })() })) }
})()`)))
const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
await writeFile(new URL('./gallery-titlebar-search-check.png', import.meta.url), Buffer.from(screenshot.data, 'base64'))
socket.close()
