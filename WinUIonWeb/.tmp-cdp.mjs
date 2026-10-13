import fs from 'node:fs'

const version = await fetch('http://127.0.0.1:9333/json/version').then(response => response.json())
const browser = new WebSocket(version.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()
browser.onmessage = event => {
  const message = JSON.parse(event.data)
  const resolve = pending.get(message.id)
  if (resolve) { pending.delete(message.id); resolve(message) }
}
const sendBrowser = (method, params = {}) => new Promise(resolve => {
  const id = ++nextId
  pending.set(id, resolve)
  browser.send(JSON.stringify({ id, method, params }))
})
await new Promise(resolve => { browser.onopen = resolve })
const target = await sendBrowser('Target.createTarget', { url: 'http://127.0.0.1:63180/WinUIonWeb/#/button' })
await new Promise(resolve => setTimeout(resolve, 15000))
const pages = await fetch('http://127.0.0.1:9333/json/list').then(response => response.json())
const page = pages.find(item => item.id === target.result.targetId)
if (!page) throw new Error('page not found')
const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(resolve => { socket.onopen = resolve })
let id = 0
const send = (method, params = {}) => new Promise(resolve => {
  const requestId = ++id
  const handler = event => {
    const message = JSON.parse(event.data)
    if (message.id === requestId) { socket.removeEventListener('message', handler); resolve(message) }
  }
  socket.addEventListener('message', handler)
  socket.send(JSON.stringify({ id: requestId, method, params }))
})
await send('Runtime.enable')
await send('Page.enable')
await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].find(button => button.innerText.includes('我知道了'))?.click()` })
await new Promise(resolve => setTimeout(resolve, 1000))
await send('Runtime.evaluate', { expression: `document.documentElement.className = 'theme-light'` })
const evaluation = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify({
  title: document.title,
  ready: document.readyState,
  url: location.href,
  body: document.body.innerText.slice(0, 300),
  classes: document.documentElement.className,
  buttons: [...document.querySelectorAll('.win-btn')].filter(button => button.getBoundingClientRect().width > 30 && button.querySelector('.win-button-content-presenter')).slice(0, 12).map(button => {
    const style = getComputedStyle(button)
    const after = getComputedStyle(button, '::after')
    return { text: button.innerText, classes: button.className, box: button.getBoundingClientRect().toJSON(), outerBackground: style.background, outerBorder: style.border, borderLeft: style.borderLeft, borderTop: style.borderTop, borderRight: style.borderRight, borderBottom: style.borderBottom, borderVarLeft: style.getPropertyValue('--ButtonBorderBrushLeftCurrent'), borderVarTop: style.getPropertyValue('--ButtonBorderBrushTopCurrent'), borderVarRight: style.getPropertyValue('--ButtonBorderBrushRightCurrent'), borderVarBottom: style.getPropertyValue('--ButtonBorderBrushBottomCurrent'), brush: style.getPropertyValue('--ButtonBorderBrushCurrent'), afterBackground: after.background, afterImage: after.backgroundImage, afterPadding: after.padding, presenter: button.querySelector('.win-button-content-presenter') && (() => { const p = getComputedStyle(button.querySelector('.win-button-content-presenter')); return { background: p.background, border: p.border, borderColor: p.borderColor, borderWidth: p.borderWidth, borderLeft: p.borderLeft, borderTop: p.borderTop, borderRight: p.borderRight, borderBottom: p.borderBottom } })() }
  })
})` })
console.log(evaluation.result?.result?.value ?? JSON.stringify(evaluation))
const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
fs.writeFileSync('button-cdp.png', Buffer.from(screenshot.result.data, 'base64'))
console.log('saved button-cdp.png')
socket.close(); browser.close()
