<template>
  <Teleport :to="teleportTarget">
    <div :id="tooltipId" ref="tooltipRef"
      v-acrylic-brush="backgroundStyle"
      v-theme-shadow="{ Translation: 16, Enabled: present }"
      :class="[present ? 'tooltip win-tooltip LayoutRoot' : 'tooltip-content-cache', themeClass]"
      :style="[tooltipStyle, { display: present ? 'flex' : 'none' }]" :data-placement="actualPlacement"
      :role="present ? 'tooltip' : undefined" :aria-hidden="!isVisible || undefined" :aria-description="fullDescription || undefined">
      <div class="tooltip-content-clip">
        <ContentOutlet v-if="contentNodes.length || hasContentTemplate || hasVisualContent" />
        <TextBlock v-else Text="{x:Bind ToolTipText}" TextWrapping="WrapWholeWords" />
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts">
import { ToolTipContent, ToolTipContentTemplate, ToolTipContentTransitions } from './ToolTipServiceProperties'
export default { Content: ToolTipContent, ContentTemplate: ToolTipContentTemplate, ContentTransitions: ToolTipContentTransitions }
</script>
<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, unref, useAttrs, useSlots, watch, type Component, type CSSProperties, type Ref, type VNode } from 'vue'
import TextBlock from './TextBlock.vue'
import { boolValue, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlColor, xamlScopeKey, xamlTemplateComponent } from './xamlRuntime'
import { isToolTipContentProperty } from './ToolTipServiceProperties'
import { registerToolTip, toolTipOwnerContextKey, type ToolTipController, type ToolTipInputMode, type ToolTipPoint } from './toolTipRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { vThemeShadow } from './themeShadowVisual'
import { xamlThemeKey } from './brushCore'

defineOptions({ name: 'ToolTip', inheritAttrs: false })
const props = defineProps({
  Content: { type: [String, Number, Object], default: '' },
  ContentTemplate: { type: [String, Object, Function], default: null },
  ContentTransitions: { type: [String, Object, Array], default: null },
  IsOpen: { type: [Boolean, String], default: false },
  IsEnabled: { type: [Boolean, String], default: true },
  Placement: { type: String, default: 'Top' },
  PlacementTarget: { type: [Object, String], default: null },
  PlacementRect: { type: [Object, String], default: null },
  HorizontalOffset: { type: [String, Number], default: undefined },
  VerticalOffset: { type: [String, Number], default: undefined },
  Background: { type: [String, Object], default: '{ThemeResource ToolTipBackgroundBrush}' },
  Foreground: { type: [String, Object], default: '{ThemeResource ToolTipForegroundBrush}' },
  BorderBrush: { type: [String, Object], default: '{ThemeResource ToolTipBorderBrush}' },
  BorderThickness: { type: [String, Number], default: 1 },
  Padding: { type: [String, Number], default: '9,6,9,8' },
  FontFamily: { type: String, default: '{ThemeResource ContentControlThemeFontFamily}' },
  FontSize: { type: [String, Number], default: 12 },
  MaxWidth: { type: [String, Number], default: 320 },
  MaxHeight: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  BackgroundSizing: { type: String, default: 'InnerBorderEdge' },
  HorizontalContentAlignment: { type: String, default: 'Left' },
  VerticalContentAlignment: { type: String, default: 'Top' },
  RequestedTheme: { type: String, default: 'Default' }
})
const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const ownerContext = inject(toolTipOwnerContextKey, null)
const inheritedXamlScope = inject<Record<string, unknown>>(xamlScopeKey, {})
const inheritedTheme = inject<string | Ref<string> | null>('winuiTheme', null)
const pageResources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const tooltipRef = ref<HTMLElement | null>(null)
const tooltipId = `tooltip-${instance?.uid ?? Math.random().toString(36).slice(2)}`
const present = ref(false), positioned = ref(false)
const position = ref({ top: 0, left: 0 })
const bounds = ref({ width: 320, height: 10000 })
const actualPlacement = ref('Top')
const teleportTarget = ref<HTMLElement | string>('body')
const localIsOpen = ref<boolean>()
const automaticInput = ref<ToolTipInputMode>('none')
const pointer = ref<ToolTipPoint | null>(null), automaticTheme = ref('')
const value = (input: unknown) => resolveXamlValue(input, instance)
const isEnabled = computed(() => boolValue(value(props.IsEnabled)))
const boundIsOpen = computed(() => boolValue(value(props.IsOpen)))
const isVisible = computed(() => isEnabled.value && (localIsOpen.value ?? boundIsOpen.value))
const content = computed(() => value(props.Content))
const ToolTipText = computed(() => {
  const current = content.value
  if (current === undefined || current === null) return ''
  if (typeof current === 'object') return String((current as { Content?: unknown }).Content ?? '')
  return String(current)
})
provide(xamlScopeKey, { ...inheritedXamlScope, ToolTipText })
const propertyNodes = computed(() => slots.default?.() ?? [])
const contentNodes = computed(() => propertyNodes.value.flatMap(node => {
  if ((node.type as { __toolTipProperty?: string })?.__toolTipProperty) return []
  if (!isToolTipContentProperty(node)) return [node]
  return (node.children as { default?: () => ReturnType<NonNullable<typeof slots.default>> } | null)?.default?.() ?? []
}))
const templateNodes = computed(() => propertyNodes.value.flatMap(node => (node.type as { __toolTipProperty?: string })?.__toolTipProperty === 'ContentTemplate'
  ? (node.children as { default?: () => VNode[] })?.default?.() ?? [] : []))
const contentTemplate = computed(() => {
  const input = props.ContentTemplate
  const key = typeof input === 'string' ? input.match(/^\{(?:StaticResource|ThemeResource)\s+([^\s}]+)\}$/)?.[1] ?? input.match(/^var\(--([^,)]+)\)$/)?.[1] : undefined
  return key ? resolveXamlResourceObject(key, instance) ?? pageResources?.[key] : value(input)
})
const hasContentTemplate = computed(() => Boolean(templateNodes.value.length || contentTemplate.value))
const isComponent = (input: unknown) => input && typeof input === 'object' && ('render' in input || 'setup' in input)
const hasVisualContent = computed(() => isVNode(content.value) || Boolean(isComponent(content.value)))
const unwrapTemplate = (nodes: VNode[]) => nodes.flatMap(node => (node.type as { name?: string })?.name === 'DataTemplate'
  ? (node.children as { default?: () => VNode[] })?.default?.() ?? [] : [node])
const ContentOutlet = defineComponent({ setup: () => () => {
  if (templateNodes.value.length) return xamlTemplateComponent(unwrapTemplate(templateNodes.value), content.value, instance)
  const template = contentTemplate.value
  if (typeof template === 'function') return template(content.value)
  if (isVNode(template)) return xamlTemplateComponent(unwrapTemplate([template]), content.value, instance)
  if (isComponent(template)) return h(template as Component, { Content: content.value })
  if (isVNode(content.value)) return h(Fragment, normalizeXamlNodes([content.value], instance))
  if (isComponent(content.value)) return h(content.value as Component)
  return h(Fragment, normalizeXamlNodes(contentNodes.value, instance))
} })
const fullDescription = computed(() => String(value(attrs['AutomationProperties.FullDescription']) ?? ''))
const effectiveTheme = computed(() => {
  const explicit = String(value(props.RequestedTheme)).toLowerCase()
  if (explicit === 'light' || explicit === 'dark') return explicit
  return String(ownerContext?.theme.value || automaticTheme.value || unref(inheritedTheme) || '').toLowerCase()
})
const themeClass = computed(() => ['light', 'dark'].includes(effectiveTheme.value) ? `win-theme-scope theme-${effectiveTheme.value}` : '')
provide(xamlThemeKey, effectiveTheme)
provide('winuiTheme', effectiveTheme)
const brush = (input: unknown) => {
  const result = value(input)
  return xamlColor(result && typeof result === 'object' ? (result as { Color?: unknown }).Color : result) as string | undefined
}
const backgroundStyle = useAcrylicBrushStyle(() => props.Background, instance)
const contentAlignment = (input: unknown) => ({ Left: 'flex-start', Top: 'flex-start', Center: 'center', Right: 'flex-end', Bottom: 'flex-end', Stretch: 'stretch' }[String(value(input))] ?? 'flex-start')
const tooltipStyle = computed<CSSProperties>(() => ({
  // Keep the Teleport popup in viewport coordinates. The acrylic visual
  // directive adds an internal composition layer and must not turn this
  // window-positioned element into a flow-relative host.
  position: 'fixed', top: `${position.value.top}px`, left: `${position.value.left}px`, visibility: positioned.value ? 'visible' : 'hidden',
  ...backgroundStyle.value, color: brush(props.Foreground), borderColor: brush(props.BorderBrush),
  borderWidth: xamlThickness(value(props.BorderThickness)), padding: xamlThickness(value(props.Padding)),
  fontFamily: String(value(props.FontFamily)), fontSize: cssLength(value(props.FontSize)),
  width: cssLength(value(props.Width)) || undefined, height: cssLength(value(props.Height)) || undefined,
  maxWidth: `min(${cssLength(value(props.MaxWidth)) || '320px'}, ${bounds.value.width}px)`,
  maxHeight: props.MaxHeight ? `min(${cssLength(value(props.MaxHeight))}, ${bounds.value.height}px)` : `${bounds.value.height}px`,
  borderRadius: cssLength(value(props.CornerRadius)), alignItems: contentAlignment(props.VerticalContentAlignment),
  justifyContent: contentAlignment(props.HorizontalContentAlignment),
  backgroundClip: value(props.BackgroundSizing) === 'InnerBorderEdge' ? 'padding-box' : 'border-box'
} as CSSProperties))
function elementFrom(input: unknown): HTMLElement | null {
  const candidate = unref(input)
  if (candidate instanceof HTMLElement) return candidate
  if (typeof candidate === 'string') {
    const named = document.querySelector<HTMLElement>(`[data-xaml-ref="${CSS.escape(candidate)}"]`)
    if (named) return named
    try { return document.querySelector<HTMLElement>(candidate) } catch { return null }
  }
  if (candidate && typeof candidate === 'object') {
    const record = candidate as { Element?: unknown; $el?: unknown; value?: unknown }
    for (const entry of [record.Element, record.$el, record.value]) {
      if (entry !== undefined && entry !== candidate) { const result = elementFrom(entry); if (result) return result }
    }
  }
  return null
}
function targetElement() {
  const owner = ownerContext?.owner.value ?? null
  return elementFrom(owner?.getAttribute('tooltipservice.placementtarget')) ?? elementFrom(value(props.PlacementTarget)) ?? owner
}
function placementRect(target: HTMLElement) {
  const input = value(props.PlacementRect)
  if (!input) return null
  const values = typeof input === 'string' ? input.split(',').map(Number) : null
  const record = typeof input === 'object' ? input as Record<string, number> : null
  if (values && (values.length !== 4 || values.some(number => !Number.isFinite(number)))) return null
  const x = values ? values[0] : Number(record?.X ?? record?.x ?? 0), y = values ? values[1] : Number(record?.Y ?? record?.y ?? 0)
  const width = values ? values[2] : Number(record?.Width ?? record?.width ?? 0), height = values ? values[3] : Number(record?.Height ?? record?.height ?? 0)
  if (!(width > 0 && height > 0)) return null
  const rect = target.getBoundingClientRect()
  // Compose target and ancestor 2D transforms. Layout translations and
  // transform origins are recovered from the target's measured bounding box.
  // This is TransformBounds: transform all four local rectangle corners.
  let matrix = new DOMMatrix()
  let current: HTMLElement | null = target
  let is2D = true
  while (current) {
    const style = getComputedStyle(current)
    const transform = style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform)
    if (!transform.is2D) { is2D = false; break }
    const zoom = Number(style.zoom) || 1
    matrix = new DOMMatrix([transform.a * zoom, transform.b * zoom, transform.c * zoom, transform.d * zoom, 0, 0]).multiply(matrix)
    current = current.parentElement
  }
  const corners = (left: number, top: number, localWidth: number, localHeight: number) =>
    [[left, top], [left + localWidth, top], [left + localWidth, top + localHeight], [left, top + localHeight]]
      .map(([localX, localY]) => matrix.transformPoint(new DOMPoint(localX, localY)))
  if (is2D && target.offsetWidth > 0 && target.offsetHeight > 0) {
    const ownerCorners = corners(0, 0, target.offsetWidth, target.offsetHeight)
    const offsetX = rect.left - Math.min(...ownerCorners.map(corner => corner.x))
    const offsetY = rect.top - Math.min(...ownerCorners.map(corner => corner.y))
    const transformed = corners(x, y, width, height)
    return { left: offsetX + Math.min(...transformed.map(corner => corner.x)), top: offsetY + Math.min(...transformed.map(corner => corner.y)), right: offsetX + Math.max(...transformed.map(corner => corner.x)), bottom: offsetY + Math.max(...transformed.map(corner => corner.y)) }
  }
  const scaleX = target.offsetWidth > 0 ? rect.width / target.offsetWidth : 1
  const scaleY = target.offsetHeight > 0 ? rect.height / target.offsetHeight : 1
  return { left: rect.left + x * scaleX, top: rect.top + y * scaleY, right: rect.left + (x + width) * scaleX, bottom: rect.top + (y + height) * scaleY }
}
function viewportBounds() {
  const viewport = window.visualViewport
  // Native windowed ToolTips use the available monitor; their unwindowed path
  // uses the XAML content window. A web popup uses the visible browser viewport,
  // independently of the owner, ScrollViewer and Gallery example bounds.
  return { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0, right: (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth), bottom: (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight) }
}
const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), number))
async function updatePosition() {
  await nextTick()
  const tip = tooltipRef.value, target = targetElement()
  if (!tip || !target || !target.isConnected) return
  syncTheme()
  const available = viewportBounds()
  const width = Math.max(0, available.right - available.left), height = Math.max(0, available.bottom - available.top)
  if (bounds.value.width !== width || bounds.value.height !== height) { bounds.value = { width, height }; await nextTick() }
  const tipRect = tip.getBoundingClientRect()
  const mode = ownerContext?.inputMode.value ?? automaticInput.value, point = ownerContext?.point.value ?? pointer.value
  const requested = ownerContext?.owner.value?.getAttribute('tooltipservice.placement') || String(value(props.Placement))
  const placement = ['Top', 'Bottom', 'Left', 'Right', 'Mouse'].includes(requested) ? requested : 'Top'
  const pointerRect = point && (mode === 'mouse' || mode === 'touch')
    ? { left: point.x, right: point.x, top: point.y + (mode === 'touch' ? -5 : 0), bottom: point.y + (mode === 'touch' ? -5 : 0) } : null
  const docking = placementRect(target) ?? pointerRect ?? target.getBoundingClientRect()
  const defaultOffset = mode === 'mouse' ? 20 : mode === 'touch' ? 44 : mode === 'keyboard' ? 12 : 0
  const horizontalOffset = props.HorizontalOffset === undefined ? defaultOffset : Number(value(props.HorizontalOffset)) || 0
  const verticalOffset = props.VerticalOffset === undefined ? defaultOffset : Number(value(props.VerticalOffset)) || 0
  const rtl = getComputedStyle(target).direction === 'rtl'
  const centerX = (docking.left + docking.right - tipRect.width) / 2, centerY = (docking.top + docking.bottom - tipRect.height) / 2
  const candidates = {
    Top: { left: centerX, top: docking.top - verticalOffset - tipRect.height },
    Bottom: { left: centerX, top: docking.bottom + verticalOffset },
    Left: { left: docking.left - horizontalOffset - tipRect.width, top: centerY },
    Right: { left: docking.right + horizontalOffset, top: centerY }
  }
  let chosen: keyof typeof candidates = placement === 'Mouse' ? 'Top' : placement as keyof typeof candidates
  let result: { left: number; top: number }
  if (placement === 'Mouse' && point && mode !== 'keyboard') {
    result = { left: rtl ? point.x - tipRect.width : point.x + (Number(value(props.HorizontalOffset)) || 0), top: point.y + 11 + (Number(value(props.VerticalOffset)) || 0) }
  } else {
    if (rtl && (chosen === 'Right' || chosen === 'Left')) chosen = chosen === 'Right' ? 'Left' : 'Right'
    // QueryRelativePosition: preferred, opposite, then the two other sides.
    // Browsers do not expose SPI_GETMENUDROPALIGNMENT; use the native fallback
    // preference (Right before Left) for vertical placement.
    const orders = { Top: ['Top', 'Bottom', 'Right', 'Left'], Bottom: ['Bottom', 'Top', 'Right', 'Left'], Left: ['Left', 'Right', 'Top', 'Bottom'], Right: ['Right', 'Left', 'Top', 'Bottom'] } as const
    const fits = (side: keyof typeof candidates) => {
      const candidate = candidates[side]
      return side === 'Top' || side === 'Bottom'
        ? tipRect.width <= width && candidate.top >= available.top && candidate.top + tipRect.height <= available.bottom
        : tipRect.height <= height && candidate.left >= available.left && candidate.left + tipRect.width <= available.right
    }
    chosen = orders[chosen].find(fits) ?? chosen
    result = candidates[chosen]
  }
  position.value = { left: clamp(result.left, available.left, available.right - tipRect.width), top: clamp(result.top, available.top, available.bottom - tipRect.height) }
  actualPlacement.value = placement === 'Mouse' && mode !== 'keyboard' ? 'Mouse' : chosen
  positioned.value = true
}
let animation: Animation | null = null, transitionSequence = 0, openTimer: number | undefined
let resizeObserver: ResizeObserver | null = null, unregister: (() => void) | undefined
function setOpen(open: boolean) { localIsOpen.value = open; updateXamlBinding(props.IsOpen, open, instance); emit('update:IsOpen', open) }
function show(immediate = true) {
  window.clearTimeout(openTimer)
  if (!isEnabled.value || (!ToolTipText.value && !contentNodes.value.length && !hasContentTemplate.value && !hasVisualContent.value)) return
  if (immediate) setOpen(true)
  else openTimer = window.setTimeout(() => setOpen(true), 800)
}
function hide() { window.clearTimeout(openTimer); setOpen(false) }
function raise(event: 'Opened' | 'Closed') {
  const sender = instance?.exposeProxy ?? instance?.proxy
  emit(event, sender, {}); resolveXamlHandler(attrs[event], instance)?.(sender, {})
}
function syncTheme() {
  const scope = targetElement()?.closest('.theme-light, .theme-dark')
  automaticTheme.value = scope?.classList.contains('theme-dark') ? 'dark' : scope?.classList.contains('theme-light') ? 'light' : ''
  if (ownerContext) ownerContext.theme.value = automaticTheme.value
}
async function changeVisibility(open: boolean) {
  const sequence = ++transitionSequence, opacity = present.value && tooltipRef.value ? getComputedStyle(tooltipRef.value).opacity : '0'
  animation?.cancel(); animation = null
  if (open) {
    present.value = true; positioned.value = false; syncTheme(); await updatePosition()
    if (sequence !== transitionSequence || !isVisible.value) return
  }
  const element = tooltipRef.value
  if (!element) return
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 167
  animation = element.animate([{ opacity }, { opacity: open ? 1 : 0 }], { duration, easing: 'linear', fill: 'forwards' })
  try { await animation.finished } catch { return }
  if (sequence !== transitionSequence) return
  element.style.opacity = open ? '1' : '0'; animation.cancel(); animation = null
  if (!open) { present.value = false; positioned.value = false }
  raise(open ? 'Opened' : 'Closed')
}
watch(boundIsOpen, () => { localIsOpen.value = undefined })
watch(isVisible, changeVisibility, { immediate: true })
watch([content, hasContentTemplate, () => props.Placement, () => props.PlacementRect, () => props.PlacementTarget, () => props.HorizontalOffset, () => props.VerticalOffset], () => { if (present.value) void updatePosition() }, { deep: true })
watch([() => unref(inheritedTheme), () => value(props.RequestedTheme)], () => { if (present.value) void updatePosition() }, { flush: 'post' })
const controller: ToolTipController = {
  Open(mode, point) {
    automaticInput.value = mode; pointer.value = point ?? null
    if (ownerContext) { ownerContext.inputMode.value = mode; ownerContext.point.value = point ?? null }
    syncTheme(); show()
  }, Close: hide, IsOpen: () => isVisible.value, IsEnabled: () => isEnabled.value && Boolean(ToolTipText.value || contentNodes.value.length || hasContentTemplate.value || hasVisualContent.value),
  Element: () => tooltipRef.value, UpdatePosition: updatePosition
}
watch(() => ownerContext?.owner.value, owner => {
  unregister?.(); unregister = owner && ownerContext?.attached !== false ? registerToolTip(owner, controller) : undefined
  if (owner) syncTheme()
}, { immediate: true, flush: 'post' })
function onViewportChanged() { if (present.value) { syncTheme(); void updatePosition() } }
function onFullscreenChanged() { teleportTarget.value = document.fullscreenElement as HTMLElement || 'body'; onViewportChanged() }
function observeLayout() {
  resizeObserver?.disconnect()
  const target = targetElement()
  if (target) resizeObserver?.observe(target)
  if (tooltipRef.value) resizeObserver?.observe(tooltipRef.value)
}
watch([tooltipRef, () => ownerContext?.owner.value, () => props.PlacementTarget], observeLayout, { flush: 'post' })
onMounted(() => {
  teleportTarget.value = document.fullscreenElement as HTMLElement || 'body'
  window.addEventListener('resize', onViewportChanged); window.addEventListener('scroll', onViewportChanged, true)
  window.visualViewport?.addEventListener('resize', onViewportChanged); window.visualViewport?.addEventListener('scroll', onViewportChanged)
  document.addEventListener('fullscreenchange', onFullscreenChanged)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onViewportChanged)
    observeLayout()
  }
  if (isVisible.value) void updatePosition()
})
onBeforeUnmount(() => {
  transitionSequence += 1; window.clearTimeout(openTimer); animation?.cancel(); unregister?.(); resizeObserver?.disconnect()
  window.removeEventListener('resize', onViewportChanged); window.removeEventListener('scroll', onViewportChanged, true)
  window.visualViewport?.removeEventListener('resize', onViewportChanged); window.visualViewport?.removeEventListener('scroll', onViewportChanged)
  document.removeEventListener('fullscreenchange', onFullscreenChanged)
})
defineExpose({ Controller: controller, IsOpen: computed({ get: () => isVisible.value, set: setOpen }), TemplateSettings: { FromHorizontalOffset: 0, FromVerticalOffset: 0 }, show, hide, updatePosition })
</script>
<style>
.tooltip.win-tooltip {
  position: fixed; display: flex; width: max-content; min-width: 0; box-sizing: border-box;
  overflow: visible; overflow-wrap: anywhere; color: var(--ToolTipForegroundBrush, var(--text-primary));
  border: 1px solid var(--ToolTipBorderBrush); border-radius: var(--ControlCornerRadius, 4px);
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 12px; line-height: 16px; opacity: 0; pointer-events: auto; isolation: isolate;
}
.tooltip.win-tooltip .win-text-block { min-width: 0; max-width: 100%; color: inherit; font-size: inherit; line-height: inherit; overflow-wrap: inherit; }
.tooltip.win-tooltip > :not(.win-theme-shadow-visual) { max-width: 100%; max-height: 100%; }
.tooltip-content-clip { display: flex; min-width: 0; overflow: hidden; border-radius: inherit; align-items: inherit; justify-content: inherit; }
@media (forced-colors: active) {
  .tooltip.win-tooltip { color: CanvasText; border-color: CanvasText; }
}
</style>
