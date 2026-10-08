<template>
  <button ref="element" v-bind="hostAttrs" type="button" class="win-dropdown-button"
    :class="[attrs.class, { 'is-pressed': IsPressed, 'system-focus': UseSystemFocusVisuals, 'win-theme-scope': RequestedTheme === 'Light' || RequestedTheme === 'Dark', 'theme-light': RequestedTheme === 'Light', 'theme-dark': RequestedTheme === 'Dark' }]"
    :style="hostStyle" :disabled="!IsEnabled" :tabindex="IsTabStop ? undefined : -1"
    :aria-haspopup="Flyout ? 'menu' : undefined" :aria-expanded="Flyout ? isFlyoutOpen : undefined"
    @click="input.onNativeClick" @pointerdown="input.onPointerPressed" @pointermove="input.onPointerMoved"
    @pointerup="input.onPointerReleased" @pointercancel="input.onPointerCanceled" @lostpointercapture="input.onPointerCaptureLost"
    @pointerenter="input.onPointerEntered" @pointerleave="input.onPointerExited"
    @keydown="input.onKeyDown" @keyup="input.onKeyUp" @focus="onGotFocus" @blur="onLostFocus" @contextmenu="onContextRequested">
    <Grid class="win-dropdown-root-grid" Background="{x:Bind RootBackground}" Padding="{x:Bind Padding}"
      BorderBrush="{x:Bind RootBorderBrush}" BorderThickness="{x:Bind BorderThickness}"
      CornerRadius="{x:Bind CornerRadius}" BackgroundSizing="{x:Bind BackgroundSizing}">
      <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" /></Grid.ColumnDefinitions>
      <ContentPresenter class="win-dropdown-content-presenter" Content="{x:Bind Content}" ContentTemplate="{x:Bind ContentTemplate}"
        ContentTransitions="{x:Bind ContentTransitions}" HorizontalContentAlignment="{x:Bind HorizontalContentAlignment}"
        VerticalContentAlignment="{x:Bind VerticalContentAlignment}" AutomationProperties.AccessibilityView="Raw">
        <ContentOutlet />
      </ContentPresenter>
      <AnimatedIcon class="win-dropdown-chevron" Grid.Column="1" Margin="8,0,0,0" Width="12" Height="12"
        Foreground="{x:Bind ChevronForeground}" AutomationProperties.AccessibilityView="Raw">
        <AnimatedChevronDownSmallVisualSource />
        <AnimatedIcon.FallbackIconSource><FontIconSource FontSize="8" FontFamily="{ThemeResource SymbolThemeFontFamily}" Glyph="&#xE96E;" IsTextScaleFactorEnabled="False" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Grid>
    <AttachedOutlet v-if="propertyNodes.attached.length" />
  </button>
  <FlyoutOutlet v-if="flyoutNodes.length" />
</template>

<script lang="ts">
import { brushProperty } from './brushProperties'
import { buttonContentProperty } from './buttonContentRuntime'
import { DropDownButtonContent, DropDownButtonFlyout, DropDownButtonKeyboardAccelerators } from './DropDownButtonProperties'
export default {
  Content: DropDownButtonContent, Flyout: DropDownButtonFlyout, KeyboardAccelerators: DropDownButtonKeyboardAccelerators,
  ContentTemplate: buttonContentProperty('DropDownButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('DropDownButton', 'ContentTransitions'),
  Resources: buttonContentProperty('DropDownButton', 'Resources'), Background: brushProperty('DropDownButton', 'Background')
}
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, onScopeDispose, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type CSSProperties, type VNode } from 'vue'
import Grid from './Grid.vue'
import ContentPresenter from './ContentPresenter.vue'
import AnimatedIcon from './AnimatedIcon.vue'
import { FontIconSource } from './IconSource'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
import { useAnimatedIconInput } from './animatedIconInput'
import { getDropDownButtonProperty } from './DropDownButtonProperties'
import { getButtonContentProperty, useButtonContent } from './buttonContentRuntime'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { getToolTipServiceProperty } from './ToolTipServiceProperties'
import { alignment, boolValue, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'
import { useUICommand } from './uiCommandRuntime'
import { useDropDownButtonInput } from './dropDownButtonRuntime'

defineOptions({ name: 'DropDownButton', inheritAttrs: false })
const props = defineProps({
  Content: { type: null, default: undefined }, ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined }, Flyout: { type: null, default: null },
  Command: { type: [Object, String], default: undefined }, CommandParameter: { default: undefined },
  IsEnabled: { type: [Boolean, String], default: true }, IsTabStop: { type: [Boolean, String], default: true }, ClickMode: { type: String, default: 'Release' },
  RequestedTheme: { type: String, default: 'Default' }, Visibility: { type: String, default: 'Visible' },
  Background: { type: [String, Object], default: '' }, Foreground: { type: String, default: '' }, BorderBrush: { type: String, default: '' },
  BackgroundSizing: { type: String, default: 'InnerBorderEdge' }, BorderThickness: { type: [String, Number], default: 1 }, CornerRadius: { type: [String, Number], default: 4 }, Padding: { type: [String, Number], default: '11,5,11,6' }, Margin: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' },
  HorizontalContentAlignment: { type: String, default: 'Center' }, VerticalContentAlignment: { type: String, default: 'Center' },
  FontFamily: { type: String, default: '{ThemeResource ContentControlThemeFontFamily}' }, FontSize: { type: [String, Number], default: 14 }, FontWeight: { type: String, default: 'Normal' },
  UseSystemFocusVisuals: { type: [Boolean, String], default: true }, FocusVisualMargin: { type: [String, Number], default: -3 }
})
const emit = defineEmits(['Click', 'GotFocus', 'LostFocus', 'KeyDown', 'KeyUp', 'ContextRequested', 'PointerEntered', 'PointerExited', 'PointerMoved', 'PointerPressed', 'PointerReleased', 'PointerCanceled', 'PointerCaptureLost'])
const instance = getCurrentInstance(), attrs = useAttrs(), slots = useSlots()
const element = ref<HTMLButtonElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const { ContentTemplate, ContentTransitions, renderTemplate } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance)
const Command = useUICommand(() => resolve(props.Command))
const CommandParameter = computed(() => resolve(props.CommandParameter))
const localContent = shallowRef<unknown>(undefined)
const sourceContent = computed(() => props.Content === undefined ? Command.value?.Label ?? '' : resolve(props.Content))
const Content = computed({ get: () => localContent.value === undefined ? sourceContent.value : localContent.value, set: value => { localContent.value = value; updateXamlBinding(props.Content, value, instance) } })
watch(sourceContent, () => { localContent.value = undefined })
const property = (name: 'IsEnabled' | 'RequestedTheme') => {
  const source = computed(() => resolve(props[name])), local = shallowRef<unknown>(undefined)
  watch(source, () => { local.value = undefined })
  return computed({ get: () => local.value === undefined ? source.value : local.value, set: value => { local.value = value; updateXamlBinding(props[name], value, instance) } })
}
const EnabledProperty = property('IsEnabled'), RequestedTheme = property('RequestedTheme')
const IsEnabled = computed({ get: () => boolValue(EnabledProperty.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: value => { EnabledProperty.value = boolValue(value) } })
const IsTabStop = computed(() => boolValue(resolve(props.IsTabStop))), UseSystemFocusVisuals = computed(() => boolValue(resolve(props.UseSystemFocusVisuals)))
const ClickMode = computed(() => String(resolve(props.ClickMode)))
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
const propertyNodes = computed(() => {
  const result: { content: VNode[]; flyout: VNode[]; attached: VNode[]; keyboardAccelerators: VNode[]; resources: VNode[] } = { content: [], flyout: [], attached: [], keyboardAccelerators: [], resources: [] }
  const collect = (nodes: VNode[]) => { for (const node of nodes) {
    if (node.type === Comment || node.type === Text && !String(node.children ?? '').trim()) continue
    if (node.type === Fragment) { collect(childrenOf(node)); continue }
    if (isBrushProperty(node)) continue
    const contentProperty = getButtonContentProperty(node)
    if (contentProperty) { if (contentProperty === 'Resources') result.resources.push(...childrenOf(node)); continue }
    const propertyName = getDropDownButtonProperty(node)
    if (propertyName) result[propertyName].push(...childrenOf(node))
    else if (getToolTipServiceProperty(node)) result.attached.push(node)
    else result.content.push(node)
  } }
  collect(slots.default?.() ?? [])
  return result
})
const localResources = computed(() => {
  const collect = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
    const type = node.type as { name?: string; __name?: string } | string
    return node.type === Fragment || (typeof type === 'string' ? type : type?.name ?? type?.__name) === 'ResourceDictionary' ? collect(childrenOf(node)) : [node]
  })
  return Object.fromEntries(collect(propertyNodes.value.resources).filter(node => node.props?.['x:Key']).map(node => [node.props!['x:Key'], node]))
})
const sourceFlyout = computed(() => {
  const key = typeof props.Flyout === 'string' ? props.Flyout.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : undefined
  return key ? localResources.value[key] ?? inheritedResources[key] ?? resolveXamlResourceObject(key, instance) : resolve(props.Flyout)
})
const localFlyout = shallowRef<unknown>(undefined), flyoutController = shallowRef<any>(null), flyoutOpened = ref(false)
const flyoutNodes = computed(() => {
  if (localFlyout.value === undefined && propertyNodes.value.flyout.length) return propertyNodes.value.flyout
  const source = localFlyout.value === undefined ? sourceFlyout.value : localFlyout.value
  return isVNode(source) ? [source] : []
})
const Flyout = computed({ get: () => flyoutController.value ?? (localFlyout.value === undefined ? isVNode(sourceFlyout.value) ? null : sourceFlyout.value : isVNode(localFlyout.value) ? null : localFlyout.value),
  set: value => { Flyout.value?.Hide?.(); flyoutController.value = null; localFlyout.value = value; flyoutOpened.value = false; updateXamlBinding(props.Flyout, value, instance) } })
watch(sourceFlyout, (_next, previous) => { (flyoutController.value ?? previous)?.Hide?.(); flyoutController.value = null; localFlyout.value = undefined; flyoutOpened.value = false })
const isFlyoutOpen = computed(() => { const opened = flyoutOpened.value; return typeof Flyout.value?.IsOpen === 'boolean' ? Flyout.value.IsOpen : opened })
let detachFlyoutEvents = () => {}
watch(Flyout, flyout => {
  detachFlyoutEvents()
  const opened = () => { flyoutOpened.value = true }, closed = () => { flyoutOpened.value = false }
  flyout?.addEventListener?.('Opened', opened)
  flyout?.addEventListener?.('Closed', closed)
  detachFlyoutEvents = () => { flyout?.removeEventListener?.('Opened', opened); flyout?.removeEventListener?.('Closed', closed) }
  flyoutOpened.value = Boolean(flyout?.IsOpen)
}, { immediate: true, flush: 'sync' })
onScopeDispose(() => detachFlyoutEvents())
provide('buttonFlyoutAnchor', null)
provide('buttonFlyoutController', null)
const FlyoutOutlet = defineComponent({ setup: () => () => h(Fragment, normalizeXamlNodes(flyoutNodes.value, instance).map(node => cloneVNode(node, {
  ref: (api: unknown) => { flyoutController.value = api }, onOpened: () => { flyoutOpened.value = true }, onClosed: () => { flyoutOpened.value = false }
}, true))) })
const ContentOutlet = defineComponent({ setup: () => () => {
  const templated = renderTemplate(Content.value)
  if (templated) return templated
  const nodes = localContent.value === undefined ? normalizeXamlNodes(propertyNodes.value.content, instance) : []
  if (nodes.length) return nodes.every(node => node.type === Text) ? h('span', { class: 'win-button-default-text' }, nodes.map(node => String(node.children ?? '')).join('')) : h(Fragment, nodes)
  return isVNode(Content.value) ? h(Fragment, normalizeXamlNodes([Content.value], instance)) : typeof Content.value === 'string' || typeof Content.value === 'number' ? h('span', { class: 'win-button-default-text' }, String(Content.value)) : null
} })
const AttachedOutlet = defineComponent({ setup: () => () => h(Fragment, propertyNodes.value.attached) })
const glyphInput = useAnimatedIconInput(false, state => state === 'Disabled' ? 'Normal' : state)
watch(element, value => glyphInput.Attach(value), { flush: 'post' })
const raiseEvent = (name: string, event: Event, extra: Record<string, unknown> = {}) => {
  const args = { OriginalSource: api, OriginalEvent: event, Handled: false, ...extra }
  const listener = instance?.vnode.props?.[`on${name}`]
  if (name === 'Click') {
    for (const callback of Array.isArray(listener) ? listener : [listener]) if (typeof callback === 'function') callback(api, args)
  } else emit(name as 'Click', api, args)
  if (!listener) resolveXamlHandler(attrs[name], instance)?.(api, args)
  if (args.Handled) { event.preventDefault(); event.stopPropagation() }
  return args
}
const invoke = (event: Event) => {
  if (!IsEnabled.value || resolve(props.Visibility) === 'Collapsed') return
  raiseEvent('Click', event)
  if (Command.value?.CanExecute?.(CommandParameter.value) ?? true) Command.value?.Execute(CommandParameter.value)
  void Flyout.value?.ShowAt?.(element.value)
}
const input = useDropDownButtonInput(element, IsEnabled, ClickMode, invoke, (name, event, extra) => raiseEvent(name, event, extra).Handled, glyphInput)
const { IsPressed, IsPointerOver } = input
const exposedContent = computed({ get: () => localContent.value === undefined ? propertyNodes.value.content[0] ?? Content.value : Content.value, set: value => { Content.value = value } })
const api = proxyRefs({ Element: element, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Content: exposedContent, ContentTemplate, ContentTransitions, IsEnabled, RequestedTheme, Command, CommandParameter, Flyout, IsPressed, IsPointerOver, Focus: () => { if (!IsEnabled.value) return false; element.value?.focus(); return Boolean(element.value) } })
defineExpose(api)
const RootBackground = computed(() => backgroundBrush.value.value && !IsPressed.value && !IsPointerOver.value && IsEnabled.value ? backgroundBrush.value.value : !IsEnabled.value ? 'var(--ButtonBackgroundDisabled)' : IsPressed.value ? 'var(--ButtonBackgroundPressed)' : IsPointerOver.value ? 'var(--ButtonBackgroundPointerOver)' : 'var(--ButtonBackground)')
const RootBorderBrush = computed(() => !IsEnabled.value ? 'var(--ButtonBorderBrushDisabled)' : IsPressed.value ? 'var(--ButtonBorderBrushPressed)' : IsPointerOver.value ? 'var(--ButtonBorderBrushPointerOver)' : resolve(props.BorderBrush) || 'var(--ButtonBorderBrush)')
const Foreground = computed(() => !IsEnabled.value ? 'var(--ButtonForegroundDisabled)' : IsPressed.value ? 'var(--ButtonForegroundPressed)' : IsPointerOver.value ? 'var(--ButtonForegroundPointerOver)' : resolve(props.Foreground) || 'var(--ButtonForeground)')
const ChevronForeground = computed(() => !IsEnabled.value ? 'var(--ButtonForegroundDisabled)' : IsPressed.value ? 'var(--DropDownButtonForegroundSecondaryPressed)' : IsPointerOver.value ? 'var(--DropDownButtonForegroundSecondaryPointerOver)' : 'var(--DropDownButtonForegroundSecondary)')
const Padding = computed(() => resolve(props.Padding)), BorderThickness = computed(() => resolve(props.BorderThickness)), CornerRadius = computed(() => resolve(props.CornerRadius)), BackgroundSizing = computed(() => resolve(props.BackgroundSizing))
const HorizontalContentAlignment = computed(() => resolve(props.HorizontalContentAlignment)), VerticalContentAlignment = computed(() => resolve(props.VerticalContentAlignment))
const AnimatedChevronDownSmallVisualSource = animatedIconVisualSourceComponents.AnimatedChevronDownSmallVisualSource
const hostAttrs = computed(() => {
  const rest = { ...attrs }
  for (const name of ['class', 'style', 'Click', 'GotFocus', 'LostFocus', 'KeyDown', 'KeyUp', 'ContextRequested', 'PointerEntered', 'PointerExited', 'PointerMoved', 'PointerPressed', 'PointerReleased', 'PointerCanceled', 'PointerCaptureLost']) delete rest[name]
  const automationName = resolve(rest['AutomationProperties.Name']); delete rest['AutomationProperties.Name']
  if (automationName) rest['aria-label'] = String(automationName)
  const tooltip = resolve(rest['ToolTipService.ToolTip']) || Command.value?.Description; delete rest['ToolTipService.ToolTip']
  if (tooltip) rest['tooltipservice.tooltip'] = String(tooltip)
  return rest
})
const hostStyle = computed(() => {
  const style: CSSProperties = { margin: xamlThickness(resolve(props.Margin)), justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'), color: Foreground.value as CSSProperties['color'], fontFamily: resolve(props.FontFamily) as CSSProperties['fontFamily'], fontSize: cssLength(resolve(props.FontSize)), fontWeight: resolve(props.FontWeight) === 'SemiBold' ? 600 : resolve(props.FontWeight) as CSSProperties['fontWeight'], outlineOffset: cssLength(resolve(props.FocusVisualMargin)), borderRadius: xamlThickness(CornerRadius.value), '--DropDownButtonBorderBrushCurrent': RootBorderBrush.value as CSSProperties['--DropDownButtonBorderBrushCurrent'], '--DropDownButtonBorderThickness': xamlThickness(BorderThickness.value) }
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) if (resolve(props[name]) !== '') style[(name[0].toLowerCase() + name.slice(1)) as 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight'] = cssLength(resolve(props[name]))
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  return [attrs.style, style]
})
const onGotFocus = (event: FocusEvent) => raiseEvent('GotFocus', event)
const onLostFocus = (event: FocusEvent) => { input.clearPressed(); glyphInput.LostFocus(event); raiseEvent('LostFocus', event) }
const onContextRequested = (event: MouseEvent) => {
  if (!IsEnabled.value || !attrs.ContextRequested && !instance?.vnode.props?.onContextRequested) return
  raiseEvent('ContextRequested', event, { TryGetPosition: (relativeTo?: HTMLElement | { Element?: HTMLElement }) => { const target = relativeTo instanceof HTMLElement ? relativeTo : relativeTo?.Element; const bounds = target?.getBoundingClientRect(); return { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) } } }); event.preventDefault()
}
const onAccelerator = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.repeat || !IsEnabled.value) return
  for (const node of propertyNodes.value.keyboardAccelerators) {
    const definition = node.props ?? {}, key = String(resolve(definition.Key) ?? ''), modifiers = String(resolve(definition.Modifiers) ?? 'None').split(/[ ,]+/)
    if (key.toLowerCase() === event.key.toLowerCase() && event.ctrlKey === modifiers.includes('Control') && event.altKey === modifiers.includes('Menu') && event.shiftKey === modifiers.includes('Shift') && event.metaKey === modifiers.includes('Windows') && boolValue(resolve(definition.IsEnabled ?? true))) { event.preventDefault(); invoke(event); return }
  }
  if (Command.value?.MatchesKeyboardEvent?.(event)) { event.preventDefault(); invoke(event) }
}
watch(IsEnabled, enabled => { glyphInput.Refresh(); if (!enabled) { input.clearPressed(); Flyout.value?.Hide?.() } })
onMounted(() => document.addEventListener('keydown', onAccelerator))
onBeforeUnmount(() => { document.removeEventListener('keydown', onAccelerator); Flyout.value?.Hide?.() })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Content, ContentTemplate, ContentTransitions, RootBackground, RootBorderBrush, Padding, BorderThickness, CornerRadius, BackgroundSizing, HorizontalContentAlignment, VerticalContentAlignment, ChevronForeground })
</script>

<style>
.win-dropdown-button { position: relative; display: inline-grid; box-sizing: border-box; min-width: 0; max-width: 100%; min-height: 0; margin: 0; border: 0; padding: 0; background: transparent; font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif); font-size: 14px; font-weight: normal; line-height: 19px; user-select: none; outline: none; cursor: default; }
.win-dropdown-root-grid { width: 100%; height: 100%; min-width: 0; min-height: 0; border-color: transparent !important; overflow: hidden; transition: background-color 83ms linear; }
.win-dropdown-content-presenter { min-width: 0; max-width: 100%; min-height: 0; color: inherit; }
.win-dropdown-chevron { pointer-events: none; align-self: center !important; }
.win-dropdown-button::after { content: ""; position: absolute; inset: 0; padding: var(--DropDownButtonBorderThickness, 1px); border-radius: inherit; background: var(--DropDownButtonBorderBrushCurrent); pointer-events: none; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; }
.win-dropdown-button.system-focus:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); box-shadow: inset 0 0 0 1px var(--FocusStrokeColorInnerBrush, var(--app-bg)); }
.win-dropdown-button:disabled { pointer-events: none; }
</style>
