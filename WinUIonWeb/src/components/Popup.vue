<template>
  <span ref="originRef" class="win-popup-origin" v-bind="originAttributes" aria-hidden="true" />
  <Teleport to="body">
    <div
      v-if="isOpen && lightDismiss"
      class="win-popup-overlay"
      :class="[themeClass, { 'is-visible': overlayMode === 'On' }]"
      :style="overlayStyle"
      aria-hidden="true"
      @pointerdown.prevent.stop="DismissPopup" />
    <div
      v-show="isOpen"
      ref="popupRef"
      :class="[isOpen ? 'win-popup-root' : 'win-popup-child-storage', themeClass]"
      :style="popupStyle"
      :inert="!isOpen ? true : undefined"
      :aria-hidden="!isOpen ? 'true' : undefined"
      :dir="flowDirection === 'RightToLeft' ? 'rtl' : undefined"
      tabindex="-1">
      <div ref="shadowHostRef" class="win-popup-shadow-host" aria-hidden="true" />
      <ChildOutlet />
    </div>
  </Teleport>
</template>

<script lang="ts">
import { brushProperty } from './brushProperties'

const PopupChild = defineComponent({
  name: 'Popup.Child',
  __popupProperty: 'child',
  setup() { return () => null }
})

export default { Child: PopupChild, Shadow: brushProperty('Popup', 'Shadow') }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, unref, useAttrs, useSlots, watch, watchEffect, type ComponentInternalInstance, type VNode } from 'vue'
import { fitPopupPosition, popupBoundsFor, popupPlacementPosition, resolvePopupElement } from './popupRuntime'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { isThemeShadow } from './themeShadowRuntime'
import { clearThemeShadowVisual, setThemeShadowVisual } from './themeShadowVisual'

defineOptions({ name: 'Popup', inheritAttrs: false })
const props = defineProps({
  // Undefined means the caller uses the official x:Name/code-behind API and
  // owns IsOpen through the exposed dependency property. A supplied binding
  // is mirrored from props below.
  IsOpen: { type: [Boolean, String], default: undefined },
  Child: { type: [Object, String], default: undefined },
  Shadow: { type: [Object, String], default: null },
  Translation: { type: [Object, String], default: () => ({ X: 0, Y: 0, Z: 0 }) },
  HorizontalOffset: { type: [Number, String], default: 0 },
  VerticalOffset: { type: [Number, String], default: 0 },
  IsLightDismissEnabled: { type: [Boolean, String], default: false },
  LightDismissOverlayMode: { type: String, default: 'Off' },
  ShouldConstrainToRootBounds: { type: [Boolean, String], default: true },
  PlacementTarget: { type: [Object, String], default: null },
  DesiredPlacement: { type: String, default: 'Auto' },
  RequestedTheme: { type: String, default: 'Default' },
  FlowDirection: { type: String, default: 'LeftToRight' }
})
const emit = defineEmits(['update:IsOpen', 'update:Child', 'update:Shadow', 'update:Translation', 'Opened', 'Closed', 'ActualPlacementChanged'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const inheritedTheme = inject('winuiTheme', null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
// A Popup still occupies its zero-sized layout slot in the declaring visual
// tree. Its Child is rendered in PopupRoot, but inherits that slot's transform.
// Keep attached layout properties on this marker when teleporting the Child.
const originAttributes = computed(() => Object.fromEntries(Object.entries(attrs)
  .filter(([name]) => /^(?:Grid\.(?:Row|Column|RowSpan|ColumnSpan)|Canvas\.(?:Left|Top)|HorizontalAlignment|VerticalAlignment|Margin|data-xaml-ref)$/i.test(name))
  .map(([name, value]) => [name, resolve(value)])))
const boolean = (value: unknown) => resolve(value) === true || resolve(value) === 'True'
const number = (value: unknown) => {
  const resolved = Number(resolve(value))
  return Number.isFinite(resolved) ? resolved : 0
}
const dependencyProperty = <T,>(name: keyof typeof props, convert: (value: unknown) => T) => {
  const local = shallowRef<unknown>(undefined)
  watch(() => resolve(props[name]), () => { local.value = undefined })
  return computed({
    get: () => convert(local.value === undefined ? resolve(props[name]) : local.value),
    set: (value: T) => { local.value = value; updateXamlBinding(props[name], value, instance) }
  })
}
const originRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const shadowHostRef = ref<HTMLElement | null>(null)
const isOpen = ref(boolean(props.IsOpen))
const actualPlacement = ref('Auto')
const position = ref({ left: 0, top: 0, width: 0, height: 0, rootLeft: 0, rootTop: 0, ready: false })
const lightDismiss = dependencyProperty('IsLightDismissEnabled', boolean)
const flowDirection = dependencyProperty('FlowDirection', String)
const horizontalOffset = dependencyProperty('HorizontalOffset', number)
const verticalOffset = dependencyProperty('VerticalOffset', number)
const placementTarget = dependencyProperty('PlacementTarget', resolvePopupElement)
const desiredPlacement = dependencyProperty('DesiredPlacement', String)
const requestedTheme = dependencyProperty('RequestedTheme', String)
const constrainToRoot = dependencyProperty('ShouldConstrainToRootBounds', boolean)
const overlayMode = dependencyProperty('LightDismissOverlayMode', String)
const declarationNodes = shallowRef<VNode[]>([])
const shadowProperty = useBrushProperty('Shadow', () => props.Shadow, () => declarationNodes.value, instance)
const shadowOverride = shallowRef<unknown>()
const Shadow = computed({
  get: () => shadowOverride.value === undefined ? shadowProperty.value.value : shadowOverride.value,
  set: (value: unknown) => { shadowOverride.value = value; updateXamlBinding(props.Shadow, value, instance); emit('update:Shadow', value) }
})
watch(() => resolve(props.Shadow), () => { shadowOverride.value = undefined })
const translationProperty = dependencyProperty('Translation', value => value as string | { X?: number; Y?: number; Z?: number })
const Translation = computed({
  get: () => translationProperty.value,
  set: value => { translationProperty.value = value; emit('update:Translation', value) }
})
const translationCoordinates = computed(() => {
  const value = Translation.value
  const coordinates = typeof value === 'string' ? value.split(',').map(Number) : [value?.X ?? 0, value?.Y ?? 0, value?.Z ?? 0]
  return coordinates.map(value => Number(value) || 0)
})
const childOverride = shallowRef<unknown>(undefined)
const retainedChild = shallowRef<unknown>(null)
const suppliedChild = computed(() => childOverride.value === undefined ? resolve(props.Child) : childOverride.value)
watch(() => resolve(props.Child), () => { childOverride.value = undefined })
const themeClass = computed(() => {
  const requested = requestedTheme.value.toLowerCase()
  const inherited = String(unref(inheritedTheme) ?? '').toLowerCase()
  const theme = requested === 'light' || requested === 'dark' ? requested : inherited
  return theme === 'light' || theme === 'dark' ? `win-theme-scope theme-${theme}` : ''
})
const popupStyle = computed<import('vue').CSSProperties>(() => ({
  left: `${position.value.left}px`, top: `${position.value.top}px`,
  maxWidth: `${position.value.width}px`, maxHeight: `${position.value.height}px`,
  visibility: position.value.ready ? 'visible' : 'hidden',
  transform: translationCoordinates.value[0] || translationCoordinates.value[1]
    ? `translate(${translationCoordinates.value[0]}px, ${translationCoordinates.value[1]}px)` : undefined
}))
const overlayStyle = computed<import('vue').CSSProperties>(() => ({
  left: `${position.value.rootLeft}px`, top: `${position.value.rootTop}px`,
  width: `${position.value.width}px`, height: `${position.value.height}px`,
  visibility: position.value.ready ? 'visible' : 'hidden'
}))

const childNodes = (nodes: VNode[]): VNode[] => {
  const result: VNode[] = []
  for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) result.push(...childNodes(node.children as VNode[]))
    else if ((node.type as { __popupProperty?: string }).__popupProperty === 'child') {
      const childSlot = (node.children as { default?: () => VNode[] } | null)?.default
      result.push(...(childSlot?.() ?? []))
    } else if (!isBrushProperty(node)) result.push(node)
  }
  return result
}
const ChildOutlet = defineComponent({
  name: 'PopupChildOutlet',
  setup() {
    return () => {
      declarationNodes.value = slots.default?.() ?? []
      // Evaluate structural Shadow resources from the saved declaration tree.
      Shadow.value
      const child = suppliedChild.value
      // An assigned DOM UIElement is adopted by the host below. A XAML/VNode
      // child remains owned by Vue so its bindings and event handlers stay live.
      const nodes = child === undefined ? childNodes(declarationNodes.value) : isVNode(child) ? [child] : []
      return h(Fragment, normalizeXamlNodes(nodes, instance))
    }
  }
})
let adoptedChild: HTMLElement | null = null
const shadowChildElement = shallowRef<HTMLElement | null>(null)
const synchronizeChild = () => {
  const host = popupRef.value
  if (!host) return
  const child = suppliedChild.value
  const element = resolvePopupElement(child)
  if (adoptedChild && adoptedChild !== element && adoptedChild.parentElement === host) adoptedChild.remove()
  adoptedChild = element
  if (element && element.parentElement !== host) host.appendChild(element)
  const childElement = Array.from(host.children).find(element => element !== shadowHostRef.value) as HTMLElement | undefined
  retainedChild.value = child === undefined ? childElement ?? null : child
  shadowChildElement.value = childElement ?? null
}
const delegatedShadowOwner = Symbol('Popup.Child delegated ThemeShadow')
const clearDelegatedShadow = () => {
  if (shadowHostRef.value) clearThemeShadowVisual(shadowHostRef.value, delegatedShadowOwner)
}
const synchronizeShadowGeometry = () => {
  const host = shadowHostRef.value, popup = popupRef.value, child = shadowChildElement.value
  if (!host || !popup || !child) return
  const childRect = child.getBoundingClientRect(), popupRect = popup.getBoundingClientRect()
  Object.assign(host.style, {
    left: `${childRect.left - popupRect.left}px`, top: `${childRect.top - popupRect.top}px`,
    width: `${childRect.width}px`, height: `${childRect.height}px`
  })
}
const childShadow = (element: HTMLElement) => {
  // Public UIElement.Shadow on the Child takes precedence over Popup.Shadow.
  // Reading the exposed ref also tracks code-behind changes on retained Child.
  const record = element as HTMLElement & { __vueParentComponent?: ComponentInternalInstance; Shadow?: unknown }
  const component = record.__vueParentComponent
  if (component?.vnode.el === element && component.exposed && 'Shadow' in component.exposed) return unref(component.exposed.Shadow)
  return record.Shadow
}
watchEffect(() => {
  const element = shadowChildElement.value
  const host = shadowHostRef.value
  const shadow = Shadow.value
  const ownShadow = element ? childShadow(element) : null
  if (!isOpen.value || !host || !element || !isThemeShadow(shadow) || shadow.IsDisposed || (isThemeShadow(ownShadow) && !ownShadow.IsDisposed)) {
    clearDelegatedShadow()
    return
  }
  synchronizeShadowGeometry()
  const style = getComputedStyle(element)
  const cornerRadius = Math.max(...[style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map(value => Number.parseFloat(value) || 0))
  // Child remains the official caster. Its outer projection lives beside it
  // so a Border can preserve its content clip without clipping that shadow.
  setThemeShadowVisual(host, { Shadow: shadow, Caster: element, Translation: Translation.value, Theme: themeClass.value, CornerRadius: cornerRadius }, delegatedShadowOwner)
}, { flush: 'post' })
const publicChild = computed({
  get: () => suppliedChild.value === undefined ? retainedChild.value : suppliedChild.value,
  set: (value: unknown) => {
    if (value !== null && !isVNode(value) && !resolvePopupElement(value)) throw new TypeError('Popup.Child must be a UIElement or null')
    childOverride.value = value
    updateXamlBinding(props.Child, value, instance)
    emit('update:Child', value)
  }
})
watch(suppliedChild, async () => {
  await nextTick()
  synchronizeChild()
  if (isOpen.value) schedulePosition()
}, { flush: 'post' })
onMounted(synchronizeChild)
onUpdated(synchronizeChild)

const setIsOpen = (value: boolean) => {
  if (value === isOpen.value) return
  isOpen.value = value
  updateXamlBinding(props.IsOpen, value, instance)
  emit('update:IsOpen', value)
}
const publicIsOpen = computed({ get: () => isOpen.value, set: (value) => setIsOpen(Boolean(value)) })
const popupApi = {
  IsOpen: publicIsOpen,
  ActualPlacement: computed(() => actualPlacement.value),
  HorizontalOffset: horizontalOffset,
  VerticalOffset: verticalOffset,
  PlacementTarget: placementTarget,
  DesiredPlacement: desiredPlacement,
  IsLightDismissEnabled: lightDismiss,
  LightDismissOverlayMode: overlayMode,
  RequestedTheme: requestedTheme,
  FlowDirection: flowDirection,
  ShouldConstrainToRootBounds: constrainToRoot,
  IsConstrainedToRootBounds: computed(() => constrainToRoot.value),
  Child: publicChild,
  Shadow,
  Translation,
  Element: popupRef
}
defineExpose(popupApi)
const dispatch = (event: 'Opened' | 'Closed' | 'ActualPlacementChanged') => {
  const sender = instance?.exposeProxy ?? new Proxy(popupApi, {
    get: (target, key) => unref(Reflect.get(target, key))
  })
  const handler = instance?.vnode.props?.[`on${event}`]
  if (typeof handler === 'function') handler(sender, {})
  else if (Array.isArray(handler)) handler.forEach((callback) => callback(sender, {}))
  else {
    emit(event, sender, {})
    resolveXamlHandler(attrs[event], instance)?.(sender, {})
  }
}
const DismissPopup = () => setIsOpen(false)

let version = 0
let previousFocus: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let animationFrame = 0
let restoreFocus = false
const updatePosition = () => {
  const popup = popupRef.value
  const origin = originRef.value?.parentElement
  if (!popup || !origin || !isOpen.value) return
  // WinUI retains the declaring Popup's transform through its ancestors even
  // though PopupRoot arranges Child at HorizontalOffset/VerticalOffset. Only
  // an explicit PlacementTarget + DesiredPlacement replaces that layout origin.
  const available = popupBoundsFor(origin, constrainToRoot.value)
  // Popup's one Child supplies all presenter chrome and transitions.
  popup.style.maxWidth = `${available.width}px`
  popup.style.maxHeight = `${available.height}px`
  const rect = popup.getBoundingClientRect()
  const layoutOrigin = originRef.value?.getBoundingClientRect()
  let next = { left: (layoutOrigin?.left ?? available.left) + horizontalOffset.value, top: (layoutOrigin?.top ?? available.top) + verticalOffset.value }
  let placement = 'Auto'
  if (placementTarget.value && desiredPlacement.value !== 'Auto') {
    const placed = popupPlacementPosition(placementTarget.value.getBoundingClientRect(), rect, desiredPlacement.value, available, 0, flowDirection.value === 'RightToLeft')
    next = { left: placed.left + horizontalOffset.value, top: placed.top + verticalOffset.value }
    placement = placed.placement
  }
  if (constrainToRoot.value) next = fitPopupPosition(next, rect, available)
  position.value = { ...next, rootLeft: available.left, rootTop: available.top, width: available.width, height: available.height, ready: available.width > 0 && available.height > 0 }
  synchronizeShadowGeometry()
  if (actualPlacement.value !== placement) {
    actualPlacement.value = placement
    dispatch('ActualPlacementChanged')
  }
}
const schedulePosition = () => {
  if (animationFrame) return
  animationFrame = requestAnimationFrame(() => { animationFrame = 0; updatePosition() })
}
const onPointerDown = (event: PointerEvent) => {
  if (!isOpen.value || !lightDismiss.value || event.defaultPrevented) return
  if (event.composedPath().includes(popupRef.value as EventTarget)) return
  setIsOpen(false)
}
const onKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value || !lightDismiss.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(false)
  } else if (event.key === 'Tab' && popupRef.value) {
    const controls = Array.from(popupRef.value.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'))
      .filter((control) => !control.hasAttribute('disabled') && control.getClientRects().length)
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (!first) { event.preventDefault(); popupRef.value.focus({ preventScroll: true }) }
    else if (event.shiftKey && (document.activeElement === first || !popupRef.value.contains(document.activeElement))) { event.preventDefault(); last?.focus({ preventScroll: true }) }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({ preventScroll: true }) }
  }
}
const removeListeners = () => {
  document.removeEventListener('pointerdown', onPointerDown, true)
  document.removeEventListener('keydown', onKeyDown, true)
  window.removeEventListener('resize', schedulePosition)
  window.removeEventListener('scroll', schedulePosition, true)
  window.visualViewport?.removeEventListener('resize', schedulePosition)
  resizeObserver?.disconnect()
  resizeObserver = null
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = 0
}
watch(() => props.IsOpen === undefined ? undefined : resolve(props.IsOpen), (value) => {
  if (value !== undefined) isOpen.value = boolean(value)
}, { flush: 'sync' })
watch(isOpen, async (value) => {
  const currentVersion = ++version
  if (!value) {
    const active = document.activeElement
    const shouldRestore = restoreFocus && (!active || active === document.body || popupRef.value?.contains(active))
    removeListeners()
    if (shouldRestore && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    restoreFocus = false
    previousFocus = null
    position.value.ready = false
    dispatch('Closed')
    return
  }
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  restoreFocus = lightDismiss.value
  await nextTick()
  await new Promise<void>((complete) => requestAnimationFrame(() => complete()))
  if (currentVersion !== version || !isOpen.value) return
  synchronizeChild()
  updatePosition()
  // Apply the measured position and visibility before asking the browser to
  // focus the child. Browsers reject focus while the wrapper is hidden.
  await nextTick()
  if (currentVersion !== version || !isOpen.value) return
  resizeObserver = new ResizeObserver(schedulePosition)
  if (popupRef.value) resizeObserver.observe(popupRef.value)
  if (originRef.value?.parentElement) resizeObserver.observe(originRef.value.parentElement)
  if (placementTarget.value) resizeObserver.observe(placementTarget.value)
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('keydown', onKeyDown, true)
  window.addEventListener('resize', schedulePosition)
  window.addEventListener('scroll', schedulePosition, true)
  window.visualViewport?.addEventListener('resize', schedulePosition)
  if (lightDismiss.value && popupRef.value) {
    // Defer focus until the opening pointer sequence has finished. This is
    // equivalent to PopupRoot's post-open focus pass and prevents the button
    // that opened the popup from reclaiming focus on pointerup.
    window.setTimeout(() => {
      if (currentVersion !== version || !isOpen.value || !popupRef.value?.isConnected) return
      // A reused XAML Child can finish mounting after the Popup host. Reapply
      // visibility to the current host before the focus pass.
      updatePosition()
      popupRef.value.style.visibility = position.value.ready ? 'visible' : 'hidden'
      const focusable = popupRef.value.querySelector<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')
      ;(focusable ?? popupRef.value).focus({ preventScroll: true })
    }, 0)
  }
  dispatch('Opened')
}, { flush: 'sync', immediate: isOpen.value })
watch([horizontalOffset, verticalOffset, placementTarget, desiredPlacement, flowDirection, constrainToRoot], () => { if (isOpen.value) schedulePosition() })
onBeforeUnmount(() => {
  version += 1
  clearDelegatedShadow()
  removeListeners()
  if (restoreFocus && popupRef.value?.contains(document.activeElement) && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
})
</script>

<style>
.win-popup-origin {
  display: block;
  width: 0;
  height: 0;
  min-width: 0;
  min-height: 0;
  flex: 0 0 auto;
  justify-self: start;
  align-self: start;
  pointer-events: none;
}
.win-popup-child-storage { display: none !important; }
.win-popup-overlay { position: fixed; z-index: 2147483645; background: transparent; }
.win-popup-overlay.is-visible { background: var(--PopupLightDismissOverlayBackground, var(--SmokeFillColorDefaultBrush)); }
.win-popup-root {
  position: fixed;
  z-index: 2147483646;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  overflow: visible;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  outline: none;
}
.win-popup-root > * { max-width: 100%; box-sizing: border-box; }
.win-popup-shadow-host { position: absolute; pointer-events: none; overflow: visible; }
</style>
