<template>
  <NativeHyperlinkHost
    v-bind="buttonAttrs"
    class="win-hyperlink-button"
    :HorizontalAlignment="resolve(props.HorizontalAlignment)"
    :VerticalAlignment="resolve(props.VerticalAlignment)"
    :class="[attrs.class, { disabled: !IsEnabled, 'is-pressed': pressed, 'system-focus': UseSystemFocusVisuals, 'win-theme-scope': RequestedTheme === 'Light' || RequestedTheme === 'Dark', 'theme-light': RequestedTheme === 'Light', 'theme-dark': RequestedTheme === 'Dark' }]"
    :style="hostStyle"
    :href="NavigateUri || undefined"
    :type="NavigateUri ? undefined : 'button'"
    :target="NavigateUri ? TargetName || '_blank' : undefined"
    :rel="!TargetName || TargetName === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="NavigateUri ? undefined : !IsEnabled"
    :aria-disabled="!IsEnabled || undefined"
    :tabindex="!IsEnabled || !IsTabStop ? -1 : undefined"
    @click="onClick"
    @pointerdown="onPointerDown"
    @pointerenter="onPointerEntered"
    @pointermove="onPointerMoved"
    @pointerup="onPointerReleased"
    @pointercancel="onPointerCanceled"
    @lostpointercapture="clearPressed"
    @pointerleave="onPointerExited"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @blur="clearPressed">
    <ContentPresenter class="win-hyperlink-content-presenter" ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}" Background="{x:Bind PresenterBackground}" BackgroundSizing="{x:Bind PresenterBackgroundSizing}" BorderBrush="{x:Bind PresenterBorderBrush}" BorderThickness="{x:Bind PresenterBorderThickness}" Padding="{x:Bind PresenterPadding}" CornerRadius="{x:Bind PresenterCornerRadius}" HorizontalContentAlignment="{x:Bind PresenterHorizontalAlignment}" VerticalContentAlignment="{x:Bind PresenterVerticalAlignment}">
      <ContentOutlet />
    </ContentPresenter>
  </NativeHyperlinkHost>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buttonContentProperty } from './buttonContentRuntime'
export const HyperlinkButtonContent = defineComponent({ name: 'HyperlinkButton.Content', __hyperlinkButtonProperty: 'content', setup() { return () => null } })
export default { Content: HyperlinkButtonContent, ContentTemplate: buttonContentProperty('HyperlinkButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('HyperlinkButton', 'ContentTransitions'), Resources: buttonContentProperty('HyperlinkButton', 'Resources') }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, proxyRefs, ref, Text, useAttrs, useSlots, watch } from 'vue'
import ContentPresenter from './ContentPresenter.vue'
import { alignment, boolValue, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useUICommand } from './uiCommandRuntime'
import { getButtonContentProperty, useButtonContent } from './buttonContentRuntime'

defineOptions({ name: 'HyperlinkButton', inheritAttrs: false })
const props = defineProps({
  Content: { type: null, default: '' }, NavigateUri: { type: String, default: '' }, TargetName: { type: String, default: '' },
  ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined },
  RequestedTheme: { type: String, default: 'Default' },
  Command: { type: [Object, String], default: undefined }, CommandParameter: { default: undefined },
  ClickMode: { type: String, default: 'Release' },
  IsEnabled: { type: [Boolean, String], default: true }, IsTabStop: { type: [Boolean, String], default: true }, Visibility: { type: String, default: 'Visible' },
  Background: { type: String, default: '' }, BackgroundSizing: { type: String, default: 'OuterBorderEdge' }, Foreground: { type: String, default: '' }, BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: 1 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '11,5,11,6' }, HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  HorizontalContentAlignment: { type: String, default: 'Left' }, VerticalContentAlignment: { type: String, default: 'Top' },
  FontFamily: { type: String, default: '' }, FontSize: { type: [String, Number], default: 14 }, FontWeight: { type: String, default: 'Normal' }, CornerRadius: { type: [String, Number], default: 4 },
  UseSystemFocusVisuals: { type: [Boolean, String], default: true }, FocusVisualMargin: { type: [String, Number], default: -3 }
})
const emit = defineEmits(['Click'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const root = ref<HTMLElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const { ContentTemplate, ContentTransitions, renderTemplate } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const property = (key: 'Content' | 'NavigateUri' | 'IsEnabled' | 'RequestedTheme') => {
  const source = computed(() => resolve(props[key]))
  const local = ref<unknown>(undefined)
  watch(source, () => { local.value = undefined })
  return computed({ get: () => local.value !== undefined ? local.value : source.value, set: value => { local.value = value; updateXamlBinding(props[key], value, instance) } })
}
const Content = property('Content')
const NavigateUri = property('NavigateUri')
// Render a native tag directly: dynamic string components resolve the registered Button.
const NativeHyperlinkHost = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(NavigateUri.value ? 'a' : 'button', { ...attrs, ref: root }, slots.default?.())
  }
})
const RequestedTheme = property('RequestedTheme')
const IsEnabledProperty = property('IsEnabled')
const Command = useUICommand(() => resolve(props.Command))
const CommandParameter = computed(() => resolve(props.CommandParameter))
const IsEnabled = computed({ get: () => boolValue(IsEnabledProperty.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: (value: unknown) => { IsEnabledProperty.value = boolValue(value) } })
const IsTabStop = computed(() => boolValue(resolve(props.IsTabStop)))
const UseSystemFocusVisuals = computed(() => boolValue(resolve(props.UseSystemFocusVisuals)))
const TargetName = computed(() => String(resolve(props.TargetName) ?? ''))
const pressed = ref(false)
const ClickMode = computed(() => String(resolve(props.ClickMode)))
let suppressPointerClick = false
let activePointer: number | null = null
let pressedKey: string | null = null
const buttonAttrs = computed(() => {
  const rest = Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'Click', 'onClick'].includes(key)))
  for (const name of ['AutomationProperties.Name', 'ToolTipService.ToolTip']) {
    const key = Object.keys(rest).find(candidate => candidate.toLowerCase() === name.toLowerCase())
    if (!key) continue
    const value = resolve(rest[key]); delete rest[key]
    if (value !== undefined && value !== null && value !== '') rest[name === 'AutomationProperties.Name' ? 'aria-label' : 'tooltipservice.tooltip'] = String(value)
  }
  return rest
})
const hostStyle = computed(() => {
  const style: Record<string, unknown> = { margin: xamlThickness(resolve(props.Margin)), justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'), fontFamily: resolve(props.FontFamily) || 'var(--ContentControlThemeFontFamily)', fontSize: cssLength(resolve(props.FontSize)), fontWeight: resolve(props.FontWeight) === 'SemiBold' ? '600' : String(resolve(props.FontWeight) || 'normal') }
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) if (resolve(props[name]) !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(resolve(props[name]))
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  if (resolve(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  if (props.Background) style['--HyperlinkButtonBackground'] = resolve(props.Background)
  if (props.Foreground) style['--HyperlinkButtonForeground'] = resolve(props.Foreground)
  if (props.BorderBrush) style['--HyperlinkButtonBorderBrush'] = resolve(props.BorderBrush)
  style.outlineOffset = cssLength(resolve(props.FocusVisualMargin))
  return [attrs.style, style]
})
const ContentOutlet = defineComponent({ name: 'HyperlinkButtonContent', setup() { return () => {
  const templated = renderTemplate(Content.value)
  if (templated) return templated
  if (slots.default) {
    const collect = nodes => nodes.flatMap(node => {
      if (node.type === Fragment && Array.isArray(node.children)) return collect(node.children)
      if (getButtonContentProperty(node)) return []
      if (node.type?.__hyperlinkButtonProperty === 'content') return node.children?.default?.() ?? []
      return [node]
    })
    const nodes = normalizeXamlNodes(collect(slots.default()), instance)
    return nodes.every(node => node.type === Text)
      ? h('span', { class: 'win-button-default-text' }, nodes.map(node => String(node.children ?? '')).join(''))
      : h(Fragment, nodes)
  }
  return isVNode(Content.value) ? Content.value : typeof Content.value === 'string' || typeof Content.value === 'number' ? h('span', { class: 'win-button-default-text' }, String(Content.value)) : null
} } })
const PresenterBackground = computed(() => 'var(--HyperlinkButtonCurrentBackground, var(--HyperlinkButtonBackground, transparent))')
const PresenterBorderBrush = computed(() => 'var(--HyperlinkButtonCurrentBorderBrush, var(--HyperlinkButtonBorderBrush, transparent))')
const PresenterBorderThickness = computed(() => resolve(props.BorderThickness))
const PresenterPadding = computed(() => resolve(props.Padding))
const PresenterBackgroundSizing = computed(() => resolve(props.BackgroundSizing))
const PresenterCornerRadius = computed(() => resolve(props.CornerRadius))
const PresenterHorizontalAlignment = computed(() => resolve(props.HorizontalContentAlignment))
const PresenterVerticalAlignment = computed(() => resolve(props.VerticalContentAlignment))
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), ContentTemplate, ContentTransitions, PresenterBackground, PresenterBackgroundSizing, PresenterBorderBrush, PresenterBorderThickness, PresenterPadding, PresenterCornerRadius, PresenterHorizontalAlignment, PresenterVerticalAlignment })
const publicApi = proxyRefs({ IsEnabled, NavigateUri, Content, ContentTemplate, ContentTransitions, RequestedTheme, Command, CommandParameter, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Element: root, IsPressed: pressed, Focus: () => { root.value?.focus(); return IsEnabled.value } })
defineExpose(publicApi)
function onClick(event: MouseEvent) {
  if (!IsEnabled.value) { event.preventDefault(); event.stopPropagation(); return }
  if (event.detail > 0 && (suppressPointerClick || ClickMode.value === 'Hover')) { suppressPointerClick = false; event.preventDefault(); return }
  const args = { OriginalSource: publicApi, OriginalEvent: event, Handled: false }
  emit('Click', publicApi, args)
  resolveXamlHandler(attrs.Click, instance)?.(publicApi, args)
  if (Command.value?.CanExecute?.(CommandParameter.value) ?? true) Command.value?.Execute(CommandParameter.value)
  if (args.Handled) event.preventDefault()
}
function clearPressed() {
  const pointer = activePointer
  activePointer = null; pressed.value = false; pressedKey = null
  if (pointer !== null && root.value?.hasPointerCapture?.(pointer)) {
    try { root.value.releasePointerCapture(pointer) } catch { }
  }
}
function pointerInside(event: PointerEvent) {
  const bounds = root.value?.getBoundingClientRect()
  return Boolean(bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom)
}
function onPointerMoved(event: PointerEvent) { if (activePointer === event.pointerId) pressed.value = pointerInside(event) }
function onPointerExited() { pressed.value = false }
function onPointerReleased(event: PointerEvent) { if (activePointer === event.pointerId && !pointerInside(event)) suppressPointerClick = true; clearPressed() }
function onPointerCanceled() { suppressPointerClick = true; clearPressed() }
function onPointerDown(event: PointerEvent) {
  if (!IsEnabled.value || event.button !== 0 || ClickMode.value === 'Hover') return
  suppressPointerClick = false
  activePointer = event.pointerId
  pressed.value = true
  root.value?.setPointerCapture?.(event.pointerId)
  if (ClickMode.value === 'Press') { root.value?.click(); suppressPointerClick = true }
}
function onPointerEntered(event: PointerEvent) {
  if (activePointer === event.pointerId && event.buttons > 0) pressed.value = true
  if (IsEnabled.value && ClickMode.value === 'Hover') root.value?.click()
}
function onKeyDown(event: KeyboardEvent) {
  if (!IsEnabled.value || ClickMode.value === 'Hover') return
  if (event.key !== ' ' && event.key !== 'Enter') { clearPressed(); return }
  event.preventDefault()
  if (event.repeat || pressed.value || activePointer !== null) return
  pressedKey = event.key
  pressed.value = true
  if (ClickMode.value === 'Press') root.value?.click()
}
function onKeyUp(event: KeyboardEvent) {
  if (event.key !== ' ' && event.key !== 'Enter') return
  event.preventDefault()
  const shouldClick = IsEnabled.value && pressed.value && pressedKey === event.key
  clearPressed()
  if (shouldClick && ClickMode.value === 'Release') root.value?.click()
}
watch(IsEnabled, clearPressed)
onMounted(() => window.addEventListener('blur', clearPressed))
onBeforeUnmount(() => window.removeEventListener('blur', clearPressed))
</script>

<style>
.win-hyperlink-button { display: inline-flex; box-sizing: border-box; flex: 0 0 auto; min-width: 0; max-width: 100%; min-height: 0; padding: 0; border: 0; outline: none; background: transparent; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif); font-size: var(--ControlContentThemeFontSize, 14px); line-height: 19px; font-weight: normal; white-space: nowrap; text-decoration: none; color: var(--HyperlinkButtonCurrentForeground, var(--HyperlinkButtonForeground, var(--AccentTextFillColorPrimaryBrush, var(--accent-text-fill-color-primary)))); cursor: pointer; user-select: none; }
.win-hyperlink-content-presenter { width: 100%; box-sizing: border-box; min-width: 0; max-width: 100%; color: inherit; transition: background-color 83ms; }
.win-hyperlink-button:hover:not(.disabled) { --HyperlinkButtonCurrentForeground: var(--HyperlinkButtonForegroundPointerOver, var(--AccentTextFillColorSecondaryBrush, var(--accent-text-fill-color-secondary))); --HyperlinkButtonCurrentBackground: var(--HyperlinkButtonBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary))); --HyperlinkButtonCurrentBorderBrush: var(--HyperlinkButtonBorderBrushPointerOver, transparent); }
.win-hyperlink-button.is-pressed:not(.disabled), .win-hyperlink-button:active:not(.disabled) { --HyperlinkButtonCurrentForeground: var(--HyperlinkButtonForegroundPressed, var(--AccentTextFillColorTertiaryBrush, var(--accent-text-fill-color-tertiary))); --HyperlinkButtonCurrentBackground: var(--HyperlinkButtonBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary))); --HyperlinkButtonCurrentBorderBrush: var(--HyperlinkButtonBorderBrushPressed, transparent); }
.win-hyperlink-button.disabled { --HyperlinkButtonCurrentForeground: var(--HyperlinkButtonForegroundDisabled, var(--AccentTextFillColorDisabledBrush, var(--accent-text-fill-color-disabled))); --HyperlinkButtonCurrentBackground: var(--HyperlinkButtonBackgroundDisabled, var(--SubtleFillColorDisabledBrush, transparent)); --HyperlinkButtonCurrentBorderBrush: var(--HyperlinkButtonBorderBrushDisabled, transparent); cursor: default; }
.win-hyperlink-button.system-focus:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); box-shadow: inset 0 0 0 1px var(--FocusStrokeColorInnerBrush, var(--app-bg)); }
@media (forced-colors: active) { .win-hyperlink-button { text-decoration: underline; } }
</style>
