// WinUI only enters PointerOver when the pointer is capable of hovering.
// Browsers can keep :hover matched after a touch tap, even on hybrid devices.
export const isHoverPointer = (event: PointerEvent): boolean => event.pointerType !== 'touch'

let installed = false

type TouchPress = {
  pointerId: number
  target: Node
  clientX: number
  clientY: number
  timer: number
  contextRequested: boolean
}

type SuppressedTouchClick = {
  target: Node
  clientX: number
  clientY: number
  expiresAt: number
}

const longPressDelay = 500
const movementThreshold = 12
let touchPress: TouchPress | null = null
let suppressedClick: SuppressedTouchClick | null = null

const clearTouchPress = () => {
  if (touchPress) window.clearTimeout(touchPress.timer)
  touchPress = null
}

const relatedTargets = (first: Node, second: Node): boolean =>
  first === second || first.contains(second) || second.contains(first)

const onTouchPointerDown = (event: PointerEvent) => {
  if (event.pointerType !== 'touch' || !event.isPrimary || event.button !== 0 || !(event.target instanceof Node)) return
  clearTouchPress()
  const press: TouchPress = {
    pointerId: event.pointerId,
    target: event.target,
    clientX: event.clientX,
    clientY: event.clientY,
    timer: 0,
    contextRequested: false
  }
  press.timer = window.setTimeout(() => {
    if (touchPress !== press || !press.target.isConnected || press.contextRequested) return
    press.contextRequested = true
    suppressedClick = {
      target: press.target,
      clientX: press.clientX,
      clientY: press.clientY,
      expiresAt: Date.now() + 1200
    }
    press.target.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      button: 2,
      clientX: press.clientX,
      clientY: press.clientY,
      screenX: event.screenX,
      screenY: event.screenY
    }))
  }, longPressDelay)
  touchPress = press
}

const onTouchPointerMove = (event: PointerEvent) => {
  const press = touchPress
  if (!press || press.pointerId !== event.pointerId) return
  if (Math.hypot(event.clientX - press.clientX, event.clientY - press.clientY) > movementThreshold) clearTouchPress()
}

const onTouchPointerEnd = (event: PointerEvent) => {
  const press = touchPress
  if (!press || press.pointerId !== event.pointerId) return
  if (press.contextRequested && suppressedClick) suppressedClick.expiresAt = Date.now() + 1200
  clearTouchPress()
}

const onContextMenu = (event: MouseEvent) => {
  // WinUI flyouts replace the platform/browser context menu. Capture this
  // before Safari or Chromium can show its own menu, while allowing component
  // contextmenu handlers to receive the event normally.
  event.preventDefault()

  const press = touchPress
  if (!event.isTrusted || !press || !relatedTargets(press.target, event.target as Node)) return
  if (Math.hypot(event.clientX - press.clientX, event.clientY - press.clientY) > movementThreshold * 2) return
  press.contextRequested = true
  suppressedClick = {
    target: press.target,
    clientX: press.clientX,
    clientY: press.clientY,
    expiresAt: Date.now() + 1200
  }
  window.clearTimeout(press.timer)
}

const onClick = (event: MouseEvent) => {
  const pending = suppressedClick
  if (!pending) return
  if (Date.now() > pending.expiresAt) { suppressedClick = null; return }
  if (event.detail === 0 || !(event.target instanceof Node) || !relatedTargets(pending.target, event.target)
    || Math.hypot(event.clientX - pending.clientX, event.clientY - pending.clientY) > movementThreshold * 2) return
  event.preventDefault()
  event.stopImmediatePropagation()
  suppressedClick = null
}

export const installPointerInput = (): void => {
  if (installed || typeof document === 'undefined') return
  installed = true
  const root = document.documentElement
  const update = (event: PointerEvent) => {
    if (event.pointerType === 'touch' && !root.classList.contains('winui-touch-input')) root.classList.add('winui-touch-input')
    else if ((event.pointerType === 'mouse' || event.pointerType === 'pen') && root.classList.contains('winui-touch-input')) root.classList.remove('winui-touch-input')
  }
  document.addEventListener('pointerdown', update, true)
  document.addEventListener('pointermove', update, true)
  document.addEventListener('pointerdown', onTouchPointerDown, true)
  document.addEventListener('pointermove', onTouchPointerMove, true)
  document.addEventListener('pointerup', onTouchPointerEnd, true)
  document.addEventListener('pointercancel', onTouchPointerEnd, true)
  document.addEventListener('contextmenu', onContextMenu, true)
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', event => {
    if (['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
      root.classList.remove('winui-touch-input')
    }
  }, true)
  window.addEventListener('blur', clearTouchPress)
}
