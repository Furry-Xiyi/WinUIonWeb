<template>
  <span class="tooltip-service-host" aria-hidden="true" style="display:none" />
  <ToolTip ref="fallbackRef" Content="{x:Bind ServiceContent}" />
</template>
<script lang="ts">
import { ToolTipServiceToolTip } from './ToolTipServiceProperties'
export default { ToolTip: ToolTipServiceToolTip }
</script>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue'
import ToolTip from './ToolTip.vue'
import { xamlScopeKey } from './xamlRuntime'
import { isInToolTipSafeZone, registeredToolTip, toolTipOwnerContextKey, type ToolTipController, type ToolTipInputMode, type ToolTipPoint } from './toolTipRuntime'

const TOOLTIP = 'tooltipservice.tooltip', PLACEMENT = 'tooltipservice.placement', TARGET = 'tooltipservice.placementtarget'
const SELECTOR = '[tooltipservice\\.tooltip]'
// ToolTipService_Partial.h/.cpp defaults: hover 400; normal 2x; mouse
// reshow 1.5x; touch 1x; between-show 200; message duration 5 seconds.
const HOVER = 400, BETWEEN = 200, CLOSE = 167, DURATION = 5000
const ServiceContent = ref('')
provide(xamlScopeKey, { ServiceContent })
const fallbackRef = ref<{ Controller: ToolTipController } | null>(null)
const owner = shallowRef<HTMLElement | null>(null)
const mode = ref<ToolTipInputMode>('none'), point = ref<ToolTipPoint | null>(null), theme = ref('')
provide(toolTipOwnerContextKey, { owner, inputMode: mode, point, theme, attached: false })
const originalTitles = new WeakMap<HTMLElement, string | null>(), attached = new Set<HTMLElement>()
const describedBy = new WeakMap<HTMLElement, string | null>()
let active: HTMLElement | null = null, pending: HTMLElement | null = null, suppressed: HTMLElement | null = null
let observer: MutationObserver | null = null
let openTimer: number | undefined, closeTimer: number | undefined, touchTimer: number | undefined
let lastClosed = -Infinity, inputMode: ToolTipInputMode = 'none', lastPoint: ToolTipPoint | undefined
let openSequence = 0
const controller = (element: HTMLElement) => registeredToolTip(element) ?? (owner.value === element ? fallbackRef.value?.Controller : null)
const canOpen = (element: HTMLElement) => {
  if (element.matches(':disabled') || Boolean(element.closest('[aria-disabled="true"]'))) return false
  // WinUI suppresses service tips for disabled owners (including controls
  // whose root is a custom element with a disabled native descendant).
  if (element.matches(':disabled') || Boolean(element.querySelector(':disabled'))) return false
  const explicit = registeredToolTip(element)
  if (explicit) return explicit.IsEnabled()
  const content = element.getAttribute(TOOLTIP)
  return Boolean(content) && !/\{(?:x:Bind|Binding)\s|\[object Object\]/.test(content!)
}
const findOwner = (target: EventTarget | null) => {
  let current = target instanceof HTMLElement ? target : target instanceof Node ? target.parentElement : null
  while (current) { if (current.hasAttribute(TOOLTIP)) return current; current = current.parentElement }
  return null
}
function syncTitle(element: HTMLElement) {
  if (!element.hasAttribute(TOOLTIP)) { if (active === element) closeActive(); restoreTitle(element); return }
  if (!attached.has(element)) { originalTitles.set(element, element.getAttribute('title')); attached.add(element) }
  element.removeAttribute('title')
  if (active === element && owner.value === element) ServiceContent.value = element.getAttribute(TOOLTIP) ?? ''
}
function restoreTitle(element: HTMLElement) {
  if (!attached.has(element)) return
  const original = originalTitles.get(element)
  if (original === null || original === undefined) element.removeAttribute('title'); else element.setAttribute('title', original)
  attached.delete(element); originalTitles.delete(element)
}
const clearOpen = () => { if (openTimer !== undefined) window.clearTimeout(openTimer); openTimer = undefined; pending = null; openSequence += 1 }
const clearClose = () => { if (closeTimer !== undefined) window.clearTimeout(closeTimer); closeTimer = undefined }
const clearTouch = () => { if (touchTimer !== undefined) window.clearTimeout(touchTimer); touchTimer = undefined }
function restoreDescription(element: HTMLElement) {
  if (!describedBy.has(element)) return
  const original = describedBy.get(element)
  if (original === null || original === undefined) element.removeAttribute('aria-describedby'); else element.setAttribute('aria-describedby', original)
  describedBy.delete(element)
}
function closeActive() {
  clearOpen(); clearClose(); clearTouch()
  if (active) {
    controller(active)?.Close(); restoreDescription(active); lastClosed = performance.now()
  }
  active = null
}
function syncTheme(element: HTMLElement) {
  const scope = element.closest('.theme-light, .theme-dark')
  theme.value = scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : ''
}
async function openActive(element: HTMLElement, input: ToolTipInputMode, at?: ToolTipPoint) {
  if (!element.isConnected || !canOpen(element)) return
  clearClose(); clearOpen()
  if (active && active !== element) closeActive()
  active = element; inputMode = input; lastPoint = at
  let current = registeredToolTip(element)
  if (!current) {
    const sequence = openSequence
    owner.value = element; mode.value = input; point.value = at ?? null
    ServiceContent.value = element.getAttribute(TOOLTIP) ?? ''; syncTheme(element)
    await nextTick()
    if (sequence !== openSequence || active !== element || !element.isConnected) return
    current = fallbackRef.value?.Controller
  }
  if (!current || active !== element || !element.isConnected) return
  current?.Open(input, at)
  const sequence = openSequence
  await nextTick(); await current?.UpdatePosition()
  if (sequence !== openSequence || active !== element) return
  const id = current?.Element()?.id
  if (id) {
    if (!describedBy.has(element)) describedBy.set(element, element.getAttribute('aria-describedby'))
    const original = describedBy.get(element)
    element.setAttribute('aria-describedby', [original, id].filter(Boolean).join(' '))
  }
}
function queueOpen(element: HTMLElement, input: ToolTipInputMode, at?: ToolTipPoint) {
  if (suppressed === element || !canOpen(element)) return
  if (active === element && controller(element)?.IsOpen()) { clearClose(); return }
  if (pending === element) { lastPoint = at; return }
  const changing = Boolean(active && active !== element)
  if (changing) closeActive(); else { clearOpen(); clearClose() }
  const recentlyClosed = performance.now() - lastClosed <= BETWEEN
  const delay = input === 'touch' ? (recentlyClosed || changing ? 0 : HOVER) : input === 'keyboard' ? HOVER * 2 : (recentlyClosed || changing ? HOVER * 1.5 : HOVER * 2)
  pending = element; lastPoint = at
  openTimer = window.setTimeout(() => { void openActive(element, input, lastPoint) }, delay)
}
function inSafeZone(at: ToolTipPoint) {
  const tip = active ? controller(active)?.Element() : null
  return Boolean(active && tip && isInToolTipSafeZone(at, active.getBoundingClientRect(), tip.getBoundingClientRect()))
}
function queueClose(element: HTMLElement, force = false) {
  if (pending !== element && active !== element) return
  if (pending === element) clearOpen()
  if (!force && lastPoint && inSafeZone(lastPoint)) return
  if (closeTimer === undefined) closeTimer = window.setTimeout(() => { closeTimer = undefined; closeActive() }, CLOSE)
}
function scan(node: Node) {
  if (!(node instanceof Element)) return
  if (node instanceof HTMLElement && node.hasAttribute(TOOLTIP)) syncTitle(node)
  node.querySelectorAll<HTMLElement>(SELECTOR).forEach(syncTitle)
}
function release(node: Node) {
  if (!(node instanceof Element)) return
  const nodes = node instanceof HTMLElement && node.hasAttribute(TOOLTIP) ? [node, ...node.querySelectorAll<HTMLElement>(SELECTOR)] : [...node.querySelectorAll<HTMLElement>(SELECTOR)]
  nodes.forEach(element => { if (active === element) closeActive(); if (pending === element) clearOpen(); if (suppressed === element) suppressed = null; restoreTitle(element) })
}
function onPointerOver(event: PointerEvent) {
  const element = findOwner(event.target)
  if (element && event.pointerType !== 'touch') { inputMode = 'mouse'; queueOpen(element, 'mouse', { x: event.clientX, y: event.clientY }) }
  else if (active && (event.target as HTMLElement)?.closest?.('.win-tooltip')) clearClose()
}
function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  lastPoint = { x: event.clientX, y: event.clientY }
  if (active) { if (inSafeZone(lastPoint)) clearClose(); else queueClose(active) }
}
function onPointerOut(event: PointerEvent) {
  const popup = (event.target as HTMLElement | null)?.closest?.('.win-tooltip')
  if (popup && active) {
    const related = event.relatedTarget
    if (!(related instanceof Node && popup.contains(related))) {
      lastPoint = { x: event.clientX, y: event.clientY }
      queueClose(active, related === null)
    }
    return
  }
  const element = findOwner(event.target)
  if (!element) return
  const related = event.relatedTarget
  if (related instanceof Node && element.contains(related)) return
  if (suppressed === element) suppressed = null
  lastPoint = { x: event.clientX, y: event.clientY }
  queueClose(element, related === null)
}
function onPointerDown(event: PointerEvent) {
  const element = findOwner(event.target)
  inputMode = event.pointerType === 'touch' ? 'touch' : 'mouse'
  if (event.pointerType === 'touch' && element) {
    queueOpen(element, 'touch', { x: event.clientX, y: event.clientY })
    clearTouch(); touchTimer = window.setTimeout(closeActive, DURATION)
  } else if (element) { suppressed = element; if (active === element || pending === element) closeActive() }
  else if (active) closeActive()
}
function onPointerCanceled() { closeActive() }
function onPointerReleased(event: PointerEvent) { if (event.pointerType === 'touch' && pending) clearOpen() }
function onFocusIn(event: FocusEvent) { const element = findOwner(event.target); if (element && inputMode === 'keyboard') queueOpen(element, 'keyboard') }
function onFocusOut(event: FocusEvent) { const element = findOwner(event.target); if (element && !(event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) { if (suppressed === element) suppressed = null; queueClose(element, true) } }
function onKeyDown(event: KeyboardEvent) {
  inputMode = 'keyboard'
  if (event.key === 'Escape') { if (active) suppressed = active; closeActive(); return }
  // ToolTipService::IsSpecialKey preserves arrows and navigation/action
  // keys; ordinary typing dismisses a currently visible automatic tip.
  if (!['Alt', 'Backspace', 'Delete', 'ArrowDown', 'End', 'Home', 'Insert', 'ArrowLeft', 'PageDown', 'PageUp', 'ArrowRight', ' ', 'ArrowUp'].includes(event.key) && active) closeActive()
}
function onBlur() { closeActive(); suppressed = null }
function onVisibilityChanged() { if (document.hidden) onBlur() }
const listeners = { pointerover: onPointerOver, pointermove: onPointerMove, pointerout: onPointerOut, pointerdown: onPointerDown, pointercancel: onPointerCanceled, lostpointercapture: onPointerCanceled, pointerup: onPointerReleased, keydown: onKeyDown, focusin: onFocusIn, focusout: onFocusOut } as const
onMounted(() => {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach(syncTitle)
  observer = new MutationObserver(records => records.forEach(record => {
    if (record.type === 'attributes' && record.target instanceof HTMLElement) {
      if (record.attributeName === TOOLTIP) syncTitle(record.target)
      if (active && (record.target === active || record.target.contains(active))) {
        if (!canOpen(active)) closeActive()
        else { syncTheme(active); void controller(active)?.UpdatePosition() }
      }
    }
    record.addedNodes.forEach(scan); record.removedNodes.forEach(release)
  }))
  observer.observe(document.body, { attributes: true, attributeFilter: [TOOLTIP, PLACEMENT, TARGET, 'class', 'disabled', 'aria-disabled'], childList: true, subtree: true })
  for (const [event, handler] of Object.entries(listeners)) document.addEventListener(event, handler as EventListener, true)
  window.addEventListener('blur', onBlur); document.addEventListener('visibilitychange', onVisibilityChanged)
})
onBeforeUnmount(() => {
  observer?.disconnect(); closeActive(); attached.forEach(restoreTitle)
  for (const [event, handler] of Object.entries(listeners)) document.removeEventListener(event, handler as EventListener, true)
  window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVisibilityChanged)
})
</script>
