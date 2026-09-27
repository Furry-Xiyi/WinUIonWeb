<template>
  <div ref="root" v-bind="hostAttrs" class="win-split-button" :class="[attrs.class, { 'is-open': isOpen, 'is-disabled': !IsEnabled, 'keyboard-pressed': keyPressed, 'system-focus': boolValue(resolve(props.UseSystemFocusVisuals)), 'win-theme-scope': RequestedTheme === 'Light' || RequestedTheme === 'Dark', 'theme-light': RequestedTheme === 'Light', 'theme-dark': RequestedTheme === 'Dark' }]" :style="hostStyle"
    role="button" :tabindex="IsEnabled && IsTabStop ? 0 : -1" :aria-disabled="!IsEnabled || undefined" :aria-expanded="isOpen"
    @keydown="onKeyDown" @keyup="onKeyUp" @blur="clearKey">
    <Grid class="win-split-root-grid" Background="Transparent" CornerRadius="{x:Bind CornerRadius}">
      <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*" MinWidth="35" />
        <ColumnDefinition Width="1" />
        <ColumnDefinition Width="35" />
      </Grid.ColumnDefinitions>
      <Grid class="win-split-primary-background" Grid.ColumnSpan="2" Background="{x:Bind PrimaryBackground}" />
      <Grid class="win-split-divider" Grid.Column="1" Background="{x:Bind DividerBackground}" />
      <Grid class="win-split-secondary-background" Grid.Column="2" Background="{x:Bind SecondaryBackground}" />
      <Button ref="primaryButton" class="win-split-main-button" Grid.Column="0"
        IsEnabled="{x:Bind IsEnabled}" IsTabStop="False" Background="Transparent" BorderBrush="Transparent" BorderThickness="0"
        Foreground="{x:Bind PrimaryForeground}" HorizontalAlignment="Stretch" VerticalAlignment="Stretch"
        HorizontalContentAlignment="{x:Bind HorizontalContentAlignment}" VerticalContentAlignment="{x:Bind VerticalContentAlignment}"
        Padding="{x:Bind Padding}" FontFamily="{x:Bind FontFamily}" FontSize="{x:Bind FontSize}" FontWeight="{x:Bind FontWeight}"
        Content="{x:Bind Content}" ContentTemplate="{x:Bind ContentTemplate}" ContentTransitions="{x:Bind ContentTransitions}"
        Click="OnPrimaryClick" PointerEntered="OnPrimaryEntered" PointerExited="OnPrimaryExited" PointerMoved="OnPrimaryMoved" PointerPressed="OnPrimaryPressed" PointerReleased="OnPrimaryReleased" PointerCanceled="OnPrimaryReleased" PointerCaptureLost="OnPrimaryReleased">
        <MainOutlet />
      </Button>
      <Button ref="secondaryButton" class="win-split-secondary-button" Grid.Column="2"
        IsEnabled="{x:Bind IsEnabled}" IsTabStop="False" Background="Transparent" BorderBrush="Transparent" BorderThickness="0"
        Foreground="{x:Bind SecondaryForeground}" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" HorizontalContentAlignment="Stretch" VerticalContentAlignment="Stretch"
        Padding="0,0,12,0" Click="OnSecondaryClick" PointerEntered="OnSecondaryEntered" PointerExited="OnSecondaryExited" PointerMoved="OnSecondaryMoved" PointerPressed="OnSecondaryPressed" PointerReleased="OnSecondaryReleased" PointerCanceled="OnSecondaryReleased" PointerCaptureLost="OnSecondaryReleased">
        <Button.Content>
          <AnimatedIcon Height="12" Width="12" VerticalAlignment="Center" HorizontalAlignment="Right" AutomationProperties.AccessibilityView="Raw">
            <AnimatedChevronDownSmallVisualSource />
            <AnimatedIcon.FallbackIconSource>
              <FontIconSource FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="8" Glyph="&#xE96E;" IsTextScaleFactorEnabled="False" />
            </AnimatedIcon.FallbackIconSource>
          </AnimatedIcon>
        </Button.Content>
      </Button>
      <Grid class="win-split-primary-border" Grid.Column="0" BorderBrush="{x:Bind PrimaryBorderBrush}" BorderThickness="1,1,0,1" CornerRadius="4,0,0,4" />
      <Grid class="win-split-secondary-border" Grid.Column="2" BorderBrush="{x:Bind SecondaryBorderBrush}" BorderThickness="0,1,1,1" CornerRadius="0,4,4,0" />
    </Grid>
    <FlyoutOutlet v-if="flyoutNodes.length" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buttonContentProperty } from './buttonContentRuntime'
export const SplitButtonFlyout = defineComponent({ name: 'SplitButton.Flyout', __splitButtonProperty: 'flyout', setup() { return () => null } })
export const SplitButtonContent = defineComponent({ name: 'SplitButton.Content', __splitButtonProperty: 'content', setup() { return () => null } })
export default { Flyout: SplitButtonFlyout, Content: SplitButtonContent, ContentTemplate: buttonContentProperty('SplitButton', 'ContentTemplate'), ContentTransitions: buttonContentProperty('SplitButton', 'ContentTransitions'), Resources: buttonContentProperty('SplitButton', 'Resources') }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type VNode } from 'vue'
import Grid from './Grid.vue'
import Button from './Button.vue'
import AnimatedIcon from './AnimatedIcon.vue'
import { FontIconSource } from './IconSource'
import { animatedIconVisualSourceComponents } from './animatedIconVisuals'
import { boolValue, alignment, cssLength, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { useUICommand } from './uiCommandRuntime'
import { getButtonContentProperty, useButtonContent } from './buttonContentRuntime'

defineOptions({ name: 'SplitButton', inheritAttrs: false })
const props = defineProps({
  Content: { type: null, default: '' }, Flyout: { type: null, default: undefined },
  ContentTemplate: { type: null, default: undefined }, ContentTransitions: { type: null, default: undefined },
  Command: { type: [Object, String], default: undefined }, CommandParameter: { default: undefined },
  IsEnabled: { type: [Boolean, String], default: true }, IsTabStop: { type: [Boolean, String], default: true },
  Background: { type: String, default: '' }, Foreground: { type: String, default: '' }, BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: 1 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '11,6,11,7' }, Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Left' }, VerticalAlignment: { type: String, default: 'Center' }, HorizontalContentAlignment: { type: String, default: 'Center' }, VerticalContentAlignment: { type: String, default: 'Center' },
  FontFamily: { type: String, default: '{ThemeResource ContentControlThemeFontFamily}' }, FontSize: { type: [String, Number], default: 14 }, FontWeight: { type: String, default: 'Normal' },
  CornerRadius: { type: [String, Number], default: 4 }, UseSystemFocusVisuals: { type: [Boolean, String], default: true }, FocusVisualMargin: { type: [String, Number], default: -1 },
  Visibility: { type: String, default: 'Visible' }, RequestedTheme: { type: String, default: 'Default' }
})
const emit = defineEmits(['Click'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
provide('buttonFlyoutAnchor', null)
provide('buttonFlyoutController', null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const { ContentTemplate, ContentTransitions, renderTemplate } = useButtonContent(props, () => slots.default?.() ?? [], instance)
const root = ref<HTMLElement | null>(null)
const primaryButton = ref<any>(null)
const secondaryButton = ref<any>(null)
const attachedFlyout = ref<any>(null)
const isOpen = ref(false)
const keyPressed = ref('')
const primaryOver = ref(false)
const secondaryOver = ref(false)
const primaryPressed = ref(false)
const secondaryPressed = ref(false)
const pointerType = ref('mouse')
const internalChecked = inject<{ IsChecked: { value: boolean }; Invoke: (event?: Event) => void } | null>('toggleSplitButtonState', null)
const checked = computed(() => internalChecked?.IsChecked.value ?? false)
const sourceEnabled = computed(() => boolValue(resolve(props.IsEnabled)))
const localEnabled = ref<boolean | undefined>()
const IsEnabled = computed({ get: () => (localEnabled.value ?? sourceEnabled.value) && (Command.value?.CanExecute?.(CommandParameter.value) ?? true), set: value => { localEnabled.value = boolValue(value); updateXamlBinding(props.IsEnabled, localEnabled.value, instance) } })
const IsTabStop = computed(() => boolValue(resolve(props.IsTabStop)))
const sourceContent = computed(() => resolve(props.Content))
const localContent = shallowRef<unknown>(undefined)
watch(sourceContent, () => { localContent.value = undefined })
const Content = computed({ get: () => localContent.value === undefined ? sourceContent.value : localContent.value, set: value => { localContent.value = value; updateXamlBinding(props.Content, value, instance) } })
const sourceFlyout = computed(() => resolve(props.Flyout))
const localFlyout = shallowRef<unknown>(undefined)
watch(sourceFlyout, () => { localFlyout.value = undefined })
const sourceRequestedTheme = computed(() => String(resolve(props.RequestedTheme)))
const localRequestedTheme = ref<string | undefined>()
watch(sourceRequestedTheme, () => { localRequestedTheme.value = undefined })
const RequestedTheme = computed({ get: () => localRequestedTheme.value ?? sourceRequestedTheme.value, set: value => { localRequestedTheme.value = value; updateXamlBinding(props.RequestedTheme, value, instance) } })
const Command = useUICommand(() => resolve(props.Command))
const CommandParameter = computed(() => resolve(props.CommandParameter))
const AnimatedChevronDownSmallVisualSource = animatedIconVisualSourceComponents.AnimatedChevronDownSmallVisualSource
const propertyNodes = computed(() => {
  const main: VNode[] = [], flyout: VNode[] = []
  const collect = (nodes: VNode[]) => { for (const node of nodes) {
    if (node.type === Comment || node.type === Text && !String(node.children ?? '').trim()) continue
    if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children as VNode[]); continue }
    if (getButtonContentProperty(node)) continue
    const property = (node.type as { __splitButtonProperty?: string })?.__splitButtonProperty
    if (property) {
      const propertySlot = (node.children as { default?: () => VNode[] })?.default
      if (propertySlot) (property === 'flyout' ? flyout : main).push(...propertySlot())
    } else main.push(node)
  } }
  collect(slots.default?.() ?? [])
  return { main, flyout }
})
const flyoutNodes = computed(() => {
  if (localFlyout.value === undefined && propertyNodes.value.flyout.length) return propertyNodes.value.flyout
  const value = localFlyout.value === undefined ? sourceFlyout.value : localFlyout.value
  return isVNode(value) ? [value] : []
})
const MainOutlet = defineComponent({ setup: () => () => {
  const templated = renderTemplate(Content.value)
  if (templated) return templated
  if (localContent.value === undefined && propertyNodes.value.main.length) {
    const nodes = normalizeXamlNodes(propertyNodes.value.main, instance)
    return nodes.every(node => node.type === Text)
      ? h('span', { class: 'win-button-default-text' }, nodes.map(node => String(node.children ?? '')).join(''))
      : h(Fragment, nodes)
  }
  return typeof Content.value === 'string' || typeof Content.value === 'number'
    ? h('span', { class: 'win-button-default-text' }, String(Content.value))
    : isVNode(Content.value) ? h(Fragment, normalizeXamlNodes([Content.value], instance)) : null
} })
const FlyoutOutlet = defineComponent({ setup: () => () => h(Fragment, normalizeXamlNodes(flyoutNodes.value, instance).map(node => cloneVNode(node, { ref: (api: unknown) => { attachedFlyout.value = api }, onOpened: () => { isOpen.value = true }, onClosed: () => { isOpen.value = false } }, true))) })
const Flyout = computed({ get: () => localFlyout.value !== undefined && !isVNode(localFlyout.value) ? localFlyout.value : attachedFlyout.value ?? sourceFlyout.value, set: value => { Flyout.value?.Hide?.(); attachedFlyout.value = null; localFlyout.value = value; isOpen.value = false; updateXamlBinding(props.Flyout, value, instance) } })
const Padding = computed(() => resolve(props.Padding))
const CornerRadius = computed(() => resolve(props.CornerRadius))
const FontFamily = computed(() => resolve(props.FontFamily))
const FontSize = computed(() => resolve(props.FontSize))
const FontWeight = computed(() => resolve(props.FontWeight))
const HorizontalContentAlignment = computed(() => resolve(props.HorizontalContentAlignment))
const VerticalContentAlignment = computed(() => resolve(props.VerticalContentAlignment))
const resource = (name: string) => `var(--SplitButton${name})`
const touchPressed = computed(() => Boolean(keyPressed.value) || pointerType.value === 'touch' && (primaryPressed.value || secondaryPressed.value))
const commonSuffix = computed(() => isOpen.value || touchPressed.value ? 'Pressed' : '')
const PrimaryBackground = computed(() => !IsEnabled.value ? 'transparent' : !checked.value && !commonSuffix.value && !primaryOver.value && !primaryPressed.value && props.Background ? resolve(props.Background) : resource(`Background${checked.value ? 'Checked' : ''}${commonSuffix.value || (primaryPressed.value ? 'Pressed' : primaryOver.value && pointerType.value !== 'touch' ? 'PointerOver' : '')}`))
const SecondaryBackground = computed(() => !IsEnabled.value ? 'transparent' : !checked.value && !commonSuffix.value && !secondaryOver.value && !secondaryPressed.value && props.Background ? resolve(props.Background) : resource(`Background${checked.value ? 'Checked' : ''}${commonSuffix.value || (secondaryPressed.value ? 'Pressed' : secondaryOver.value && pointerType.value !== 'touch' ? 'PointerOver' : '')}`))
const PrimaryForeground = computed(() => !IsEnabled.value ? resource('ForegroundDisabled') : !checked.value && !commonSuffix.value && !primaryOver.value && !primaryPressed.value && props.Foreground ? resolve(props.Foreground) : resource(`Foreground${checked.value ? 'Checked' : ''}${commonSuffix.value || (primaryPressed.value ? 'Pressed' : primaryOver.value && pointerType.value !== 'touch' ? 'PointerOver' : '')}`))
const SecondaryForeground = computed(() => !IsEnabled.value ? resource('ForegroundDisabled') : checked.value ? resource(`ForegroundChecked${commonSuffix.value || (secondaryPressed.value ? 'Pressed' : secondaryOver.value ? 'PointerOver' : '')}`) : resource(commonSuffix.value || secondaryPressed.value ? 'ForegroundSecondaryPressed' : secondaryOver.value ? 'ForegroundPointerOver' : 'ForegroundSecondary'))
const PrimaryBorderBrush = computed(() => !IsEnabled.value ? resource('BorderBrushDisabled') : !checked.value && !commonSuffix.value && !primaryPressed.value && props.BorderBrush ? resolve(props.BorderBrush) : resource(`BorderBrush${checked.value ? 'Checked' : ''}${commonSuffix.value || (!checked.value && primaryPressed.value ? 'Pressed' : '')}`))
const SecondaryBorderBrush = computed(() => !IsEnabled.value ? resource('BorderBrushDisabled') : !checked.value && !commonSuffix.value && !secondaryPressed.value && props.BorderBrush ? resolve(props.BorderBrush) : resource(`BorderBrush${checked.value ? 'Checked' : ''}${commonSuffix.value || (!checked.value && secondaryPressed.value ? 'Pressed' : '')}`))
const DividerBackground = computed(() => resource(checked.value ? 'BorderBrushCheckedDivider' : 'BorderBrushDivider'))
const hostAttrs = computed(() => {
  const rest = Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style', 'Click', 'onClick'].includes(key)))
  const automation = rest['AutomationProperties.Name']; delete rest['AutomationProperties.Name']
  if (automation) rest['aria-label'] = String(resolve(automation))
  return rest
})
const hostStyle = computed(() => {
  const style: Record<string, unknown> = { margin: xamlThickness(resolve(props.Margin)), justifySelf: alignment(resolve(props.HorizontalAlignment), 'horizontal'), alignSelf: alignment(resolve(props.VerticalAlignment), 'vertical'), outlineOffset: cssLength(resolve(props.FocusVisualMargin)) }
  style['--SplitButtonPrimaryBorderBrush'] = PrimaryBorderBrush.value
  style['--SplitButtonSecondaryBorderBrush'] = SecondaryBorderBrush.value
  for (const name of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) if (resolve(props[name]) !== '') style[name[0].toLowerCase() + name.slice(1)] = cssLength(resolve(props[name]))
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  if (resolve(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return [attrs.style, style]
})
const api = proxyRefs({ IsEnabled, RequestedTheme, ContentTemplate, ContentTransitions, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? attrs.Name ?? ''), Content: computed({ get: () => localContent.value !== undefined ? localContent.value : propertyNodes.value.main[0] ?? Content.value, set: value => { Content.value = value } }), Flyout, Command, CommandParameter, Element: root, IsFlyoutOpen: isOpen, Focus: () => { root.value?.focus(); return IsEnabled.value } })
defineExpose(api)
function invoke(event?: Event) {
  if (!IsEnabled.value) return
  internalChecked?.Invoke(event)
  const args = { OriginalSource: api, OriginalEvent: event }
  emit('Click', api, args)
  resolveXamlHandler(attrs.Click, instance)?.(api, args)
  if (Command.value?.CanExecute?.(CommandParameter.value) ?? true) Command.value?.Execute(CommandParameter.value)
}
function openFlyout() { if (IsEnabled.value && Flyout.value?.ShowAt) void Flyout.value.ShowAt(root.value, { Placement: 'BottomEdgeAlignedLeft' }) }
function onPrimaryClick(_sender: unknown, args: { OriginalEvent?: Event }) { root.value?.focus({ preventScroll: true }); invoke(args?.OriginalEvent) }
function onSecondaryClick() { root.value?.focus({ preventScroll: true }); openFlyout() }
function pointer(args: { OriginalEvent?: PointerEvent }) { pointerType.value = args?.OriginalEvent?.pointerType ?? 'mouse' }
function onPrimaryEntered(_s: unknown, a: any) { pointer(a); primaryOver.value = true }
function onPrimaryExited(_s: unknown, a: any) { pointer(a); primaryOver.value = false; primaryPressed.value = false }
function onPrimaryPressed(_s: unknown, a: any) { pointer(a); primaryPressed.value = true }
function onPrimaryReleased(_s: unknown, a: any) { pointer(a); primaryPressed.value = false }
function onPrimaryMoved(sender: { IsPressed: boolean; IsPointerOver: boolean }) { primaryPressed.value = sender.IsPressed; primaryOver.value = sender.IsPointerOver }
function onSecondaryEntered(_s: unknown, a: any) { pointer(a); secondaryOver.value = true }
function onSecondaryExited(_s: unknown, a: any) { pointer(a); secondaryOver.value = false; secondaryPressed.value = false }
function onSecondaryPressed(_s: unknown, a: any) { pointer(a); secondaryPressed.value = true }
function onSecondaryReleased(_s: unknown, a: any) { pointer(a); secondaryPressed.value = false }
function onSecondaryMoved(sender: { IsPressed: boolean; IsPointerOver: boolean }) { secondaryPressed.value = sender.IsPressed; secondaryOver.value = sender.IsPointerOver }
function clearKey() { keyPressed.value = ''; primaryPressed.value = false; secondaryPressed.value = false }
function onKeyDown(event: KeyboardEvent) {
  if (!IsEnabled.value || event.target !== root.value) return
  if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) keyPressed.value = event.key }
  if (event.key === 'F4' || event.key === 'ArrowDown' && event.altKey) event.preventDefault()
}
function onKeyUp(event: KeyboardEvent) {
  if (!IsEnabled.value || event.target !== root.value) return
  if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); const click = keyPressed.value === event.key; clearKey(); if (click) invoke(event) }
  else if (event.key === 'F4' || event.key === 'ArrowDown' && event.altKey) { event.preventDefault(); openFlyout() }
}
watch(sourceEnabled, () => { localEnabled.value = undefined })
watch(IsEnabled, enabled => { if (!enabled) { clearKey(); Flyout.value?.Hide?.() } })
onMounted(() => window.addEventListener('blur', clearKey))
onBeforeUnmount(() => { window.removeEventListener('blur', clearKey); Flyout.value?.Hide?.() })
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), IsEnabled, Content, ContentTemplate, ContentTransitions, CornerRadius, Padding, FontFamily, FontSize, FontWeight, HorizontalContentAlignment, VerticalContentAlignment, PrimaryBackground, SecondaryBackground, PrimaryForeground, SecondaryForeground, PrimaryBorderBrush, SecondaryBorderBrush, DividerBackground, OnPrimaryClick: onPrimaryClick, OnSecondaryClick: onSecondaryClick, OnPrimaryEntered: onPrimaryEntered, OnPrimaryExited: onPrimaryExited, OnPrimaryPressed: onPrimaryPressed, OnPrimaryReleased: onPrimaryReleased, OnPrimaryMoved: onPrimaryMoved, OnSecondaryEntered: onSecondaryEntered, OnSecondaryExited: onSecondaryExited, OnSecondaryPressed: onSecondaryPressed, OnSecondaryReleased: onSecondaryReleased, OnSecondaryMoved: onSecondaryMoved })
</script>

<style>
.win-split-button { position: relative; display: inline-grid; box-sizing: border-box; min-width: 71px; max-width: 100%; min-height: 0; outline: none; border: 0; padding: 0; background: transparent; border-radius: var(--ControlCornerRadius, 4px); }
.win-split-root-grid { min-width: 0; min-height: 0; overflow: hidden; }
.win-split-primary-background, .win-split-secondary-background { pointer-events: none; }
.win-split-primary-border, .win-split-secondary-border { pointer-events: none; z-index: 2; border-color: transparent !important; }
.win-split-primary-border::after, .win-split-secondary-border::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor;
}
.win-split-primary-border { position: relative; }
.win-split-secondary-border { position: relative; }
.win-split-primary-border::after { inset: -1px 0 -1px -1px; padding: 1px 0 1px 1px; background: var(--SplitButtonPrimaryBorderBrush); }
.win-split-secondary-border::after { inset: -1px -1px -1px 0; padding: 1px 1px 1px 0; background: var(--SplitButtonSecondaryBorderBrush); }
.win-split-root-grid .win-btn { min-height: 0; min-width: 0; height: 100%; border-radius: 0; background: transparent; transition: none; --ButtonBackgroundPointerOver: transparent; --ButtonBackgroundPressed: transparent; --ButtonBackgroundDisabled: var(--SplitButtonBackgroundDisabled); --ButtonForegroundPointerOver: var(--ButtonForeground); --ButtonForegroundPressed: var(--ButtonForeground); --ButtonForegroundDisabled: var(--SplitButtonForegroundDisabled); }
.win-split-root-grid .win-button-content-presenter { transition: none; }
.win-split-main-button { border-radius: 4px 0 0 4px !important; }
.win-split-secondary-button { border-radius: 0 4px 4px 0 !important; }
.win-split-button.keyboard-pressed .win-split-secondary-button { grid-column: 1 / 4 !important; z-index: 1; }
.win-split-button.system-focus:focus-visible { outline: 2px solid var(--FocusStrokeColorOuterBrush, var(--text-primary)); box-shadow: inset 0 0 0 1px var(--FocusStrokeColorInnerBrush, var(--app-bg)); }
</style>
