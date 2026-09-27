<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-selector-bar-item" :class="[preparePropertyElements(), stateClasses]"
    :style="[attrs.style, rootStyle]" role="option" :tabindex="tabIndex"
    :aria-selected="isSelected" :aria-disabled="!isEnabled || undefined"
    @pointerenter="pointerOver = true" @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="cancelPointer"
    @lostpointercapture="cancelPointer" @click="onClick" @keydown="onKeyDown" @focus="onFocus">
    <div class="win-selector-bar-item-container-root" data-template-part="PART_ContainerRoot" :style="chromeStyle">
      <ChildOutlet />
      <div v-if="hasIcon || hasText" class="win-selector-bar-item-content" :style="contentStyle">
        <span v-if="hasIcon" class="win-selector-bar-item-icon" data-template-part="PART_IconVisual" :style="{ color: foreground }"><IconOutlet /></span>
        <TextBlock v-if="hasText" class="win-selector-bar-item-text" data-template-part="PART_TextVisual"
          Text="{x:Bind TemplateText}" Foreground="{x:Bind TemplateForeground}" TextWrapping="Wrap" FontFamily="{x:Bind TemplateFontFamily}"
          FontSize="{x:Bind TemplateFontSize}" FontWeight="{x:Bind TemplateFontWeight}" />
      </div>
      <span v-if="!isTokenStyle" class="win-selector-bar-item-selection-visual" data-template-part="PART_SelectionVisual" aria-hidden="true"></span>
      <span v-if="!isTokenStyle" class="win-selector-bar-item-common-visual" data-template-part="PART_CommonVisual" aria-hidden="true"></span>
    </div>
  </div>
</template>

<script>
import { SelectorBarItemIcon, SelectorBarItemChild } from './selectorBarRuntime'
export default { Icon: SelectorBarItemIcon, Child: SelectorBarItemChild }
</script>

<script setup>
import { Comment, Fragment, Text, computed, defineComponent, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, reactive, ref, useAttrs, useSlots, watch } from 'vue'
import SymbolIcon from './SymbolIcon.vue'
import TextBlock from './TextBlock.vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { alignment, xamlThickness } from './layout'
import { itemContainerControllerKey, itemsViewItemContextKey, itemsViewElementKey } from './ItemsViewState'
import { selectorBarItemDefaults, selectorBarItemKey, selectorBarPointerFocusKey, selectorBarElementFactory } from './selectorBarRuntime'
import { selectorBarStyleSetter } from './selectorBarResources'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ name: 'SelectorBarItem', inheritAttrs: false })
const props = defineProps({
  Style: { type: [String, Object], default: null },
  Text: { type: [String, Number], default: '' }, Tag: { type: [String, Number], default: '' }, Icon: { type: [String, Object], default: null }, Child: { type: null, default: null },
  IsSelected: { type: [Boolean, String], default: false }, IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: true }, IsHitTestVisible: { type: [Boolean, String], default: true },
  Visibility: { type: String, default: 'Visible' }, Padding: { type: [String, Number], default: '12,10,12,7' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 }, Opacity: { type: [String, Number], default: 1 },
  BackgroundSizing: { type: String, default: 'OuterBorderEdge' },
  Background: { type: String, default: 'Transparent' }, Foreground: { type: String, default: '{ThemeResource SelectorBarItemForeground}' },
  BorderBrush: { type: String, default: '{ThemeResource SelectorBarItemBorderBrush}' }, BorderThickness: { type: [String, Number], default: 1 },
  CornerRadius: { type: [String, Number], default: '{ThemeResource ControlCornerRadius}' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  HorizontalContentAlignment: { type: String, default: 'Left' }, VerticalContentAlignment: { type: String, default: 'Top' },
  FontFamily: { type: String, default: '{ThemeResource ContentControlThemeFontFamily}' },
  FontSize: { type: [String, Number], default: 14 }, FontWeight: { type: String, default: 'Normal' },
  FocusVisualMargin: { type: [String, Number], default: -2 }, UseSystemFocusVisuals: { type: [Boolean, String], default: true }
})
const attrs = useAttrs(), slots = useSlots(), instance = getCurrentInstance(), rootRef = ref(null)
const controller = inject(itemContainerControllerKey, null), itemContext = inject(itemsViewItemContextKey, null)
const dataItem = inject(xamlItemContextKey, null)
const model = dataItem?.[selectorBarItemKey] ? dataItem : null
const local = reactive({}), pointerOver = ref(false), pressed = ref(false)
const directPropertyValues = reactive({})
const makeElement = selectorBarElementFactory(instance)
const read = name => {
  if (model) return model[name]
  const style = name === 'Style' ? undefined : selectorBarStyleSetter(read('Style'), name, 'SelectorBarItem')
  const value = name in local ? resolveXamlValue(local[name], instance) : name in directPropertyValues ? directPropertyValues[name]
    : resolveXamlValue(instance?.vnode.props?.[name] !== undefined ? props[name] : style ?? props[name], instance)
  return name === 'Icon' || name === 'Child' ? makeElement(name, value) : value
}
const isEnabled = computed(() => read('IsEnabled') !== false && (controller?.isEnabled?.() ?? true))
const isTokenStyle = computed(() => read('Style')?.Key === 'TokenViewSelectorBarItemStyle')
const isSelected = computed(() => controller && dataItem ? controller.isSelected(dataItem) : read('IsSelected') === true)
const tabIndex = computed(() => !isEnabled.value || read('IsTabStop') === false ? -1 : itemContext?.tabIndex?.() ?? 0)
const stateClasses = computed(() => [
  `${isSelected.value ? 'Selected' : 'Unselected'}${isEnabled.value && pressed.value ? 'Pressed' : isEnabled.value && pointerOver.value ? 'PointerOver' : 'Normal'}`,
  { 'is-selected': isSelected.value, 'is-disabled': !isEnabled.value, 'is-token-style': isTokenStyle.value }
])
const rootAttrs = computed(() => { const { class: _class, style: _style, ...rest } = attrs; return rest })
const foreground = computed(() => {
  if (isTokenStyle.value) {
    if (isEnabled.value && pressed.value) return resolveXamlValue(`{ThemeResource TokenItemForegroundPressed${isSelected.value ? 'Selected' : ''}}`, instance)
    if (isEnabled.value && pointerOver.value) return resolveXamlValue(`{ThemeResource TokenItemForegroundPointerOver${isSelected.value ? 'Selected' : ''}}`, instance)
    return isSelected.value ? resolveXamlValue('{ThemeResource TokenItemForegroundSelected}', instance) : read('Foreground')
  }
  if (!isEnabled.value) return 'var(--SelectorBarItemForegroundDisabled)'
  if (pressed.value) return isSelected.value ? 'var(--SelectorBarItemForegroundPointerOver)' : 'var(--SelectorBarItemForegroundPressed)'
  if (pointerOver.value) return 'var(--SelectorBarItemForegroundPointerOver)'
  return isSelected.value ? 'var(--SelectorBarItemForegroundSelected)' : read('Foreground')
})
const rootStyle = computed(() => {
  const values = Object.fromEntries(Object.keys(selectorBarItemDefaults)
    .filter(name => !['Icon', 'Child', 'Padding', 'Background', 'BorderBrush', 'BorderThickness'].includes(name))
    .map(name => [name, read(name)]))
  return { ...frameworkLayoutStyle(values, instance), color: foreground.value }
})
const chromeStyle = computed(() => {
  if (isTokenStyle.value) {
    const state = isEnabled.value && pressed.value ? 'Pressed' : isEnabled.value && pointerOver.value ? 'PointerOver' : ''
    const suffix = `${state}${isSelected.value ? 'Selected' : ''}`
    return {
      borderRadius: rootStyle.value.borderRadius,
      borderStyle: 'solid', borderWidth: xamlThickness(read('BorderThickness')),
      borderColor: suffix ? resolveXamlValue(`{ThemeResource TokenItemBorderBrush${suffix}}`, instance) : read('BorderBrush'),
      background: suffix ? resolveXamlValue(`{ThemeResource TokenItemBackground${suffix}}`, instance) : read('Background'),
      backgroundClip: read('BackgroundSizing') === 'InnerBorderEdge' ? 'padding-box' : 'border-box',
      transition: 'background-color 83ms linear'
    }
  }
  return {
    borderRadius: rootStyle.value.borderRadius,
    background: !isEnabled.value ? 'var(--SelectorBarItemBackgroundDisabled)'
      : isSelected.value && !pointerOver.value && !pressed.value ? 'var(--SelectorBarItemBackgroundSelected)'
      : !isSelected.value && pressed.value ? 'var(--SelectorBarItemBackgroundPressed)'
      : !isSelected.value && pointerOver.value ? 'var(--SelectorBarItemBackgroundPointerOver)' : read('Background')
  }
})
const contentStyle = computed(() => ({
  margin: xamlThickness(read('Padding')),
  justifySelf: alignment(read('HorizontalContentAlignment'), 'horizontal'),
  alignSelf: alignment(read('VerticalContentAlignment'), 'vertical'),
  fontFamily: read('FontFamily'), fontSize: typeof read('FontSize') === 'number' ? `${read('FontSize')}px` : read('FontSize'),
  fontWeight: String(read('FontWeight')).toLowerCase()
}))
const text = computed(() => String(read('Text') ?? ''))
const hasText = computed(() => text.value.length > 0)
// Structural slots are read only by the owning render. API getters and
// watchers use the cached element objects, so x:Bind stays live without calling
// Vue slots outside the render that owns their dependencies.
const elementChildren = node => {
  if (!node) return []
  if (Array.isArray(node.children)) return node.children
  const result = node.children?.default?.()
  return Array.isArray(result) ? result : result ? [result] : []
}
const flattenContent = rawNodes => {
  const nodes = Array.isArray(rawNodes) ? rawNodes : rawNodes ? [rawNodes] : []
  return nodes.flatMap(node => {
  if (!node || node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []
  return node.type === Fragment ? flattenContent(elementChildren(node)) : [node]
  })
}
const preparePropertyElements = () => {
  const nodes = flattenContent(slots.default?.() ?? [])
  const propertyNode = name => nodes.find(node => node.type?.__selectorBarProperty === name)
  const icon = flattenContent(elementChildren(propertyNode('Icon') ?? {}))[0] ?? null
  const childProperty = propertyNode('Child')
  const child = childProperty ? flattenContent(elementChildren(childProperty))[0] ?? null
    : nodes.find(node => !node.type?.__selectorBarProperty) ?? null
  for (const [name, element] of [['Icon', icon], ['Child', child]]) {
    if (model?.SetPropertyElement) model.SetPropertyElement(name, element)
    else if (!(name in local)) {
      const previous = directPropertyValues[name]
      if (!element) delete directPropertyValues[name]
      else if (previous?.Type === (element.type?.name || element.type?.__name || element.type)) previous.UpdateElementNode(element)
      else directPropertyValues[name] = makeElement(name, element)
    }
  }
  return null
}
const hasIcon = computed(() => read('Icon') != null)
const renderPropertyElement = (name, value) => {
  if (value == null) return null
  const node = typeof value?.[itemsViewElementKey] === 'function' ? value[itemsViewElementKey]() : value
  if (Array.isArray(node)) return h(Fragment, normalizeXamlNodes(node, instance))
  if (isVNode(node)) return h(Fragment, normalizeXamlNodes([node], instance))
  if (name === 'Icon' && typeof value === 'object' && value.Symbol !== undefined) return h(SymbolIcon, value)
  return typeof node === 'string' || typeof node === 'number' ? node : null
}
const IconOutlet = defineComponent({ setup() { return () => renderPropertyElement('Icon', read('Icon')) } })
const ChildOutlet = defineComponent({ setup() { return () => renderPropertyElement('Child', read('Child')) } })
provide(xamlScopeKey, {
  ...inject(xamlScopeKey, {}),
  get TemplateText() { return text.value }, get TemplateForeground() { return foreground.value },
  get TemplateFontFamily() { return read('FontFamily') },
  get TemplateFontSize() { return read('FontSize') }, get TemplateFontWeight() { return read('FontWeight') }
})

let pointerId = null
let pointerType = null
let pointerOrigin = null
let pendingPointerClick = false
let pointerClickTimer = null
const clearPointerClick = () => {
  pendingPointerClick = false
  if (pointerClickTimer != null) clearTimeout(pointerClickTimer)
  pointerClickTimer = null
}
const invoke = (trigger, event) => {
  if (!isEnabled.value || read('IsHitTestVisible') === false) return
  if (controller && dataItem) controller.itemInvoked(dataItem, trigger, event)
  else if (trigger !== 'Tap') { local.IsSelected = true; updateXamlBinding(props.IsSelected, true, instance) }
}
const cancelPointer = event => {
  if (event && pointerId != null && event.pointerId !== pointerId) return
  pressed.value = false
  if (pointerType === 'touch' || pointerType === 'pen') pointerOver.value = false
  const captured = pointerId; pointerId = null
  pointerType = null
  pointerOrigin = null
  if (captured != null && rootRef.value?.hasPointerCapture?.(captured)) rootRef.value.releasePointerCapture(captured)
}
const onPointerDown = event => {
  if (!isEnabled.value || read('IsHitTestVisible') === false || (event.pointerType === 'mouse' && event.button !== 0)) return
  if (pointerId != null && pointerId !== event.pointerId) return
  pointerId = event.pointerId; pointerType = event.pointerType; pressed.value = true
  pointerOrigin = { x: event.clientX, y: event.clientY }
  // WinUI updates selection on PointerReleased. Prevent the browser's default
  // mouse focus here; focus is restored after the committed interaction.
  if (event.pointerType === 'mouse') event.preventDefault()
  try { rootRef.value?.setPointerCapture?.(pointerId) } catch { /* Synthetic/accessibility pointer has no browser capture. */ }
}
const onPointerLeave = event => {
  pointerOver.value = false
  if (pointerId === event.pointerId && (pointerType === 'touch' || pointerType === 'pen')) {
    const box = rootRef.value?.getBoundingClientRect()
    // Ancestor ScrollView capture synthesizes PointerExited while the touch
    // remains inside the item. Only a real exit or pan cancels this press.
    if (box && event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom) return
  }
  pressed.value = false
}
const completePointerRelease = event => {
  if (pointerId !== event.pointerId) return
  const box = rootRef.value.getBoundingClientRect()
  const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom
  const shouldInvoke = pressed.value && inside
  cancelPointer()
  if (shouldInvoke) {
    clearPointerClick()
    pendingPointerClick = true
    pointerClickTimer = setTimeout(clearPointerClick, 0)
    invoke('PointerReleased', event)
    const element = rootRef.value
    if (element) element[selectorBarPointerFocusKey] = true
    try {
      element?.focus?.({ preventScroll: true })
      controller?.setCurrent?.(dataItem, { preserveSelection: true })
    } finally {
      if (element) delete element[selectorBarPointerFocusKey]
    }
  }
}
const onPointerUp = event => completePointerRelease(event)
// ScrollView/ScrollPresenter can capture a touch pointer before this item
// receives PointerCanceled/PointerReleased. Keep the tracked pointer alive at
// window level so cancellation and an outside release always clear it.
const onWindowPointerCancel = event => { if (pointerId === event.pointerId) cancelPointer(event) }
const onWindowPointerUp = event => {
  if (pointerId === event.pointerId && !rootRef.value?.contains(event.target)) completePointerRelease(event)
}
const onWindowPointerMove = event => {
  if (event.pointerId !== pointerId || !pointerOrigin || (pointerType !== 'touch' && pointerType !== 'pen')) return
  // ScrollView starts its pan rail at three pixels. Once the same gesture is
  // a pan, the item must cancel its press instead of selecting on release.
  if (Math.hypot(event.clientX - pointerOrigin.x, event.clientY - pointerOrigin.y) > 3) cancelPointer(event)
}
const onClick = event => {
  // A browser accessibility/programmatic click has no PointerReleased.
  // Real pointer clicks already selected there and must not toggle twice.
  if (pendingPointerClick) { clearPointerClick(); return }
  if (event.detail === 0) invoke('PointerReleased', event)
}
const onKeyDown = event => {
  if (!isEnabled.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!event.repeat) invoke(event.key === 'Enter' ? 'EnterKey' : 'SpaceKey', event)
  }
}
const onFocus = event => controller?.setCurrent?.(dataItem, {
  preserveSelection: Boolean(rootRef.value?.[selectorBarPointerFocusKey])
    || event.relatedTarget?.closest?.('.win-selector-bar') !== rootRef.value?.closest?.('.win-selector-bar')
})
const onWindowBlur = () => { pointerOver.value = false; cancelPointer(); clearPointerClick() }
watch(() => resolveXamlValue(props.IsSelected, instance), selected => {
  if (model && model.IsSelected !== selected) model.IsSelected = selected
})
for (const name of ['Icon', 'Child']) watch(() => resolveXamlValue(props[name], instance), () => {
  if (model?.SynchronizeBoundProperty) model.SynchronizeBoundProperty(name)
  else delete local[name]
})
watch(isEnabled, enabled => { if (!enabled) onWindowBlur() })
onMounted(() => {
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('pointercancel', onWindowPointerCancel, true)
  window.addEventListener('pointerup', onWindowPointerUp, true)
  window.addEventListener('pointermove', onWindowPointerMove, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('pointercancel', onWindowPointerCancel, true)
  window.removeEventListener('pointerup', onWindowPointerUp, true)
  window.removeEventListener('pointermove', onWindowPointerMove, true)
  cancelPointer(); clearPointerClick()
})
const publicApi = model ?? Object.fromEntries([])
if (!model) for (const name of Object.keys(selectorBarItemDefaults)) Object.defineProperty(publicApi, name, {
  enumerable: true, get: () => name === 'IsSelected' ? isSelected.value : read(name),
  set: value => { local[name] = value; updateXamlBinding(props[name], value, instance) }
})
defineExpose(publicApi)
</script>

<style scoped>
.win-selector-bar-item {
  position: relative; display: grid; box-sizing: border-box; min-width: 0; min-height: 0;
  flex: 0 0 auto; margin: 0; padding: 0 !important; border: 0; outline: none;
  color: var(--SelectorBarItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
  user-select: none; -webkit-tap-highlight-color: transparent; cursor: default;
}
.win-selector-bar-item-container-root {
  position: relative; display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto;
  box-sizing: border-box; min-width: 0; min-height: 0; overflow: hidden; background: transparent;
}
.win-selector-bar-item-content {
  grid-column: 2; grid-row: 1; display: flex; align-items: center; gap: var(--SelectorBarItemSpacing, 8px);
  min-width: 0; max-width: 100%; color: inherit;
}
.win-selector-bar-item-icon {
  display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
  margin: 0 -2px; transform: scale(var(--SelectorBarItemIconScale, .8)); transform-origin: center; color: inherit;
}
.win-selector-bar-item-text { min-width: 0; color: inherit; overflow-wrap: anywhere; }
.win-selector-bar-item-selection-visual {
  grid-column: 1 / 3; grid-row: 2; justify-self: center; align-self: end;
  width: var(--SelectorBarItemPillWidth, 4px); height: var(--SelectorBarItemPillHeight, 3px);
  border-radius: .5px / 1px; background: var(--SelectorBarItemPillFill, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  transform: scaleX(1); transform-origin: center; opacity: 0; pointer-events: none;
}
.win-selector-bar-item-common-visual {
  position: absolute; inset: 0; box-sizing: border-box;
  border: var(--SelectorBarSelectedInnerThickness, 1px) solid var(--SelectorBarItemBorderBrush, transparent);
  border-radius: inherit; background: var(--SelectorBarItemBackground, transparent); pointer-events: none;
}
.win-selector-bar-item.UnselectedPointerOver { color: var(--SelectorBarItemForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary))); }
.win-selector-bar-item.UnselectedPressed { color: var(--SelectorBarItemForegroundPressed, var(--TextFillColorTertiaryBrush, var(--text-tertiary))); }
.win-selector-bar-item.SelectedNormal { color: var(--SelectorBarItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary))); }
.win-selector-bar-item.SelectedPointerOver,
.win-selector-bar-item.SelectedPressed { color: var(--SelectorBarItemForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary))); }
.win-selector-bar-item.is-selected .win-selector-bar-item-selection-visual {
  opacity: 1; transform: scaleX(4); animation: selector-bar-pill 167ms cubic-bezier(0, 0, 0, 1) both;
}
.win-selector-bar-item.is-disabled { color: var(--SelectorBarItemForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled))); }
.win-selector-bar-item.is-disabled .win-selector-bar-item-selection-visual {
  background: var(--SelectorBarItemDisabledPillFill, var(--AccentFillColorDisabledBrush, var(--accent-fill-disabled)));
}
.win-selector-bar-item:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); outline-offset: -2px; }
@keyframes selector-bar-pill { from { transform: scaleX(1); opacity: 0; } to { transform: scaleX(4); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .win-selector-bar-item.is-selected .win-selector-bar-item-selection-visual { animation: none; } }
</style>
