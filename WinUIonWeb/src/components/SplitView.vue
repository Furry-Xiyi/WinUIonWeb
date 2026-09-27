<template>
  <div ref="root" v-bind="rootAttrs" class="win-split-view"
    :class="[attrs.class, { 'placement-right': panePlacement === 'Right' }]"
    :style="[attrs.style, rootStyle]"
    v-acrylic-brush="backgroundStyle"
    :data-display-mode="displayMode" :data-pane-placement="panePlacement"
    :data-pane-state="phase" :data-visual-state="visualState"
    :tabindex="boolValue(resolve(props.IsTabStop)) ? 0 : -1"
    :aria-disabled="enabled ? undefined : true" :inert="enabled ? undefined : true"
    @keydown="onKeyDown">
    <!-- Official PaneRoot -> Border(Pane) + lazy HCPaneBorder. -->
    <div ref="paneRoot" class="split-view-pane-root" data-template-part="PaneRoot"
      :style="paneStyle" v-acrylic-brush="paneBackgroundStyle" :aria-hidden="paneVisible ? undefined : true"
      :inert="paneVisible ? undefined : true" tabindex="-1">
      <Border class="split-view-pane-presenter"><PaneOutlet /></Border>
      <div v-if="highContrast && paneVisible" class="split-view-hc-pane-border"
        data-template-part="HCPaneBorder" aria-hidden="true" />
    </div>
    <!-- Official ContentRoot -> Border(Content) + LightDismissLayer. -->
    <div ref="contentRoot" class="split-view-content-root" data-template-part="ContentRoot" :style="contentStyle">
      <Border class="split-view-content-presenter"><ContentOutlet /></Border>
      <div v-if="lightDismissVisible" ref="lightDismissLayer"
        class="split-view-light-dismiss-layer" data-template-part="LightDismissLayer"
        :style="lightDismissStyle" aria-hidden="true"
        @pointerdown="blockDismissPointer" @pointerup="onLightDismissReleased" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Fragment, h } from 'vue'
const splitViewProperty = (name: 'pane' | 'content') => defineComponent({
  name: `SplitView.${name[0].toUpperCase()}${name.slice(1)}`,
  __splitViewProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export const SplitViewPane = splitViewProperty('pane')
export const SplitViewContent = splitViewProperty('content')
export default { Pane: SplitViewPane, Content: SplitViewContent }
</script>

<script setup lang="ts">
import {
  Comment, computed, defineComponent, Fragment, getCurrentInstance, h, isVNode,
  nextTick, onBeforeUnmount, onMounted, proxyRefs, ref, Text, useAttrs, useSlots, watch,
  type CSSProperties, type VNode
} from 'vue'
import Border from './Border.vue'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { alignment, boolValue, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ name: 'SplitView', inheritAttrs: false })
const props = defineProps({
  Pane: { type: [String, Number, Object], default: '' },
  Content: { type: [String, Number, Object], default: '' },
  IsPaneOpen: { type: [Boolean, String], default: false },
  DisplayMode: { type: String, default: 'Overlay' },
  PanePlacement: { type: String, default: 'Left' },
  OpenPaneLength: { type: [String, Number], default: '{ThemeResource SplitViewOpenPaneThemeLength}' },
  CompactPaneLength: { type: [String, Number], default: '{ThemeResource SplitViewCompactPaneThemeLength}' },
  PaneBackground: { type: [String, Object], default: '{ThemeResource SystemControlPageBackgroundChromeLowBrush}' },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  Background: { type: [String, Object], default: '' },
  Foreground: { type: [String, Object], default: '' },
  BorderBrush: { type: [String, Object], default: '{ThemeResource SystemControlForegroundTransparentBrush}' },
  BorderThickness: { type: [String, Number], default: '0,0,1,0' },
  CornerRadius: { type: [String, Number], default: '{ThemeResource SplitViewPaneRootCornerRadius}' },
  // The official template does not consume Control.Padding or these alignments.
  Padding: { type: [String, Number], default: 0 },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  IsTabStop: { type: [Boolean, String], default: true },
  IsEnabled: { type: [Boolean, String], default: true },
  IsHitTestVisible: { type: [Boolean, String], default: true },
  Opacity: { type: [String, Number], default: 1 }, Visibility: { type: String, default: 'Visible' }
})
const emit = defineEmits([
  'update:IsPaneOpen', 'update:DisplayMode', 'update:PanePlacement',
  'update:OpenPaneLength', 'update:CompactPaneLength', 'update:PaneBackground',
  'update:Background', 'update:LightDismissOverlayMode',
  'PaneOpening', 'PaneOpened', 'PaneClosing', 'PaneClosed'
])
type PanePhase = 'Closed' | 'Opening' | 'Open' | 'Closing'
type PaneClosingEventArgs = { Cancel: boolean }
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const paneRoot = ref<HTMLElement | null>(null)
const contentRoot = ref<HTMLElement | null>(null)
const lightDismissLayer = ref<HTMLElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)

// A single dependency-property-shaped value backs code-behind and XAML bindings.
const dependency = (key: keyof typeof props) => {
  const current = ref(resolve(props[key]))
  watch(() => resolve(props[key]), value => { current.value = value }, { flush: 'sync' })
  return computed({
    get: () => current.value,
    set: value => {
      current.value = resolve(value)
      updateXamlBinding(props[key], value, instance)
      emit(`update:${key}` as 'update:IsPaneOpen', value)
    }
  })
}
const IsPaneOpen = dependency('IsPaneOpen')
const DisplayMode = dependency('DisplayMode')
const PanePlacement = dependency('PanePlacement')
const OpenPaneLength = dependency('OpenPaneLength')
const CompactPaneLength = dependency('CompactPaneLength')
const PaneBackground = dependency('PaneBackground')
const Background = dependency('Background')
const backgroundStyle = useAcrylicBrushStyle(() => Background.value || 'Transparent', instance)
const paneBackgroundStyle = useAcrylicBrushStyle(() => PaneBackground.value || 'Transparent', instance)
const LightDismissOverlayMode = dependency('LightDismissOverlayMode')
const isOpen = computed(() => boolValue(IsPaneOpen.value))
const displayMode = computed(() => ['Overlay', 'Inline', 'CompactOverlay', 'CompactInline'].includes(String(DisplayMode.value)) ? String(DisplayMode.value) : 'Overlay')
const panePlacement = computed(() => PanePlacement.value === 'Right' ? 'Right' : 'Left')
const compact = computed(() => displayMode.value === 'CompactOverlay' || displayMode.value === 'CompactInline')
const overlay = computed(() => displayMode.value === 'Overlay' || displayMode.value === 'CompactOverlay')
const enabled = computed(() => boolValue(resolve(props.IsEnabled)))
const measuredPaneLength = ref(0)
const autoPaneLength = computed(() => OpenPaneLength.value === 'Auto' || (typeof OpenPaneLength.value === 'number' && Number.isNaN(OpenPaneLength.value)))
const resourceNumber = (value: unknown, fallback: number) => {
  const number = Number(value)
  if (value !== '' && value !== undefined && value !== null && Number.isFinite(number)) return Math.max(0, number)
  const marker = String(value ?? '').match(/^var\((--[^,)]+)(?:,\s*([^)]*))?\)$/)
  if (marker && root.value) {
    const resolved = Number(getComputedStyle(root.value).getPropertyValue(marker[1]).trim() || marker[2])
    if (Number.isFinite(resolved)) return Math.max(0, resolved)
  }
  return fallback
}
const openLength = computed(() => autoPaneLength.value ? measuredPaneLength.value : resourceNumber(OpenPaneLength.value, 320))
const compactLength = computed(() => resourceNumber(CompactPaneLength.value, 48))
const phase = ref<PanePhase>(isOpen.value ? 'Open' : 'Closed')
const paneVisible = computed(() => phase.value !== 'Closed' || compact.value)
const reservation = computed(() => overlay.value ? (compact.value ? compactLength.value : 0) : isOpen.value ? openLength.value : compact.value ? compactLength.value : 0)
const visualState = computed(() => isOpen.value
  ? `Open${overlay.value ? compact.value ? 'CompactOverlay' : 'Overlay' : 'Inline'}${panePlacement.value}`
  : compact.value ? `ClosedCompact${panePlacement.value}` : 'Closed')
const closedTranslate = computed(() => (panePlacement.value === 'Right' ? 1 : -1) * openLength.value)
const targetTransform = computed(() => `translateX(${!isOpen.value && !compact.value ? closedTranslate.value : 0}px)`)
const paneClip = (opened: boolean) => {
  const hidden = !opened && compact.value ? Math.max(0, openLength.value - compactLength.value) : 0
  return panePlacement.value === 'Right' ? `inset(0px 0px 0px ${hidden}px)` : `inset(0px ${hidden}px 0px 0px)`
}
const targetClip = computed(() => paneClip(isOpen.value))
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) =>
  key !== 'class' && key !== 'style' && (/^(?:data-|aria-|Grid\.|Canvas\.|RelativePanel\.)/.test(key) || ['id', 'title'].includes(key))
)))
const rootStyle = computed<CSSProperties>(() => {
  const size = `${reservation.value}px`
  const style: CSSProperties = {
    gridTemplateColumns: panePlacement.value === 'Right' ? `minmax(0, 1fr) ${size}` : `${size} minmax(0, 1fr)`,
    ...backgroundStyle.value,
    color: String(resolve(props.Foreground) || 'var(--TextFillColorPrimaryBrush)'),
    margin: xamlThickness(resolve(props.Margin)),
    justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'),
    alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'),
    pointerEvents: boolValue(resolve(props.IsHitTestVisible)) ? undefined : 'none',
    opacity: resourceNumber(resolve(props.Opacity), 1)
  }
  for (const key of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
    const value = cssLength(resolve(props[key]))
    if (value) (style as Record<string, unknown>)[key[0].toLowerCase() + key.slice(1)] = value
  }
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  return style
})
const cornerRadius = computed(() => String(resolve(props.CornerRadius) ?? 0).split(',').map(part => cssLength(part.trim())).join(' '))
const paneStyle = computed<CSSProperties>(() => ({
  width: autoPaneLength.value && !measuredPaneLength.value ? 'max-content' : `${openLength.value}px`,
  left: panePlacement.value === 'Left' ? '0' : undefined,
  right: panePlacement.value === 'Right' ? '0' : undefined,
  display: paneVisible.value || autoPaneLength.value ? 'grid' : 'none',
  visibility: !paneVisible.value && autoPaneLength.value ? 'hidden' : undefined,
  transform: targetTransform.value,
  clipPath: targetClip.value,
  ...paneBackgroundStyle.value,
  borderColor: String(resolve(props.BorderBrush) || 'transparent'),
  borderWidth: xamlThickness(resolve(props.BorderThickness)),
  borderRadius: cornerRadius.value
}))
const contentStyle = computed<CSSProperties>(() => ({ gridColumn: panePlacement.value === 'Right' ? '1' : '2' }))
const lightDismissVisible = computed(() => overlay.value && phase.value !== 'Closed')
const lightDismissStyle = computed<CSSProperties>(() => ({
  // Auto paints only on Xbox in WinUI; browser Auto therefore stays transparent.
  background: LightDismissOverlayMode.value === 'On' ? 'var(--SplitViewLightDismissOverlayBackground)' : 'transparent',
  opacity: isOpen.value ? 1 : 0
}))

const flatten = (nodes: VNode[] | VNode | null | undefined): VNode[] => (Array.isArray(nodes) ? nodes : nodes ? [nodes] : []).flatMap(node => {
  if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []
  return node.type === Fragment && Array.isArray(node.children) ? flatten(node.children as VNode[]) : [node]
})
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? flatten(node.children as VNode[])
  : flatten((node.children as { default?: () => VNode[] } | null)?.default?.() ?? [])
const propertyName = (node: VNode) => (node.type as { __splitViewProperty?: 'pane' | 'content' })?.__splitViewProperty
const nodesFor = (name: 'pane' | 'content') => {
  const nodes = flatten(slots.default?.() ?? [])
  const property = nodes.find(node => propertyName(node) === name)
  const children = property ? childrenOf(property) : name === 'content' ? nodes.filter(node => !propertyName(node)) : []
  return normalizeXamlNodes(children, instance)
}
const outlet = (name: 'pane' | 'content') => defineComponent({
  name: `SplitView${name === 'pane' ? 'Pane' : 'Content'}Outlet`,
  setup() {
    return () => {
      const nodes = nodesFor(name)
      if (nodes.length) return h(Fragment, nodes)
      const value = resolve(name === 'pane' ? props.Pane : props.Content)
      return isVNode(value) ? value : typeof value === 'string' || typeof value === 'number' ? String(value) : null
    }
  }
})
const PaneOutlet = outlet('pane')
const ContentOutlet = outlet('content')

let mounted = false
let disposed = false
let transitionToken = 0
let activeAnimations: Animation[] = []
let completionTimer: ReturnType<typeof setTimeout> | undefined
let previousFocus: HTMLElement | null = null
let lightDismissPending = false
let closingEventRaised = false
let activeReservation = reservation.value
let resizeObserver: ResizeObserver | undefined
let priorSize: { width: number; height: number } | undefined
let outerDismissPointer: number | null = null
let outerDismissClickTimer: ReturnType<typeof setTimeout> | undefined
const highContrast = ref(false)
let contrastQuery: MediaQueryList | undefined
const updateContrast = () => { highContrast.value = contrastQuery?.matches ?? false }

const raise = (name: 'PaneOpening' | 'PaneOpened' | 'PaneClosing' | 'PaneClosed', args: PaneClosingEventArgs | null = null) => {
  emit(name, sender, args)
  resolveXamlHandler(attrs[name], instance)?.(sender, args)
}
const clearAnimations = () => {
  activeAnimations.forEach(animation => animation.cancel())
  activeAnimations = []
  if (completionTimer !== undefined) clearTimeout(completionTimer)
  completionTimer = undefined
}
const focusablePaneChildren = () => Array.from(paneRoot.value?.querySelectorAll<HTMLElement>(
  'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
) ?? []).filter(element => !element.hasAttribute('disabled') && !element.closest('[inert]') && element.getClientRects().length)
const restoreFocus = () => {
  if (!previousFocus) return
  const target = previousFocus.isConnected ? previousFocus
    : contentRoot.value?.querySelector<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
  previousFocus = null
  target?.focus({ preventScroll: true })
}
const finishTransition = (token: number) => {
  if (token !== transitionToken || disposed) return
  clearAnimations()
  const wasTransitioning = phase.value === 'Opening' || phase.value === 'Closing'
  phase.value = isOpen.value ? 'Open' : 'Closed'
  if (!isOpen.value) lightDismissPending = false
  if (wasTransitioning) raise(isOpen.value ? 'PaneOpened' : 'PaneClosed')
}
const animatePart = (element: HTMLElement | null, frames: Keyframe[], duration: number, easing: string) => {
  if (!element?.animate) return
  activeAnimations.push(element.animate(frames, { duration, easing, fill: 'both' }))
}
const beginTransition = async (opened: boolean, wasOpen: boolean) => {
  const token = ++transitionToken
  const currentPane = paneRoot.value ? getComputedStyle(paneRoot.value) : null
  const currentContent = contentRoot.value ? getComputedStyle(contentRoot.value).transform : 'none'
  // Read animated values before cancellation to preserve rapid reversals.
  // A collapsed PaneRoot has no computed transform even though its closed
  // visual state is translated outside the control. Use that explicit state
  // when opening; animating from `none` would leave Overlay at its end position.
  const startTransform = currentPane && currentPane.display !== 'none'
    ? currentPane.transform
    : `translateX(${wasOpen || compact.value ? 0 : closedTranslate.value}px)`
  const startClip = currentPane?.clipPath || paneClip(wasOpen)
  const startOpacity = lightDismissLayer.value ? getComputedStyle(lightDismissLayer.value).opacity : wasOpen ? '1' : '0'
  const oldReservation = activeReservation
  activeReservation = reservation.value
  clearAnimations()
  phase.value = opened ? 'Opening' : 'Closing'
  if (opened) {
    lightDismissPending = false
    raise('PaneOpening')
    if (token !== transitionToken) return
    if (overlay.value) previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  } else {
    if (!closingEventRaised) raise('PaneClosing', { Cancel: false })
    closingEventRaised = false
    if (token !== transitionToken) return
    if (overlay.value) restoreFocus()
  }
  await nextTick()
  if (token !== transitionToken || disposed) return
  if (opened && overlay.value) (focusablePaneChildren()[0] ?? paneRoot.value)?.focus({ preventScroll: true })
  // Durations and splines directly transcribe the official VisualTransitions.
  const duration = overlay.value ? opened ? 350 : 120
    : compact.value && !opened && panePlacement.value === 'Left' ? 200 : opened ? 200 : 100
  const easing = overlay.value ? 'cubic-bezier(0.1, 0.9, 0.2, 1)' : 'cubic-bezier(0, 0.35, 0.15, 1)'
  animatePart(paneRoot.value, [
    { transform: startTransform, clipPath: startClip },
    { transform: targetTransform.value, clipPath: targetClip.value }
  ], duration, easing)
  if (!overlay.value) {
    // Allocate final columns once, then animate only ContentTransform.
    const delta = (panePlacement.value === 'Right' ? 1 : -1) * (activeReservation - oldReservation)
    const priorTranslate = currentContent && currentContent !== 'none' ? Number(currentContent.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),/)?.[1] || 0) : 0
    // The compact-right reference storyboards animate the pane clip only.
    const contentOffset = compact.value && panePlacement.value === 'Right' ? 0 : priorTranslate + delta
    animatePart(contentRoot.value, [{ transform: `translateX(${contentOffset}px)` }, { transform: 'translateX(0px)' }], opened ? 199.99 : duration, easing)
  }
  if (overlay.value) animatePart(lightDismissLayer.value, [{ opacity: Number(startOpacity) }, { opacity: opened ? 1 : 0 }], duration, easing)
  if (activeAnimations.length) {
    // The browser assigns the animation's start time on a rendered frame.
    // Follow its completion instead of canceling a short storyboard with a
    // wall-clock timer that may expire before playback has actually started.
    void Promise.all(activeAnimations.map(animation => animation.finished)).then(
      () => finishTransition(token),
      () => { /* A reversal or unmount cancels the superseded storyboard. */ }
    )
  } else {
    completionTimer = setTimeout(() => finishTransition(token), duration)
  }
}
watch(isOpen, (opened, wasOpen) => {
  if (!mounted) { phase.value = opened ? 'Open' : 'Closed'; return }
  void beginTransition(opened, wasOpen)
}, { flush: 'sync' })

const requestLightDismiss = () => {
  if (!isOpen.value || !overlay.value || lightDismissPending || !enabled.value) return
  lightDismissPending = true
  const args: PaneClosingEventArgs = { Cancel: false }
  raise('PaneClosing', args)
  // Official deferred UI-thread close inspects Cancel after event dispatch.
  queueMicrotask(() => {
    if (disposed) return
    if (args.Cancel || !isOpen.value) { lightDismissPending = false; return }
    closingEventRaised = true
    IsPaneOpen.value = false
  })
}
const blockDismissPointer = (event: Event) => { event.preventDefault(); event.stopPropagation() }
const onLightDismissReleased = (event: PointerEvent) => {
  blockDismissPointer(event)
  if (event.isPrimary && event.button === 0) requestLightDismiss()
}
const clearOuterDismissGesture = () => {
  outerDismissPointer = null
  if (outerDismissClickTimer !== undefined) clearTimeout(outerDismissClickTimer)
  outerDismissClickTimer = undefined
  document.removeEventListener('pointerdown', onOuterDismissPressed, true)
  document.removeEventListener('pointerup', onOuterDismissReleased, true)
  document.removeEventListener('pointercancel', onOuterDismissCanceled, true)
  document.removeEventListener('click', onOuterDismissClick, true)
  window.removeEventListener('blur', clearOuterDismissGesture)
}
const consumeOuterDismissEvent = (event: Event) => {
  blockDismissPointer(event)
  event.stopImmediatePropagation()
}
const onOuterDismissPressed = (event: PointerEvent) => {
  if (event.isPrimary) clearOuterDismissGesture()
}
const onOuterDismissReleased = (event: PointerEvent) => {
  if (event.pointerId !== outerDismissPointer) return
  consumeOuterDismissEvent(event)
  // Click still arrives after preventing PointerPressed. Keep the gesture
  // owned by the dismiss layer through click; the next press clears it.
  outerDismissClickTimer = setTimeout(clearOuterDismissGesture, 500)
}
const onOuterDismissCanceled = (event: PointerEvent) => {
  if (event.pointerId !== outerDismissPointer) return
  consumeOuterDismissEvent(event)
  clearOuterDismissGesture()
}
const onOuterDismissClick = (event: MouseEvent) => {
  if (outerDismissPointer === null || event.detail === 0) return
  if (event instanceof PointerEvent && event.pointerId !== outerDismissPointer) return
  consumeOuterDismissEvent(event)
  clearOuterDismissGesture()
}
const onOuterPointerPressed = (event: PointerEvent) => {
  if (!enabled.value || !isOpen.value || !overlay.value || !root.value || root.value.contains(event.target as Node)) return
  if (!event.isPrimary || event.button !== 0) return
  clearOuterDismissGesture()
  outerDismissPointer = event.pointerId
  // WinUI's surrounding popup receives the whole pointer gesture. Consume
  // its release and click after TwoWay closes the pane so the underlying
  // toggle cannot immediately open it again.
  document.addEventListener('pointerdown', onOuterDismissPressed, true)
  document.addEventListener('pointerup', onOuterDismissReleased, true)
  document.addEventListener('pointercancel', onOuterDismissCanceled, true)
  document.addEventListener('click', onOuterDismissClick, true)
  window.addEventListener('blur', clearOuterDismissGesture)
  consumeOuterDismissEvent(event)
  requestLightDismiss()
}
const onRootChanged = () => requestLightDismiss()
const onKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || !isOpen.value || !overlay.value) return
  if (event.key === 'Escape') { blockDismissPointer(event); requestLightDismiss(); return }
  if (event.key !== 'Tab' || !paneRoot.value?.contains(document.activeElement)) return
  const children = focusablePaneChildren()
  const first = children[0]
  const last = children[children.length - 1]
  if (!first) { event.preventDefault(); paneRoot.value?.focus({ preventScroll: true }); return }
  if (document.activeElement === paneRoot.value || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
    event.preventDefault()
    ;(event.shiftKey ? last : first)?.focus({ preventScroll: true })
  }
}
watch([displayMode, panePlacement, openLength, compactLength], (next, previous) => {
  if (next[0] !== previous[0]) restoreFocus()
  activeReservation = reservation.value
  // Reference length changes refresh animation bindings without transitions.
  finishTransition(transitionToken)
})
watch([isOpen, overlay], ([opened, isOverlay]) => {
  if (typeof document === 'undefined') return
  if (opened && isOverlay) document.addEventListener('pointerdown', onOuterPointerPressed, true)
  else document.removeEventListener('pointerdown', onOuterPointerPressed, true)
}, { immediate: true })
onMounted(() => {
  mounted = true
  contrastQuery = window.matchMedia('(forced-colors: active)')
  updateContrast()
  contrastQuery.addEventListener('change', updateContrast)
  window.addEventListener('resize', onRootChanged)
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(entries => {
      const bounds = entries.find(entry => entry.target === root.value)?.contentRect
      if (bounds) {
        if (priorSize && (priorSize.width !== bounds.width || priorSize.height !== bounds.height)) requestLightDismiss()
        priorSize = { width: bounds.width, height: bounds.height }
      }
      if (autoPaneLength.value && paneRoot.value) {
        const presenter = [...paneRoot.value.children].find(child => !child.classList.contains('win-acrylic-visual')) as HTMLElement | undefined
        const child = presenter && [...presenter.children].find(child => !child.classList.contains('win-acrylic-visual')) as HTMLElement | undefined
        measuredPaneLength.value = child?.scrollWidth || presenter?.scrollWidth || 0
      }
    })
    resizeObserver.observe(root.value)
    if (paneRoot.value) resizeObserver.observe(paneRoot.value)
  }
})
onBeforeUnmount(() => {
  disposed = true
  transitionToken += 1
  clearAnimations()
  clearOuterDismissGesture()
  resizeObserver?.disconnect()
  contrastQuery?.removeEventListener('change', updateContrast)
  window.removeEventListener('resize', onRootChanged)
  document.removeEventListener('pointerdown', onOuterPointerPressed, true)
})

const TemplateSettings = computed(() => ({
  OpenPaneLength: openLength.value, NegativeOpenPaneLength: -openLength.value,
  OpenPaneLengthMinusCompactLength: openLength.value - compactLength.value,
  NegativeOpenPaneLengthMinusCompactLength: compactLength.value - openLength.value,
  OpenPaneGridLength: openLength.value, CompactPaneGridLength: compactLength.value
}))
const publicApi = {
  IsPaneOpen, DisplayMode, PanePlacement, OpenPaneLength, CompactPaneLength,
  PaneBackground, Background, LightDismissOverlayMode, TemplateSettings
}
const sender = proxyRefs(publicApi)
defineExpose(publicApi)
</script>

<style>
.win-split-view {
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
}
.split-view-pane-root {
  position: absolute;
  inset-block: 0;
  z-index: 1;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  border-style: solid;
  overflow: hidden;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  transition: background-color 200ms linear;
}
.split-view-pane-root:focus { outline: none; }
.split-view-pane-presenter,
.split-view-content-presenter { min-width: 0; min-height: 0; width: 100%; height: 100%; }
.split-view-content-root {
  position: relative;
  display: grid;
  grid-row: 1;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.split-view-light-dismiss-layer { position: absolute; inset: 0; }
.split-view-hc-pane-border {
  position: absolute;
  inset-block: 0;
  right: 0;
  width: 1px;
  background: var(--SystemControlForegroundTransparentBrush);
  pointer-events: none;
}
.placement-right .split-view-hc-pane-border { left: 0; right: auto; }
@media (forced-colors: active) {
  .split-view-hc-pane-border { background: CanvasText; forced-color-adjust: none; }
}
</style>
