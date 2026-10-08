<script lang="ts">
import { tabViewItemProperties } from './TabViewProperties'
export default { ...tabViewItemProperties }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch, type PropType, type VNode } from 'vue'
import IconSourceElement from './IconSourceElement.vue'
import { TabViewTemplateToolTip } from './tabViewToolTip'
import { getToolTipServiceProperty, ToolTipServiceToolTip } from './ToolTipServiceProperties'
import ToolTip from './ToolTip.vue'
import { pivotTemplate } from './PivotProperties'
import Viewbox from './Viewbox.vue'
import { useI18n } from './i18n/index'
import { frameworkLayoutStyle } from './frameworkLayout'
import { cssLength, xamlThickness } from './layout'
import { resolveBrushStyle } from './AcrylicBrush'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey } from './xamlRuntime'
import { getTabViewProperty, renderTabViewPresenter, tabViewItemIdentityKey, tabViewItemLiveControlKey, tabViewItemOwnerKey, tabViewItemRecordKey, tabViewNodes, tabViewPropertyChildren, tabViewRootAttributes, tabViewText } from './TabViewProperties'
import './tabViewStyles.css'

defineOptions({ name: 'TabViewItem', inheritAttrs: false })
const props = defineProps({
  Header: { type: null as unknown as PropType<unknown>, default: null as unknown }, HeaderTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown },
  IconSource: { type: null as unknown as PropType<unknown>, default: null as unknown }, Content: { type: null as unknown as PropType<unknown>, default: null as unknown }, ContentTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown },
  IsClosable: { type: null as unknown as PropType<unknown>, default: true as unknown }, IsEnabled: { type: null as unknown as PropType<unknown>, default: true as unknown }, IsSelected: { type: null as unknown as PropType<unknown>, default: false as unknown },
  IsTabStop: { type: null as unknown as PropType<unknown>, default: true as unknown }, Visibility: { type: null as unknown as PropType<unknown>, default: 'Visible' as unknown },
  Background: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Foreground: { type: null as unknown as PropType<unknown>, default: '' as unknown }, BorderBrush: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  BorderThickness: { type: null as unknown as PropType<unknown>, default: 1 as unknown }, CornerRadius: { type: null as unknown as PropType<unknown>, default: '{ThemeResource OverlayCornerRadius}' as unknown },
  Width: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Height: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MinWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MaxWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  MinHeight: { type: null as unknown as PropType<unknown>, default: 32 as unknown }, MaxHeight: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Margin: { type: null as unknown as PropType<unknown>, default: 0 as unknown },
  Padding: { type: null as unknown as PropType<unknown>, default: '' as unknown }, HorizontalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown }, VerticalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown },
  HorizontalContentAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown }, VerticalContentAlignment: { type: null as unknown as PropType<unknown>, default: 'Center' as unknown },
  FontSize: { type: null as unknown as PropType<unknown>, default: 12 as unknown }, FontWeight: { type: null as unknown as PropType<unknown>, default: 'Normal' as unknown }, Opacity: { type: null as unknown as PropType<unknown>, default: 1 as unknown },
  ContextFlyout: { type: null as unknown as PropType<unknown>, default: null as unknown }, AccessKey: { type: null as unknown as PropType<unknown>, default: '' as unknown }, DataContext: { type: null as unknown as PropType<unknown>, default: null as unknown }
})
const emit = defineEmits(['CloseRequested', 'update:IsSelected'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const owner = inject(tabViewItemOwnerKey, null)
const recordKey = inject(tabViewItemRecordKey, undefined)
const rootRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLElement | null>(null)
const hovered = ref(false)
const pressed = ref(false)
const contextFlyout = shallowRef<{ ShowAt?: (target: unknown, options?: unknown) => unknown } | null>(null)
const realizedIconSource = shallowRef<{ IconSource?: unknown } | null>(null)
const overrides = shallowReactive<Record<string, unknown>>({})
const key = () => recordKey ?? instance?.vnode.key
const value = (source: unknown) => resolveXamlValue(source, instance)
const property = (name: keyof typeof props): unknown => {
  const source = name in overrides ? overrides[name] : props[name]
  return /Template$/.test(name) && typeof source === 'string' && /^\{(?:StaticResource|ThemeResource)\s/.test(source) ? source : value(source)
}
const nodes = computed(() => tabViewNodes(slots.default?.() ?? []))
const children = (name: string) => tabViewPropertyChildren(nodes.value, 'TabViewItem', name)
const selected = computed(() => owner ? owner.Selected(key()) : property('IsSelected') === true)
const enabled = computed(() => property('IsEnabled') !== false && (!owner || owner.Enabled()))
const compact = computed(() => owner?.Compact(key()) ?? false)
const closable = computed(() => property('IsClosable') !== false)
const showClose = computed(() => closable.value && (!owner || owner.OverlayMode() !== 'OnPointerOver' || selected.value || hovered.value))
const hasIcon = computed(() => Boolean(property('IconSource')) || children('IconSource').length > 0)
const contentNodes = computed(() => children('Content').length ? children('Content') : nodes.value.filter(node => !getTabViewProperty(node, 'TabViewItem') && !getToolTipServiceProperty(node)))
const toolTipDeclarations = computed(() => nodes.value.filter(getToolTipServiceProperty))
const hasAuthorToolTip = computed(() => toolTipDeclarations.value.length > 0 || Object.keys(attrs).some(name => name.toLowerCase() === 'tooltipservice.tooltip'))
const headerToolTip = computed(() => typeof property('Header') === 'string' ? String(property('Header')) : '')
const authorToolTip = computed(() => {
  const key = Object.keys(attrs).find(name => name.toLowerCase() === 'tooltipservice.tooltip')
  const input = key ? attrs[key] : undefined
  const resource = typeof input === 'string' ? /^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/.exec(input)?.[1]?.trim() : undefined
  return resource ? pivotTemplate(input, instance) ?? value(input) : value(input)
})
const ToolTipDeclarationOutlet = defineComponent({ setup: () => () => {
  if (toolTipDeclarations.value.length) return h(Fragment, normalizeXamlNodes(toolTipDeclarations.value, instance))
  const authored = authorToolTip.value
  if (isVNode(authored)) return h(ToolTipServiceToolTip, {}, () => normalizeXamlNodes([cloneVNode(authored)], instance))
  if (authored && typeof authored === 'object') return h(ToolTipServiceToolTip, {}, () => h(ToolTip, authored as Record<string, unknown>))
  return null
} })
const HeaderOutlet = defineComponent({ setup: () => () => renderTabViewPresenter(property('Header'), 'Header' in overrides ? [] : children('Header'), property('HeaderTemplate'), children('HeaderTemplate'), instance) })
const iconSize = computed(() => Number(value('{ThemeResource TabViewItemHeaderIconSize}')) || 16)
const IconOutlet = defineComponent({ setup: () => () => h(Viewbox, { MaxWidth: iconSize.value, MaxHeight: iconSize.value, class: 'win-tab-view-icon-viewbox' }, () => h(IconSourceElement, { ref: (source: unknown) => { realizedIconSource.value = source as typeof realizedIconSource.value }, IconSource: property('IconSource') as string | Record<string, unknown> | undefined }, () => normalizeXamlNodes(children('IconSource'), instance))) })
const ContextFlyoutOutlet = defineComponent({ setup: () => () => { const declaration = children('ContextFlyout')[0] ?? (isVNode(property('ContextFlyout')) ? property('ContextFlyout') as VNode : null); return declaration ? h(Fragment, normalizeXamlNodes([cloneVNode(declaration, { ref: (flyout: unknown) => { contextFlyout.value = flyout as typeof contextFlyout.value } })], instance)) : null } })
const rootAttrs = computed(() => {
  const result = tabViewRootAttributes(attrs, instance)
  for (const name of Object.keys(result)) if (name.toLowerCase().startsWith('tooltipservice.')) {
    const resolved = name.toLowerCase() === 'tooltipservice.tooltip' ? authorToolTip.value : value(result[name])
    result[name] = resolved && typeof resolved === 'object' ? '' : resolved
  }
  return result
})
const rootStyle = computed<import('vue').CSSProperties>(() => ({ ...frameworkLayoutStyle({ ...Object.fromEntries(Object.keys(props).map(name => [name, property(name as keyof typeof props)])), Padding: '', Background: '', BorderBrush: '', BorderThickness: '', CornerRadius: '' }, instance),
  width: property('Width') !== '' ? `${Number(property('Width'))}px` : owner?.Width(key()) ? `${owner.Width(key())}px` : undefined,
  color: property('Foreground') ? resolveBrushStyle(property('Foreground'), instance).background as import('vue').CSSProperties['color'] : undefined,
  opacity: owner?.Dragging(key()) ? .8 : String(property('Opacity')),
  '--tab-custom-foreground': property('Foreground') ? resolveBrushStyle(property('Foreground'), instance).background : undefined,
  '--tab-custom-background': property('Background') ? resolveBrushStyle(property('Background'), instance).background : undefined,
  '--tab-custom-border': property('BorderBrush') ? resolveBrushStyle(property('BorderBrush'), instance).background : undefined,
  '--tab-corner-radius': cssLength(property('CornerRadius')), '--tab-border-thickness': xamlThickness(property('BorderThickness'))
}))
const { t } = useI18n()
const localized = (name: string) => String(t(name))
const closeName = computed(() => localized('TabViewCloseButtonName'))
const closeTooltip = computed(() => localized('TabViewCloseButtonTooltipWithKA'))
const visualState = computed(() => !enabled.value ? 'Disabled' : selected.value ? pressed.value ? 'PressedSelected' : hovered.value ? 'PointerOverSelected' : 'Selected' : pressed.value ? 'Pressed' : hovered.value ? 'PointerOver' : 'Normal')
const runningAnimations = new Map<string, Animation>()
const animateState = (name: string, frames: Keyframe[], duration: number) => {
  runningAnimations.get(name)?.cancel()
  if (!rootRef.value?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const animation = rootRef.value.animate(frames, { duration, easing: 'linear' })
  runningAnimations.set(name, animation)
  void animation.finished.catch(() => {}).finally(() => { if (runningAnimations.get(name) === animation) { runningAnimations.delete(name); animation.cancel() } })
}
watch(() => owner?.Dragging(key()) ?? false, (dragging, wasDragging) => {
  if (!dragging) pressed.value = false
  if (!rootRef.value || owner?.IsNativeDrag()) return
  // TabView.xaml: Reordering lasts 240 ms; returning to NotDragging uses
  // the generated 200 ms transition. Opacity never affects layout measures.
  animateState('DragStates', [{ opacity: wasDragging ? .8 : 1 }, { opacity: dragging ? .8 : 1 }], dragging ? 240 : 200)
})
watch(() => owner?.ReorderHint(key()) ?? 0, (next, previous) => {
  // DragOverThemeAnimation offsets the layout root by the official 10 px
  // ListViewItemReorderHintThemeOffset, then restores it in NoReorderHint.
  animateState('ReorderHintStates', [{ transform: `translateX(${previous}px)` }, { transform: `translateX(${next}px)` }], 200)
  if (rootRef.value) rootRef.value.style.transform = next ? `translateX(${next}px)` : ''
})
const publicApi: Record<string | symbol, any> = new Proxy({
  [tabViewItemIdentityKey]: `tab-view-item-${instance?.uid}`, get Element() { return rootRef.value }, get $el() { return rootRef.value },
  get ParentTabView() { return owner?.Api() }, get TabView() { return owner?.Api() }, get IsSelected() { return selected.value },
  set IsSelected(next: boolean) { if (next) owner?.Select(key()); else overrides.IsSelected = next; updateXamlBinding(props.IsSelected, next, instance); emit('update:IsSelected', next) },
  get Content() { return 'Content' in overrides || props.Content !== null ? property('Content') : contentNodes.value.length ? h(Fragment, normalizeXamlNodes(contentNodes.value, instance)) : null },
  get ContentTemplate() { return children('ContentTemplate').length ? children('ContentTemplate') : property('ContentTemplate') },
  get ActualWidth() { return rootRef.value?.clientWidth ?? 0 }, get ActualHeight() { return rootRef.value?.clientHeight ?? 0 },
  get TabViewTemplateSettings() { return { IconElement: hasIcon.value ? h(IconOutlet) : null, TabGeometry: rootRef.value ? `M0,${rootRef.value.clientHeight} L0,4 Q0,0 4,0 L${rootRef.value.clientWidth - 4},0 Q${rootRef.value.clientWidth},0 ${rootRef.value.clientWidth},4 L${rootRef.value.clientWidth},${rootRef.value.clientHeight} Z` : '' } },
  Focus() { rootRef.value?.focus(); return Boolean(rootRef.value) }, RequestClose() { if (enabled.value && closable.value) owner?.Close(key()) },
  RaiseCloseRequested(args: unknown) { const sender = owner?.Container(key()) ?? publicApi; emit('CloseRequested', sender, args); resolveXamlHandler(attrs.CloseRequested, instance)?.(sender, args) }
} as Record<string | symbol, any>, {
  get(target, name, receiver) { const live = target[tabViewItemLiveControlKey] as Record<string | symbol, any> | undefined; if (name !== tabViewItemLiveControlKey && name !== xamlControlIdentityKey && live && live !== receiver) return Reflect.get(live, name, live); return Reflect.get(target, name, receiver) },
  set(target, name, next, receiver) { const live = target[tabViewItemLiveControlKey] as Record<string | symbol, any> | undefined; if (name !== tabViewItemLiveControlKey && live && live !== receiver) return Reflect.set(live, name, next, live); return Reflect.set(target, name, next, receiver) }
})
Object.defineProperty(publicApi, xamlControlIdentityKey, { value: publicApi })
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (['IsSelected', 'Content', 'ContentTemplate'].includes(name)) continue
  Object.defineProperty(publicApi, name, { enumerable: true, configurable: true,
    get: () => name === 'IconSource' ? realizedIconSource.value?.IconSource ?? property(name) : name === 'ContextFlyout' ? contextFlyout.value ?? property(name) : name === 'Header' && children('Header').length && !('Header' in overrides) ? h(Fragment, normalizeXamlNodes(children('Header'), instance)) : property(name),
    set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance) } })
  watch(() => value(props[name]), () => { delete overrides[name] })
}
Object.defineProperty(publicApi, 'Content', { enumerable: true, configurable: true, get: () => 'Content' in overrides || props.Content !== null ? property('Content') : contentNodes.value.length ? h(Fragment, normalizeXamlNodes(contentNodes.value, instance)) : null, set: next => { overrides.Content = next; updateXamlBinding(props.Content, next, instance) } })
Object.defineProperty(publicApi, 'ContentTemplate', { enumerable: true, configurable: true, get: () => children('ContentTemplate').length ? children('ContentTemplate') : property('ContentTemplate'), set: next => { overrides.ContentTemplate = next; updateXamlBinding(props.ContentTemplate, next, instance) } })
const select = () => { if (enabled.value) owner?.Select(key()) }
const pointerDown = (event: PointerEvent) => {
  if (!enabled.value || (event.target as HTMLElement)?.closest('.win-tab-view-close-button')) return
  if (event.button === 0) { pressed.value = true; owner?.PointerDown(event, key()) }
}
const pointerUp = (event: PointerEvent) => { pressed.value = false; if (event.button === 1 && closable.value && hovered.value) { event.preventDefault(); owner?.Close(key()) } }
const keyDown = (event: KeyboardEvent) => { if (!enabled.value) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() }; owner?.KeyDown(event, key()) }
const contextMenu = async (event: MouseEvent) => {
  const flyout = contextFlyout.value ?? property('ContextFlyout') as { ShowAt?: (target: unknown, options?: unknown) => unknown } | null
  if (!enabled.value || !flyout?.ShowAt) return
  event.preventDefault(); await flyout.ShowAt(rootRef.value, { Position: { X: event.clientX - (rootRef.value?.getBoundingClientRect().left ?? 0), Y: event.clientY - (rootRef.value?.getBoundingClientRect().top ?? 0) } })
}
watch(enabled, next => { if (!next) { pressed.value = false; hovered.value = false } })
watch(() => property('IsSelected'), next => { if (next === true && owner) owner.Select(key()) })
watch(selected, next => { updateXamlBinding(props.IsSelected, next, instance); emit('update:IsSelected', next) })
onMounted(async () => { owner?.SetContainer(key(), publicApi); await nextTick(); owner?.SetElement(key(), rootRef.value); if (rootRef.value) Object.assign(rootRef.value, { TabViewItem: owner?.Container(key()) ?? publicApi, ParentTabView: owner?.Api() }) })
onBeforeUnmount(() => { for (const animation of runningAnimations.values()) animation.cancel(); runningAnimations.clear(); owner?.SetElement(key(), null); owner?.SetContainer(key(), null) })
defineExpose(publicApi)
</script>

<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-tab-view-item" :class="[attrs.class, { 'is-selected': selected, 'is-disabled': !enabled, 'is-pointer-over': hovered, 'is-pressed': pressed, 'is-compact': compact, 'has-icon': hasIcon, 'has-close': showClose, 'is-closable': closable, 'is-dragging': owner?.Dragging(key()) }]"
    :style="[attrs.style, rootStyle]" role="tab" :tabindex="enabled && property('IsTabStop') !== false ? owner?.TabIndex(key()) ?? 0 : -1"
    :aria-selected="selected" :aria-disabled="!enabled" :aria-controls="owner?.PanelId(key())" :accesskey="tabViewText(property('AccessKey')) || undefined"
    :draggable="enabled && owner?.CanDrag()" data-part="LayoutRoot" :data-visual-state="visualState" :data-drag-state="owner?.Dragging(key()) ? owner?.IsNativeDrag() ? 'Dragging' : 'Reordering' : 'NotDragging'"
    @click="select" @keydown="keyDown" @focus="owner?.SetFocused(key())" @contextmenu="contextMenu" @pointerenter="hovered = true" @pointerleave="hovered = false; pressed = false"
    @pointerdown="pointerDown" @pointerup="pointerUp" @pointercancel="pressed = false" @lostpointercapture="pressed = false"
    @auxclick.prevent @dragstart="owner?.DragStart($event, key())" @dragend="owner?.DragEnd($event)">
    <div class="win-tab-view-bottom-border-line" data-part="BottomBorderLine"></div>
    <div v-if="selected" class="win-tab-view-selected-background" data-part="SelectedBackgroundPath" aria-hidden="true"></div>
    <div v-if="owner?.Separator(key()) ?? !selected" class="win-tab-view-tab-separator" data-part="TabSeparator"></div>
    <div class="win-tab-view-tab-drag-visual" data-part="TabDragVisualContainer"></div>
    <div class="win-tab-view-tab-container" data-part="TabContainer">
      <div v-if="hasIcon" class="win-tab-view-icon-box" data-part="IconBox"><IconOutlet /></div>
      <div class="win-tab-view-header-content" data-part="ContentPresenter"><span class="win-tab-view-header-value"><HeaderOutlet /></span><span class="win-tab-view-header-measure" aria-hidden="true">{{ tabViewText(property('Header')) }}</span></div>
      <button v-if="closable" ref="closeButtonRef" class="win-tab-view-close-button" :class="{ 'is-visible': showClose }" type="button" data-part="CloseButton" tabindex="-1" :disabled="!enabled" :aria-label="closeName"
        @pointerdown.stop @click.stop="owner?.Close(key())"><span class="win-tab-view-glyph">&#xE711;</span></button>
    </div>
    <ContextFlyoutOutlet />
    <ToolTipDeclarationOutlet v-if="hasAuthorToolTip" />
    <TabViewTemplateToolTip v-else :Owner="rootRef" :Content="headerToolTip" Placement="Mouse" :IsEnabled="enabled" />
    <TabViewTemplateToolTip :Owner="closeButtonRef" :Content="closeTooltip" :IsEnabled="enabled && closable && showClose" />
  </div>
</template>
