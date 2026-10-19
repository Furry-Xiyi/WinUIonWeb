<template>
  <Button ref="buttonControl" v-bind="hostAttrs" class="win-dropdown-button" :class="[attrs.class]" :style="attrs.style"
    :IsEnabled="IsEnabled" :IsTabStop="IsTabStop" :ClickMode="ClickMode" :RequestedTheme="RequestedTheme"
    :Visibility="resolveString(props.Visibility)" :Background="resolvedBackground" :Foreground="resolveString(props.Foreground)"
    :BorderBrush="resolveString(props.BorderBrush)" :BorderThickness="BorderThickness" :CornerRadius="CornerRadius"
    :Padding="resolveString(props.Padding)" :BackgroundSizing="BackgroundSizing" :Margin="resolveString(props.Margin)"
    :Width="resolveLength(props.Width)" :Height="resolveLength(props.Height)" :MinWidth="resolveLength(props.MinWidth)"
    :MinHeight="resolveLength(props.MinHeight)" :MaxWidth="resolveLength(props.MaxWidth)" :MaxHeight="resolveLength(props.MaxHeight)"
    :HorizontalAlignment="resolveString(props.HorizontalAlignment)" :VerticalAlignment="resolveString(props.VerticalAlignment)"
    :HorizontalContentAlignment="HorizontalContentAlignment" :VerticalContentAlignment="VerticalContentAlignment"
    :FontFamily="resolveString(props.FontFamily)" :FontSize="resolveLength(props.FontSize)" :FontWeight="resolveString(props.FontWeight)"
    :UseSystemFocusVisuals="UseSystemFocusVisuals" :FocusVisualMargin="resolveLength(props.FocusVisualMargin)"
    :aria-haspopup="Flyout ? 'menu' : undefined" :aria-expanded="Flyout ? isFlyoutOpen : undefined"
    :Command="Command" :CommandParameter="CommandParameter" :Flyout="FlyoutForButton"
    @Click="onButtonClick" @GotFocus="forwardButtonEvent('GotFocus')" @LostFocus="forwardButtonEvent('LostFocus')"
    @KeyDown="forwardButtonEvent('KeyDown')" @KeyUp="forwardButtonEvent('KeyUp')"
    @PointerEntered="forwardButtonEvent('PointerEntered')" @PointerExited="forwardButtonEvent('PointerExited')"
    @PointerMoved="forwardButtonEvent('PointerMoved')" @PointerPressed="forwardButtonEvent('PointerPressed')"
    @PointerReleased="forwardButtonEvent('PointerReleased')" @PointerCanceled="forwardButtonEvent('PointerCanceled')"
    @PointerCaptureLost="forwardButtonEvent('PointerCaptureLost')" @ContextRequested="contextRequestedListener">
    <Grid class="win-dropdown-root-grid">
      <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" /></Grid.ColumnDefinitions>
      <ContentPresenter class="win-dropdown-content-presenter" :Content="Content" :ContentTemplate="ContentTemplate"
        :ContentTransitions="ContentTransitions" :HorizontalContentAlignment="HorizontalContentAlignment"
        :VerticalContentAlignment="VerticalContentAlignment" AutomationProperties.AccessibilityView="Raw">
        <ContentOutlet />
      </ContentPresenter>
      <AnimatedIcon class="win-dropdown-chevron" Grid.Column="1" Margin="8,0,0,0" Width="12" Height="12"
        AutomationProperties.AccessibilityView="Raw">
        <AnimatedChevronDownSmallVisualSource />
        <AnimatedIcon.FallbackIconSource><FontIconSource FontSize="8" FontFamily="{ThemeResource SymbolThemeFontFamily}" Glyph="&#xE96E;" IsTextScaleFactorEnabled="False" /></AnimatedIcon.FallbackIconSource>
      </AnimatedIcon>
    </Grid>
  </Button>
  <AttachedOutlet v-if="propertyNodes.attached.length" />
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
import { Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type VNode } from 'vue'
import Grid from './Grid.vue'
import ContentPresenter from './ContentPresenter.vue'
import AnimatedIcon from './AnimatedIcon.vue'
import { FontIconSource } from './IconSource'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
import Button from './Button.vue'
import { getDropDownButtonProperty } from './DropDownButtonProperties'
import { getButtonContentProperty, useButtonContent } from './buttonContentRuntime'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { getToolTipServiceProperty } from './ToolTipServiceProperties'
import { boolValue } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'
import { useUICommand } from './uiCommandRuntime'

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
const buttonControl = ref<any>(null)
const element = computed<HTMLButtonElement | null>(() => buttonControl.value?.Element ?? null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const resolveString = (value: unknown): string | undefined => resolve(value) as string | undefined
const resolveLength = (value: unknown): string | number | undefined => resolve(value) as string | number | undefined
const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const { ContentTemplate, ContentTransitions, renderTemplate } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance)
const resolvedBackground = computed(() => backgroundBrush.value.value as string | Record<string, any> | undefined)
const Command = useUICommand(() => resolve(props.Command))
const CommandParameter = computed(() => resolve(props.CommandParameter))
const localContent = shallowRef<unknown>(undefined)
const sourceContent = computed(() => props.Content === undefined ? Command.value?.Label ?? '' : resolve(props.Content))
const Content = computed({ get: () => localContent.value === undefined ? sourceContent.value : localContent.value, set: value => { localContent.value = value; updateXamlBinding(props.Content, value, instance) } })
watch(sourceContent, () => { localContent.value = undefined })
const property = <T>(name: 'IsEnabled' | 'RequestedTheme') => {
  const source = computed(() => resolve(props[name])), local = shallowRef<unknown>(undefined)
  watch(source, () => { local.value = undefined })
  return computed<T>({ get: () => (local.value === undefined ? source.value : local.value) as T, set: value => { local.value = value; updateXamlBinding(props[name], value, instance) } })
}
const EnabledProperty = property<boolean | string>('IsEnabled'), RequestedTheme = property<string>('RequestedTheme')
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
const localFlyout = shallowRef<unknown>(undefined)
const FlyoutForButton = computed(() => {
  if (localFlyout.value !== undefined) return localFlyout.value
  if (propertyNodes.value.flyout.length) return h(Fragment, normalizeXamlNodes(propertyNodes.value.flyout, instance))
  return sourceFlyout.value
})
const Flyout = computed({ get: () => buttonControl.value?.Flyout ?? (isVNode(FlyoutForButton.value) ? null : FlyoutForButton.value),
  set: value => { Flyout.value?.Hide?.(); localFlyout.value = value; updateXamlBinding(props.Flyout, value, instance) } })
const isFlyoutOpen = computed(() => Boolean(Flyout.value?.IsOpen))
const ContentOutlet = defineComponent({ setup: () => () => {
  const templated = renderTemplate(Content.value)
  if (templated) return templated
  const nodes = localContent.value === undefined ? normalizeXamlNodes(propertyNodes.value.content, instance) : []
  if (nodes.length) return nodes.every(node => node.type === Text) ? h('span', { class: 'win-button-default-text' }, nodes.map(node => String(node.children ?? '')).join('')) : h(Fragment, nodes)
  return isVNode(Content.value) ? h(Fragment, normalizeXamlNodes([Content.value], instance)) : typeof Content.value === 'string' || typeof Content.value === 'number' ? h('span', { class: 'win-button-default-text' }, String(Content.value)) : null
} })
const AttachedOutlet = defineComponent({ setup: () => () => h(Fragment, propertyNodes.value.attached) })
const raiseEvent = (name: string, event: Event, extra: Record<string, unknown> = {}) => {
  const args = Object.assign(extra, { OriginalSource: api, OriginalEvent: event, Handled: extra.Handled ?? false })
  const listener = instance?.vnode.props?.[`on${name}`]
  if (name === 'Click') {
    for (const callback of Array.isArray(listener) ? listener : [listener]) if (typeof callback === 'function') callback(api, args)
  } else emit(name as 'Click', api, args)
  if (!listener) resolveXamlHandler(attrs[name], instance)?.(api, args)
  if (args.Handled) { event.preventDefault(); event.stopPropagation() }
  return args
}
const onButtonClick = (_sender: unknown, args: Record<string, any>) => raiseEvent('Click', args.OriginalEvent, args)
const forwardButtonEvent = (name: string) => (_sender: unknown, args: Record<string, any>) => raiseEvent(name, args.OriginalEvent, args)
const contextRequestedListener = computed(() => attrs.ContextRequested || instance?.vnode.props?.onContextRequested
  ? forwardButtonEvent('ContextRequested') : undefined)
const IsPressed = computed(() => Boolean(buttonControl.value?.IsPressed))
const IsPointerOver = computed(() => Boolean(buttonControl.value?.IsPointerOver))
const exposedContent = computed({ get: () => localContent.value === undefined ? propertyNodes.value.content[0] ?? Content.value : Content.value, set: value => { Content.value = value } })
const api = proxyRefs({ Element: element, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Content: exposedContent, ContentTemplate, ContentTransitions, IsEnabled, RequestedTheme, Command, CommandParameter, Flyout, IsPressed, IsPointerOver, Focus: () => { if (!IsEnabled.value) return false; element.value?.focus(); return Boolean(element.value) } })
defineExpose(api)
const Padding = computed(() => resolveString(props.Padding)), BorderThickness = computed(() => resolveLength(props.BorderThickness)), CornerRadius = computed(() => resolveLength(props.CornerRadius)), BackgroundSizing = computed(() => resolveString(props.BackgroundSizing))
const HorizontalContentAlignment = computed(() => resolveString(props.HorizontalContentAlignment)), VerticalContentAlignment = computed(() => resolveString(props.VerticalContentAlignment))
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
const invoke = () => {
  if (!IsEnabled.value || resolve(props.Visibility) === 'Collapsed') return
  if (element.value) element.value.click()
  else void Flyout.value?.ShowAt?.(null)
}
const onAccelerator = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.repeat || !IsEnabled.value) return
  // The embedded Button already executes command accelerators and opens its Flyout.
  if (Command.value?.MatchesKeyboardEvent?.(event)) return
  for (const node of propertyNodes.value.keyboardAccelerators) {
    const definition = node.props ?? {}, key = String(resolve(definition.Key) ?? ''), modifiers = String(resolve(definition.Modifiers) ?? 'None').split(/[ ,]+/)
    if (key.toLowerCase() === event.key.toLowerCase() && event.ctrlKey === modifiers.includes('Control') && event.altKey === modifiers.includes('Menu') && event.shiftKey === modifiers.includes('Shift') && event.metaKey === modifiers.includes('Windows') && boolValue(resolve(definition.IsEnabled ?? true))) { event.preventDefault(); invoke(); return }
  }
}
watch(IsEnabled, enabled => { if (!enabled) Flyout.value?.Hide?.() })
onMounted(() => document.addEventListener('keydown', onAccelerator))
onBeforeUnmount(() => { document.removeEventListener('keydown', onAccelerator); Flyout.value?.Hide?.() })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), Content, ContentTemplate, ContentTransitions, Padding, BorderThickness, CornerRadius, BackgroundSizing, HorizontalContentAlignment, VerticalContentAlignment })
</script>

<style>
.win-dropdown-root-grid { width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.win-dropdown-content-presenter { min-width: 0; max-width: 100%; min-height: 0; color: inherit; }
.win-dropdown-chevron { pointer-events: none; align-self: center !important; color: var(--DropDownButtonForegroundSecondary); }
.win-dropdown-button:hover .win-dropdown-chevron { color: var(--DropDownButtonForegroundSecondaryPointerOver); }
.win-dropdown-button:active .win-dropdown-chevron,
.win-dropdown-button.is-pressed .win-dropdown-chevron { color: var(--DropDownButtonForegroundSecondaryPressed); }
.win-dropdown-button:disabled .win-dropdown-chevron { color: var(--ButtonForegroundDisabled); }
</style>
